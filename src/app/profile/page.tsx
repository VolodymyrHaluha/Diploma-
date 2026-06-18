import { ProfileClient } from '@/app/profile/ProfileClient';
import { ensureDatabaseReady, getDbPool } from '@/lib/server/db';
import { getSessionUserId } from '@/lib/server/session';
import { listUserTrainings } from '@/lib/server/training-repository';

export const dynamic = 'force-dynamic';

async function getProfileMembershipStatus(userId: number) {
  await ensureDatabaseReady();
  const pool = getDbPool();
  const tableResult = await pool.query<{ exists: boolean }>(
    `SELECT to_regclass('public.clients') IS NOT NULL AS exists`
  );

  if (!tableResult.rows[0]?.exists) {
    return null;
  }

  const statusResult = await pool.query<{ status: string }>(
    `SELECT status
     FROM clients
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return statusResult.rows[0]?.status ?? null;
}

export default async function ProfilePage() {
  const userId = await getSessionUserId();
  const [initialTrainings, initialMembershipStatus] = userId
    ? await Promise.all([listUserTrainings(userId), getProfileMembershipStatus(userId)])
    : [[], null];

  return <ProfileClient initialTrainings={initialTrainings} initialMembershipStatus={initialMembershipStatus} />;
}