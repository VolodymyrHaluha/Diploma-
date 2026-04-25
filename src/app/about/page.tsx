
import { Navbar } from '@/components/layout/Navbar';
import { Trainers } from '@/components/sections/Trainers';
import { EquipmentGallery } from '@/components/sections/EquipmentGallery';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <section className="py-20 container mx-auto px-4 text-center">
        <h1 className="text-5xl font-headline font-bold mb-6">Про <span className="text-primary">ZenithFit</span></h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          ZenithFit — це не просто спортзал. Ми — високопродуктивна спільнота, віддана розширенню меж людських можливостей. 
          Наша місія — надихати на трансформацію через преміальний сервіс та інноваційні підходи до фітнесу.
        </p>
      </section>
      <Trainers />
      <EquipmentGallery />
      <Footer />
    </main>
  );
}
