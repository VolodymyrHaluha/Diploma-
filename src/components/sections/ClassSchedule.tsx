"use client"

import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ClassSchedule() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState('Monday');

  const classes = [
    { time: '07:00 AM', name: 'Power Yoga', instructor: 'Elena Vance', intensity: 'Medium', room: 'Zen Studio' },
    { time: '09:00 AM', name: 'HIIT Circuit', instructor: 'Marcus Thorne', intensity: 'High', room: 'Main Floor' },
    { time: '11:00 AM', name: 'Spin Mastery', instructor: 'David Beck', intensity: 'High', room: 'Cycle Lab' },
    { time: '04:00 PM', name: 'Body Pump', instructor: 'Sarah J.', intensity: 'Medium', room: 'Studio 1' },
    { time: '06:00 PM', name: 'Boxing Basics', instructor: 'Tyson R.', intensity: 'Extreme', room: 'Combat Zone' },
  ];

  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div id="schedule" />
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter">Weekly <span className="text-primary">Schedule</span></h2>
          <p className="text-muted-foreground">Find the perfect class that fits your busy lifestyle. Filter by day and book your spot instantly.</p>
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
                <TableHead className="font-headline font-bold text-foreground">Time</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Class Name</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Instructor</TableHead>
                <TableHead className="font-headline font-bold text-foreground">Intensity</TableHead>
                <TableHead className="font-headline font-bold text-foreground text-right">Action</TableHead>
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
                        cls.intensity === 'High' || cls.intensity === 'Extreme' ? "border-red-500/50 text-red-500" : "border-secondary/50 text-secondary"
                      )}
                    >
                      {cls.intensity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-secondary text-background hover:bg-secondary/90 font-bold">Book Spot</Button>
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
