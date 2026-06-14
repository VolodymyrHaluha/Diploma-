"use client"

import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Сара Дженкінс',
      role: 'Марафонка',
      content: 'ZenithFit повністю змінив мій підхід до тренувань. Силова зона — найкраща в місті, а тренери справді зацікавлені в моєму прогресі.',
      avatar: 'СД'
    },
    {
      name: 'Джеймс Родрігес',
      role: 'Підприємець',
      content: 'Гнучкий графік і преміальна SPA-зона роблять клуб ідеальним для зайнятих людей. Це не просто зал — це новий рівень стилю життя.',
      avatar: 'ДР'
    },
    {
      name: 'Емілі Чен',
      role: 'Прихильниця йоги',
      content: 'Zen Studio дуже спокійна та добре обладнана. Я відчула значний прогрес у гнучкості й самопочутті після занять у ZenithFit.',
      avatar: 'ЕЧ'
    }
  ];

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Голос <span className="text-primary">учасників</span></h2>
          <p className="text-muted-foreground">Історії людей, які досягають результатів разом із ZenithFit.</p>
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
                    “{review.content}”
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
