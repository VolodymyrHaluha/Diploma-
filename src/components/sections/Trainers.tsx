import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export function Trainers() {
  const trainers = [
    { 
      id: 'trainer-1', 
      name: 'Marcus Thorne', 
      specialty: 'Strength & Conditioning', 
      experience: '12 Years',
      socials: true 
    },
    { 
      id: 'trainer-2', 
      name: 'Elena Vance', 
      specialty: 'Yoga & Pilates', 
      experience: '8 Years',
      socials: true 
    },
    { 
      id: 'trainer-3', 
      name: 'David Beck', 
      specialty: 'Bodybuilding Specialist', 
      experience: '15 Years',
      socials: true 
    },
  ];

  return (
    <section id="trainers" className="py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Expert <span className="text-secondary">Trainers</span></h2>
            <p className="text-muted-foreground">Work with the best in the industry. Our trainers are certified professionals dedicated to your success.</p>
          </div>
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-background">View All Experts</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((trainer) => {
            const img = PlaceHolderImages.find(p => p.id === trainer.id);
            return (
              <Card key={trainer.id} className="glass-card overflow-hidden group">
                <div className="relative h-[400px]">
                  <Image 
                    src={img?.imageUrl || ""} 
                    alt={trainer.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint="fitness trainer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10"><Instagram className="w-4 h-4" /></Button>
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10"><Twitter className="w-4 h-4" /></Button>
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10"><Linkedin className="w-4 h-4" /></Button>
                  </div>
                </div>
                <CardContent className="p-6 text-center space-y-2">
                  <h3 className="text-xl font-headline font-bold text-foreground">{trainer.name}</h3>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider">{trainer.specialty}</p>
                  <div className="text-xs text-muted-foreground mt-4 pb-4">Experience: {trainer.experience}</div>
                  <Button className="w-full bg-transparent border border-white/10 hover:border-secondary hover:text-secondary hover:bg-transparent">
                    Book Training
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}