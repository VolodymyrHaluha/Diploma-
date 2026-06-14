import { Navbar } from '@/components/layout/Navbar';
import { DynamicDashboard } from '@/components/dashboard/DynamicDashboard';
import { Footer } from '@/components/layout/Footer';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24" />
      <DynamicDashboard />
      <Footer />
    </main>
  );
}
