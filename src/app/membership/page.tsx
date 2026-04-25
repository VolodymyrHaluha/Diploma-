
import { Navbar } from '@/components/layout/Navbar';
import { MembershipPlans } from '@/components/sections/MembershipPlans';
import { Footer } from '@/components/layout/Footer';

export default function MembershipPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <MembershipPlans />
      <Footer />
    </main>
  );
}
