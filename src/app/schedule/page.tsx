export const runtime = 'edge';

import { Navbar } from '@/components/layout/Navbar';
import { ClassSchedule } from '@/components/sections/ClassSchedule';
import { Footer } from '@/components/layout/Footer';
import { listClassSessions } from '@/lib/server/training-repository';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const initialDay = 'Monday';
  const initialClasses = await listClassSessions(initialDay);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24" />
      <ClassSchedule initialClasses={initialClasses} initialDay={initialDay} />
      <Footer />
    </main>
  );
}
