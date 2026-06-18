"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ClassSession } from '@/lib/training-types';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

type Trainer = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
};

type ClassesResponse = {
  classes?: ClassSession[];
  message?: string;
};

const trainers: Trainer[] = [
  { id: 'trainer-1', name: 'Маркус Торн', specialty: 'Силова підготовка', experience: '12 років' },
  { id: 'trainer-2', name: 'Олена Венс', specialty: 'Йога та пілатес', experience: '8 років' },
  { id: 'trainer-3', name: 'Девід Бек', specialty: 'Бодибілдинг', experience: '15 років' },
];

const dayLabels: Record<string, string> = {
  Monday: 'Понеділок',
  Tuesday: 'Вівторок',
  Wednesday: 'Середа',
  Thursday: 'Четвер',
  Friday: 'Пʼятниця',
  Saturday: 'Субота',
  Sunday: 'Неділя',
};

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getUniqueValues<T>(items: T[], getValue: (item: T) => string) {
  return Array.from(new Set(items.map(getValue)));
}

export function Trainers() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isActive = true;
    setIsLoadingClasses(true);

    fetch('/api/classes', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({})) as ClassesResponse;

        if (!response.ok) {
          throw new Error(data.message ?? 'Не вдалося завантажити заняття.');
        }

        return data.classes ?? [];
      })
      .then((items) => {
        if (isActive) setClasses(items);
      })
      .catch((error) => {
        if (!isActive) return;
        setMessage(error instanceof Error ? error.message : 'Не вдалося завантажити заняття.');
      })
      .finally(() => {
        if (isActive) setIsLoadingClasses(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const trainerClasses = useMemo(() => {
    if (!selectedTrainer) return [];

    return classes.filter((classSession) => classSession.trainer_name === selectedTrainer.name);
  }, [classes, selectedTrainer]);

  const availableDays = useMemo(() => {
    const days = getUniqueValues(trainerClasses, (classSession) => classSession.day_of_week);

    return days.sort((firstDay, secondDay) => dayOrder.indexOf(firstDay) - dayOrder.indexOf(secondDay));
  }, [trainerClasses]);

  const availableTitles = useMemo(() => {
    const dayClasses = selectedDay
      ? trainerClasses.filter((classSession) => classSession.day_of_week === selectedDay)
      : trainerClasses;

    return getUniqueValues(dayClasses, (classSession) => classSession.title);
  }, [selectedDay, trainerClasses]);

  const availableTimes = useMemo(() => {
    return trainerClasses.filter((classSession) => {
      return classSession.day_of_week === selectedDay && classSession.title === selectedTitle;
    });
  }, [selectedDay, selectedTitle, trainerClasses]);

  const openBookingDialog = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setSelectedDay('');
    setSelectedTitle('');
    setSelectedClassId('');
    setMessage('');
  };

  const closeBookingDialog = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTrainer(null);
      setSelectedDay('');
      setSelectedTitle('');
      setSelectedClassId('');
      setMessage('');
    }
  };

  const handleEnroll = async () => {
    if (!selectedClassId) {
      setMessage('Оберіть день, вид заняття та годину тренування.');
      return;
    }

    setMessage('');
    setIsEnrolling(true);

    try {
      const response = await fetch('/api/classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_session_id: Number(selectedClassId) }),
      });
      const data = await response.json().catch(() => ({})) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? 'Не вдалося записатися.');
      }

      setMessage('Запис додано в історію тренувань на сторінці профілю.');
      setSelectedDay('');
      setSelectedTitle('');
      setSelectedClassId('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не вдалося записатися.');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <section id="trainers" className="py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">
              Професійні <span className="text-secondary">тренери</span>
            </h2>
            <p className="text-muted-foreground">
              Працюйте з найкращими фахівцями індустрії. Наші тренери сертифіковані та зосереджені на вашому
              результаті.
            </p>
          </div>
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-background">
            Переглянути всіх
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((trainer) => {
            const img = PlaceHolderImages.find((placeholder) => placeholder.id === trainer.id);

            return (
              <Card key={trainer.id} className="glass-card overflow-hidden group">
                <div className="relative h-[400px]">
                  <Image
                    src={img?.imageUrl || ''}
                    alt={trainer.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint="fitness trainer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6 text-center space-y-2">
                  <h3 className="text-xl font-headline font-bold text-foreground">{trainer.name}</h3>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider">{trainer.specialty}</p>
                  <div className="text-xs text-muted-foreground mt-4 pb-4">Досвід: {trainer.experience}</div>
                  <Button
                    className="w-full bg-transparent border border-white/10 hover:border-secondary hover:text-secondary hover:bg-transparent"
                    onClick={() => openBookingDialog(trainer)}
                  >
                    Записатися на тренування
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={Boolean(selectedTrainer)} onOpenChange={closeBookingDialog}>
        <DialogContent className="glass-card border-white/10 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Запис на тренування</DialogTitle>
            <DialogDescription>
              {selectedTrainer
                ? `Оберіть день, вид заняття та годину для тренера ${selectedTrainer.name}.`
                : 'Оберіть параметри тренування.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="training-day">День</Label>
              <Select
                value={selectedDay}
                onValueChange={(value) => {
                  setSelectedDay(value);
                  setSelectedTitle('');
                  setSelectedClassId('');
                  setMessage('');
                }}
                disabled={isLoadingClasses || !availableDays.length}
              >
                <SelectTrigger id="training-day" className="bg-background/70 border-white/10">
                  <SelectValue placeholder={isLoadingClasses ? 'Завантажуємо дні...' : 'Оберіть день'} />
                </SelectTrigger>
                <SelectContent>
                  {availableDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {dayLabels[day] ?? day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-title">Вид заняття</Label>
              <Select
                value={selectedTitle}
                onValueChange={(value) => {
                  setSelectedTitle(value);
                  setSelectedClassId('');
                  setMessage('');
                }}
                disabled={!selectedDay || !availableTitles.length}
              >
                <SelectTrigger id="training-title" className="bg-background/70 border-white/10">
                  <SelectValue placeholder="Оберіть вид заняття" />
                </SelectTrigger>
                <SelectContent>
                  {availableTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-time">Година</Label>
              <Select
                value={selectedClassId}
                onValueChange={(value) => {
                  setSelectedClassId(value);
                  setMessage('');
                }}
                disabled={!selectedTitle || !availableTimes.length}
              >
                <SelectTrigger id="training-time" className="bg-background/70 border-white/10">
                  <SelectValue placeholder="Оберіть годину" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((classSession) => (
                    <SelectItem key={classSession.id} value={String(classSession.id)}>
                      {classSession.start_time} · {classSession.capacity} місць
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isLoadingClasses && selectedTrainer && !trainerClasses.length ? (
              <p className="text-sm text-destructive">Для цього тренера поки немає доступних занять.</p>
            ) : null}
            {message ? <p className="text-sm text-secondary">{message}</p> : null}
          </div>

          <DialogFooter>
            <Button
              className="bg-secondary text-background hover:bg-secondary/90 font-bold"
              disabled={isEnrolling || !selectedClassId}
              onClick={handleEnroll}
            >
              {isEnrolling ? 'Записуємо...' : 'Записатись'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
