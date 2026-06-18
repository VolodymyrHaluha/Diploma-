"use client";

import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ClassSession } from '@/lib/training-types';

const days = [
  { label: 'Понеділок', value: 'Monday' },
  { label: 'Вівторок', value: 'Tuesday' },
  { label: 'Середа', value: 'Wednesday' },
  { label: 'Четвер', value: 'Thursday' },
  { label: 'Пʼятниця', value: 'Friday' },
  { label: 'Субота', value: 'Saturday' },
  { label: 'Неділя', value: 'Sunday' },
];

const dayIndexByValue = new Map(days.map((day, index) => [day.value, index]));
const weekDayValues = days.map((day) => day.value);

function getTodayScheduleDay() {
  const day = new Date().getDay();

  return day === 0 ? 'Sunday' : weekDayValues[day - 1];
}

function canEnrollForDay(dayValue: string, todayValue = getTodayScheduleDay()) {
  if (todayValue === 'Saturday' || todayValue === 'Sunday') {
    return true;
  }

  const dayIndex = dayIndexByValue.get(dayValue);
  const todayIndex = dayIndexByValue.get(todayValue);

  return dayIndex !== undefined && todayIndex !== undefined && dayIndex >= todayIndex;
}

function getInitialActiveDay(fallbackDay: string) {
  return canEnrollForDay(fallbackDay) ? fallbackDay : getTodayScheduleDay();
}

type ClassesResponse = {
  classes?: ClassSession[];
  message?: string;
};

type ClassScheduleProps = {
  initialClasses?: ClassSession[];
  initialDay?: string;
};

const emptyClassSessions: ClassSession[] = [];

export function ClassSchedule({ initialClasses = emptyClassSessions, initialDay = 'Monday' }: ClassScheduleProps) {
  const [activeDay, setActiveDay] = useState(() => getInitialActiveDay(initialDay));
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;
    const canUseInitialClasses = activeDay === initialDay && initialClasses.length > 0;
    setIsLoading(!canUseInitialClasses);
    setMessage('');

    if (canUseInitialClasses) {
      setClasses(initialClasses);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    fetch(`/api/classes?day=${encodeURIComponent(activeDay)}`, { cache: 'no-store' })
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
        setClasses([]);
        setMessage(error instanceof Error ? error.message : 'Не вдалося завантажити заняття.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [activeDay, initialClasses, initialDay]);

  const handleEnroll = async (classSessionId: number) => {
    setMessage('');
    setEnrollingId(classSessionId);

    try {
      const response = await fetch('/api/classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_session_id: classSessionId }),
      });
      const data = await response.json().catch(() => ({})) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? 'Не вдалося записатися.');
      }

      setMessage('Запис додано в історію тренувань профілю.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не вдалося записатися.');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div id="schedule" />
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter">
            Тижневий <span className="text-primary">розклад</span>
          </h2>
          <p className="text-muted-foreground">
            Знайдіть заняття під свій ритм життя. У будні можна бронювати лише сьогоднішні та майбутні дні
            тижня, а у вихідні відкритий запис на весь наступний тиждень.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {days.map((day) => {
            const isAvailable = canEnrollForDay(day.value);

            return (
              <button
                key={day.value}
                onClick={() => {
                  if (isAvailable) setActiveDay(day.value);
                }}
                disabled={!isAvailable}
                aria-disabled={!isAvailable}
                title={isAvailable ? undefined : 'Запис на цей день уже недоступний цього тижня'}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-bold transition-all border',
                  activeDay === day.value
                    ? 'bg-primary text-background border-primary'
                    : 'bg-white/5 text-muted-foreground border-white/10 hover:border-primary/50',
                  !isAvailable && 'cursor-not-allowed opacity-40 grayscale hover:border-white/10'
                )}
              >
                {day.label}
              </button>
            );
          })}
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
              {isLoading ? (
                <TableRow className="border-b-white/5">
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Завантажуємо заняття...
                  </TableCell>
                </TableRow>
              ) : classes.length ? (
                classes.map((cls) => {
                  const isClassDayAvailable = canEnrollForDay(cls.day_of_week);

                  return (
                    <TableRow key={cls.id} className="border-b-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium text-primary">{cls.start_time}</TableCell>
                      <TableCell>
                        <div className="font-bold">{cls.title}</div>
                        <div className="text-xs text-muted-foreground">{cls.capacity} місць</div>
                      </TableCell>
                      <TableCell>{cls.trainer_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase border-secondary/50 text-secondary">
                          {cls.specialty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-secondary text-background hover:bg-secondary/90 font-bold"
                          disabled={enrollingId === cls.id || !isClassDayAvailable}
                          onClick={() => handleEnroll(cls.id)}
                        >
                          {!isClassDayAvailable
                            ? 'Недоступно'
                            : enrollingId === cls.id
                              ? 'Записуємо...'
                              : 'Записатися'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-b-white/5">
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    На цей день занять немає.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {message ? <p className="mt-4 text-center text-sm text-secondary">{message}</p> : null}
      </div>
    </section>
  );
}
