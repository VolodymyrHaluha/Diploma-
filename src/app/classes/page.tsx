
import { Navbar } from '@/components/layout/Navbar';
import { ClassSchedule } from '@/components/sections/ClassSchedule';
import { Footer } from '@/components/layout/Footer';

export default function ClassesPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <ClassSchedule />
      <Footer />
    </main>
  );
}
