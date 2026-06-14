import { ProfileClient } from '@/app/profile/ProfileClient';
import { getSessionUserId } from '@/lib/server/session';
import { listUserTrainings } from '@/lib/server/training-repository';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userId = await getSessionUserId();
  const initialTrainings = userId ? await listUserTrainings(userId) : [];

  return <ProfileClient initialTrainings={initialTrainings} />;
}
