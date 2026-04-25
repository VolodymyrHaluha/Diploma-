import { Navbar } from '@/components/layout/Navbar';
import { ThreeColumnDashboard } from '@/components/dashboard/ThreeColumnDashboard';
import { Footer } from '@/components/layout/Footer';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24" />
      <ThreeColumnDashboard />
      <Footer />
    </main>
  );
}
