import { ProfileClient } from '@/app/profile/ProfileClient';
import { getSessionUserId } from '@/lib/server/session';
import { getUserMembershipStatus } from '@/lib/server/membership-repository';
import { listUserTrainings } from '@/lib/server/training-repository';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userId = await getSessionUserId();
  const [initialTrainings, initialMembershipStatus] = userId
    ? await Promise.all([listUserTrainings(userId), getUserMembershipStatus(userId)])
    : [[], null];

  return <ProfileClient initialTrainings={initialTrainings} initialMembershipStatus={initialMembershipStatus} />;
}
