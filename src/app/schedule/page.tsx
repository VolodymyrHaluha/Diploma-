import { Navbar } from '@/components/layout/Navbar';
import { ClassSchedule } from '@/components/sections/ClassSchedule';
import { Footer } from '@/components/layout/Footer';

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24" />
      <ClassSchedule />
      <Footer />
    </main>
  );
}
