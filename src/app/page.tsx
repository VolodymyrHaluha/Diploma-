
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { ThreeColumnDashboard } from '@/components/dashboard/ThreeColumnDashboard';
import { MembershipPlans } from '@/components/sections/MembershipPlans';
import { Trainers } from '@/components/sections/Trainers';
import { EquipmentGallery } from '@/components/sections/EquipmentGallery';
import { ClassSchedule } from '@/components/sections/ClassSchedule';
import { Testimonials } from '@/components/sections/Testimonials';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main id="home" className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="bg-background">
        <ThreeColumnDashboard />
      </div>
      <MembershipPlans />
      <Trainers />
      <EquipmentGallery />
      <ClassSchedule />
      <Testimonials />
      <Footer />
    </main>
  );
}
