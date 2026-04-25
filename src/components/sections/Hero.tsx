
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function Counter({ end, suffix = "" }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
}

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={heroImage?.imageUrl || ""} 
          alt="ZenithFit Interior" 
          fill 
          className="object-cover"
          priority
          data-ai-hint="атлетичний зал"
        />
        <div className="absolute inset-0 bg-gradient-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            НОВИЙ ПРЕМІУМ ЗАЛ ВІДКРИТО
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
            Трансформуй своє <span className="text-primary italic">тіло</span>, <br />
            Трансформуй своє <span className="text-secondary italic">життя</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-body">
            Відчуйте вершину фітнесу в ZenithFit. Наші програми, 
            тренери світового класу та сучасне обладнання допоможуть вам вийти за межі можливого.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary text-background font-bold px-8 py-6 text-lg hover:scale-105 transition-transform">
              Стати учасником
            </Button>
            <Button size="lg" variant="outline" className="border-foreground text-foreground font-bold px-8 py-6 text-lg hover:bg-foreground hover:text-background transition-colors">
              Переглянути розклад
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
            {[
              { label: 'Учасників', value: 1500, suffix: '+' },
              { label: 'Тренерів', value: 30, suffix: '' },
              { label: 'Тренажерів', value: 50, suffix: '+' },
              { label: 'Класи/міс', value: 100, suffix: '' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-3xl font-headline font-bold text-primary">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
