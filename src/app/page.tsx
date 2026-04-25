
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { ThreeColumnDashboard } from '@/components/dashboard/ThreeColumnDashboard';
import { Testimonials } from '@/components/sections/Testimonials';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="bg-background">
        <ThreeColumnDashboard />
      </div>
      <Testimonials />
      <Footer />
    </main>
  );
}
