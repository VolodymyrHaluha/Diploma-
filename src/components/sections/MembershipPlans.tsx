"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MembershipPlans() {
  const plans = [
    {
      name: 'Базовий',
      price: '49',
      description: 'Ідеальний старт для комфортного доступу до преміального тренажерного залу.',
      features: ['Доступ до тренажерного залу', 'Роздягальні та шафки', 'Стандартні групові заняття', 'Первинна фітнес-оцінка'],
      popular: false
    },
    {
      name: 'Преміум',
      price: '89',
      description: 'Найпопулярніший план для тих, хто тренується регулярно та хоче більше можливостей.',
      features: ['Усе з Базового плану', 'Необмежені групові заняття', 'Доступ до басейну та SPA', 'Консультація з харчування', '2 гостьові візити на місяць'],
      popular: true
    },
    {
      name: 'VIP',
      price: '149',
      description: 'Максимальний рівень сервісу з персональним супроводом і преміальними перевагами.',
      features: ['Усе з Преміум плану', '4 персональні тренування на місяць', 'Доступ до VIP-зони', 'Сервіс рушників і форми', 'Пакет спортивного харчування'],
      popular: false
    }
  ];

  return (
    <section id="membership" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Оберіть свій <span className="text-primary">абонемент</span></h2>
          <p className="text-muted-foreground">Прозорі тарифи для реальних результатів. Приєднуйтеся до преміальної фітнес-спільноти ZenithFit.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "glass-card flex flex-col transition-all duration-300 hover:-translate-y-2",
                plan.popular ? "border-primary/50 ring-2 ring-primary/20 scale-105" : "border-white/10"
              )}
            >
              {plan.popular && (
                <div className="bg-primary text-background font-bold text-[10px] uppercase tracking-tighter py-1 text-center">
                  Найпопулярніший
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <div className="pt-4 pb-2">
                  <span className="text-4xl font-bold font-headline">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/ міс.</span>
                </div>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="w-full h-px bg-white/10" />
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={cn(
                  "w-full font-bold",
                  plan.popular ? "bg-primary text-background" : "bg-white/5 border-white/10 hover:bg-white/10"
                )}>
                  Обрати план
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}