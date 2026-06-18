import { ensureDatabaseReady, getDbPool } from '@/lib/server/db';
import { findUserById } from '@/lib/server/users-repository';

export type MembershipPlanName = 'Базовий' | 'Преміум' | 'VIP';

type ClientMembershipRow = {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  status: MembershipPlanName;
  updated_at: Date | string;
};

const allowedPlanNames: MembershipPlanName[] = ['Базовий', 'Преміум', 'VIP'];

let membershipTablesReady: Promise<void> | null = null;

function serializeDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function mapClientMembership(row: ClientMembershipRow) {
  return {
    id: Number(row.id),
    user_id: Number(row.user_id),
    full_name: row.full_name,
    email: row.email,
    status: row.status,
    updated_at: serializeDate(row.updated_at),
  };
}

export function isMembershipPlanName(value: string): value is MembershipPlanName {
  return allowedPlanNames.includes(value as MembershipPlanName);
}

async function ensureMembershipTables() {
  if (!membershipTablesReady) {
    membershipTablesReady = (async () => {
      await ensureDatabaseReady();
      const pool = getDbPool();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
          full_name VARCHAR(150) NOT NULL,
          phone VARCHAR(30),
          email VARCHAR(150) NOT NULL,
          photo_url VARCHAR(500),
          status VARCHAR(20) NOT NULL DEFAULT 'Базовий',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT uq_clients_email UNIQUE (email)
        )
      `);

      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id INTEGER`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500)`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      await pool.query(`ALTER TABLE clients DROP CONSTRAINT IF EXISTS chk_clients_status`);
      await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_user_id_unique ON clients (user_id) WHERE user_id IS NOT NULL`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status)`);
    })().catch((error) => {
      membershipTablesReady = null;
      throw error;
    });
  }

  return membershipTablesReady;
}

export async function getUserMembershipStatus(userId: number) {
  await ensureMembershipTables();
  const pool = getDbPool();
  const result = await pool.query<{ status: string }>(
    `SELECT status
     FROM clients
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0]?.status ?? null;
}

export async function activateDemoMembership(userId: number, planName: MembershipPlanName) {
  const user = await findUserById(userId);

  if (!user) {
    return null;
  }

  await ensureMembershipTables();
  const pool = getDbPool();
  const fullName = user.full_name.trim() || user.username;
  const email = user.username.includes('@') ? user.username : `user-${user.id}@zenithfit.demo`;

  const result = await pool.query<ClientMembershipRow>(
    `WITH updated_client AS (
       UPDATE clients
       SET user_id = $1,
           full_name = $2,
           email = $3,
           photo_url = $4,
           status = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 OR email = $3
       RETURNING id, user_id, full_name, email, status, updated_at
     ), inserted_client AS (
       INSERT INTO clients (user_id, full_name, email, photo_url, status)
       SELECT $1, $2, $3, $4, $5
       WHERE NOT EXISTS (SELECT 1 FROM updated_client)
       RETURNING id, user_id, full_name, email, status, updated_at
     )
     SELECT id, user_id, full_name, email, status, updated_at FROM updated_client
     UNION ALL
     SELECT id, user_id, full_name, email, status, updated_at FROM inserted_client
     LIMIT 1`,
    [user.id, fullName, email, user.photo_url, planName]
  );

  return result.rows[0] ? mapClientMembership(result.rows[0]) : null;
}
