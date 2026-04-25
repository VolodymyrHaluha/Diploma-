"use client"

import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Marathon Runner',
      content: 'ZenithFit changed my entire approach to training. The strength and conditioning facility is easily the best in the city, and the trainers actually care about your progress.',
      avatar: 'SJ'
    },
    {
      name: 'James Rodriguez',
      role: 'Business Executive',
      content: 'The 24/7 access and the premium spa facilities make this the perfect club for a busy professional. It is not just a gym; it is a lifestyle upgrade.',
      avatar: 'JR'
    },
    {
      name: 'Emily Chen',
      role: 'Yoga Enthusiast',
      content: 'The Zen Studio is so peaceful and well-equipped. I have seen such improvement in my flexibility and mental health since joining ZenithFit classes.',
      avatar: 'EC'
    }
  ];

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Member <span className="text-primary">Voice</span></h2>
          <p className="text-muted-foreground">Hear from the community achieving greatness at ZenithFit.</p>
        </div>

        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {reviews.map((review, idx) => (
              <CarouselItem key={idx}>
                <div className="glass-card p-10 md:p-16 text-center space-y-8 rounded-3xl border-primary/10">
                  <div className="flex justify-center">
                    <Quote className="w-12 h-12 text-primary opacity-20" />
                  </div>
                  <p className="text-xl md:text-2xl font-body italic leading-relaxed">
                    "{review.content}"
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarFallback className="bg-background text-primary font-bold">{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-headline font-bold text-lg">{review.name}</h4>
                      <p className="text-sm text-secondary uppercase tracking-widest font-bold">{review.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="bg-background/50 border-white/10" />
            <CarouselNext className="bg-background/50 border-white/10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}