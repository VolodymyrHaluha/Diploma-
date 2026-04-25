import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function EquipmentGallery() {
  const items = [
    { id: 'equipment-1', title: 'Cardio Suite', desc: 'Next-gen Matrix treadmills and ellipticals.' },
    { id: 'equipment-2', title: 'Strength Lab', desc: 'Over 5,000kg of Olympic grade weights.' },
    { id: 'equipment-3', title: 'Cycle Studio', desc: 'Immersive sound and lighting spin experience.' },
    { id: 'equipment-4', title: 'Aquatic Center', desc: 'Heated 25m pool and revitalizing spa.' },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter">Premium <span className="text-secondary">Facilities</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explore our world-class facilities equipped with the latest technology in fitness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const img = PlaceHolderImages.find(p => p.id === item.id);
            return (
              <div key={item.id} className="relative h-[300px] rounded-xl overflow-hidden group cursor-pointer">
                <Image 
                  src={img?.imageUrl || ""} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint="gym facility"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-lg font-headline font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}