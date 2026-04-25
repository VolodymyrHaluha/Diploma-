import { Navbar } from '@/components/layout/Navbar';
import { Trainers } from '@/components/sections/Trainers';
import { Footer } from '@/components/layout/Footer';

export default function TrainersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24" />
      <Trainers />
      <Footer />
    </main>
  );
}
