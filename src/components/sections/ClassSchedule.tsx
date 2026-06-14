"use client"

import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ClassSchedule() {
  const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота', 'Неділя'];
  const [activeDay, setActiveDay] = useState('Понеділок');

  const classes = [
    { time: '07:00', name: 'Power Yoga', instructor: 'Олена Венс', intensity: 'Середня', room: 'Zen Studio' },
    { time: '09:00', name: 'HIIT Circuit', instructor: 'Маркус Торн', intensity: 'Висока', room: 'Головний зал' },
    { time: '11:00', name: 'Spin Mastery', instructor: 'Девід Бек', intensity: 'Висока', room: 'Cycle Lab' },
    { time: '16:00', name: 'Body Pump', instructor: 'Сара Дж.', intensity: 'Середня', room: 'Студія 1' },
    { time: '18:00', name: 'Boxing Basics', instructor: 'Тайсон Р.', intensity: 'Екстремальна', room: 'Combat Zone' },
  ];

  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div id="schedule" />
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter">Тижневий <span className="text-primary">розклад</span></h2>
          <p className="text-muted-foreground">Знайдіть заняття під свій ритм життя. Оберіть день і забронюйте місце в групі.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                activeDay === day 
                  ? "bg-primary text-background border-primary" 
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-primary/50"
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-b-white/10">
                <TableHead className="font-headline font-bold text-foreground">Час</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Назва заняття</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Тренер</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Інтенсивність</TableHead>
                <TableHead className="font-headline font-bold text-foreground text-right">Дія</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls, idx) => (
                <TableRow key={idx} className="border-b-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-primary">{cls.time}</TableCell>
                  <TableCell>
                    <div className="font-bold">{cls.name}</div>
                    <div className="text-xs text-muted-foreground">{cls.room}</div>
                  </TableCell>
                  <TableCell>{cls.instructor}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] uppercase",
                        cls.intensity === 'Висока' || cls.intensity === 'Екстремальна' ? "border-red-500/50 text-red-500" : "border-secondary/50 text-secondary"
                      )}
                    >
                      {cls.intensity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-secondary text-background hover:bg-secondary/90 font-bold">Записатися</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}