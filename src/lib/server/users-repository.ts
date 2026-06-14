import bcrypt from 'bcryptjs';
import { ensureDatabaseReady, getDbPool } from '@/lib/server/db';
import { PublicUser, StoredUser, UserAvatar, UserRole } from '@/lib/user-types';

type UserRow = {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  photo_url: string | null;
  full_name: string | null;
  weight: number | null;
  height: number | null;
  created_at: Date | string;
  updated_at: Date | string;
};

let usersTableReady: Promise<void> | null = null;

export type ProfileUpdates = {
  photo_url?: string;
  full_name?: string;
  weight?: number | null;
  height?: number | null;
};

function normalizeAvatar(value: string | null) {
  return value?.trim() || 'dumbbell';
}

function serializeDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function mapUser(row: UserRow): StoredUser {
  return {
    id: Number(row.id),
    username: row.username,
    password_hash: row.password_hash,
    role: row.role,
    photo_url: normalizeAvatar(row.photo_url),
    full_name: row.full_name ?? '',
    weight: row.weight === null ? null : Number(row.weight),
    height: row.height === null ? null : Number(row.height),
    created_at: serializeDate(row.created_at),
    updated_at: serializeDate(row.updated_at),
  };
}

async function ensureUsersTable() {
  if (!usersTableReady) {
    usersTableReady = (async () => {
      await ensureDatabaseReady();
      const pool = getDbPool();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          username VARCHAR(80) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'editor',
          photo_url VARCHAR(500),
          full_name TEXT,
          weight INTEGER,
          height INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT uq_users_username UNIQUE (username),
          CONSTRAINT chk_users_role CHECK (role IN ('admin', 'editor', 'trainer')),
          CONSTRAINT chk_users_weight CHECK (weight IS NULL OR weight > 0),
          CONSTRAINT chk_users_height CHECK (height IS NULL OR height > 0)
        )
      `);

      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500)`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS weight INTEGER`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS height INTEGER`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)`);
    })().catch((error) => {
      usersTableReady = null;
      throw error;
    });
  }

  return usersTableReady;
}

export function toPublicUser(user: StoredUser): PublicUser {
  const { password_hash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

function normalizeBcryptHash(passwordHash: string) {
  return passwordHash.startsWith('$2y$') ? `$2b$${passwordHash.slice(4)}` : passwordHash;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, normalizeBcryptHash(passwordHash));
}

export async function findUserByUsername(username: string) {
  await ensureUsersTable();
  const pool = getDbPool();
  const result = await pool.query<UserRow>(
    `SELECT id, username, password_hash, role, photo_url, full_name, weight, height, created_at, updated_at
     FROM users
     WHERE LOWER(username) = LOWER($1)
     LIMIT 1`,
    [username]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function findUserById(userId: number) {
  await ensureUsersTable();
  const pool = getDbPool();
  const result = await pool.query<UserRow>(
    `SELECT id, username, password_hash, role, photo_url, full_name, weight, height, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function createUser(username: string, password: string) {
  await ensureUsersTable();
  const pool = getDbPool();
  const passwordHash = await hashPassword(password);
  const photoUrl: UserAvatar = Math.random() > 0.5 ? 'dumbbell' : 'bottle';

  const result = await pool.query<UserRow>(
    `INSERT INTO users (username, password_hash, role, photo_url, full_name, weight, height)
     VALUES ($1, $2, 'editor', $3, '', NULL, NULL)
     RETURNING id, username, password_hash, role, photo_url, full_name, weight, height, created_at, updated_at`,
    [username, passwordHash, photoUrl]
  );

  return mapUser(result.rows[0]);
}

export async function updateUserProfile(userId: number, updates: ProfileUpdates) {
  await ensureUsersTable();
  const pool = getDbPool();
  const currentUser = await findUserById(userId);

  if (!currentUser) {
    return null;
  }

  const result = await pool.query<UserRow>(
    `UPDATE users
     SET photo_url = $2,
         full_name = $3,
         weight = $4,
         height = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, username, password_hash, role, photo_url, full_name, weight, height, created_at, updated_at`,
    [
      userId,
      updates.photo_url ?? currentUser.photo_url,
      updates.full_name ?? currentUser.full_name,
      updates.weight === undefined ? currentUser.weight : updates.weight,
      updates.height === undefined ? currentUser.height : updates.height,
    ]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}
