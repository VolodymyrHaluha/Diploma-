
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { DynamicDashboard } from '@/components/dashboard/DynamicDashboard';
import { MembershipPlans } from '@/components/sections/MembershipPlans';
import { Trainers } from '@/components/sections/Trainers';
import { EquipmentGallery } from '@/components/sections/EquipmentGallery';
import { ClassSchedule } from '@/components/sections/ClassSchedule';
import { Testimonials } from '@/components/sections/Testimonials';
import { Footer } from '@/components/layout/Footer';
import { listClassSessions } from '@/lib/server/training-repository';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialDay = 'Monday';
  const initialClasses = await listClassSessions(initialDay);

  return (
    <main id="home" className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="bg-background">
        <DynamicDashboard />
      </div>
      <MembershipPlans />
      <Trainers />
      <EquipmentGallery />
      <ClassSchedule initialClasses={initialClasses} initialDay={initialDay} />
      <Testimonials />
      <Footer />
    </main>
  );
}
