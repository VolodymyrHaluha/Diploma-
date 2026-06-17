'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, CupSoda, Dumbbell, ImagePlus, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserAvatarIcon } from '@/components/auth/UserAvatarIcon';
import { UserAvatar } from '@/lib/auth-storage';
import { UserTraining } from '@/lib/training-types';

const dayOrder = [
  { value: 'Monday', label: 'Понеділок' },
  { value: 'Tuesday', label: 'Вівторок' },
  { value: 'Wednesday', label: 'Середа' },
  { value: 'Thursday', label: 'Четвер' },
  { value: 'Friday', label: 'Пʼятниця' },
  { value: 'Saturday', label: 'Субота' },
  { value: 'Sunday', label: 'Неділя' },
];

const dayLabels: Record<string, string> = {
  ...Object.fromEntries(dayOrder.map((day) => [day.value, day.label])),
};

const trainingDayChartColors = ['#66CCFF', '#26D9BA', '#FF9933', '#A17FFF', '#FF668A', '#FFD166', '#7BD88F'];

type ProfileClientProps = {
  initialTrainings: UserTraining[];
};

export function ProfileClient({ initialTrainings }: ProfileClientProps) {
  const { user, updateProfile, uploadPhoto } = useAuth();
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '');
  const [height, setHeight] = useState(user?.height?.toString() ?? '');
  const [savedMessage, setSavedMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [trainings, setTrainings] = useState<UserTraining[]>(initialTrainings);
  const [trainingsMessage, setTrainingsMessage] = useState('');
  const [isTrainingsLoading, setIsTrainingsLoading] = useState(initialTrainings.length === 0);

  const weeklyTrainingUsage = useMemo(() => {
    return dayOrder.map((day) => ({
      name: day.label,
      value: trainings.filter((training) => training.day_of_week === day.value).length,
    }));
  }, [trainings]);

  const mostActiveDay = useMemo(() => {
    return weeklyTrainingUsage.reduce(
      (favorite, day) => day.value > favorite.value ? day : favorite,
      weeklyTrainingUsage[0]
    );
  }, [weeklyTrainingUsage]);

  const weeklyTrainingPieData = useMemo(() => {
    return weeklyTrainingUsage.filter((day) => day.value > 0);
  }, [weeklyTrainingUsage]);

  useEffect(() => {
    if (!user) return;

    setFullName(user.full_name ?? '');
    setWeight(user.weight?.toString() ?? '');
    setHeight(user.height?.toString() ?? '');
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isActive = true;
    const hasInitialTrainings = initialTrainings.length > 0;
    setIsTrainingsLoading(!hasInitialTrainings);
    setTrainingsMessage('');

    if (hasInitialTrainings) {
      setTrainings(initialTrainings);
      setIsTrainingsLoading(false);
    }

    fetch(`/api/profile/trainings?t=${Date.now()}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({})) as {
          trainings?: UserTraining[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message ?? 'Не вдалося завантажити історію тренувань.');
        }

        return data.trainings ?? [];
      })
      .then((items) => {
        if (isActive) setTrainings(items);
      })
      .catch((error) => {
        if (!isActive) return;
        setTrainings([]);
        setTrainingsMessage(error instanceof Error ? error.message : 'Не вдалося завантажити історію тренувань.');
      })
      .finally(() => {
        if (isActive) setIsTrainingsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [user, initialTrainings]);

  if (!user) return null;

  const formatTrainingDate = (value: string) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  };

  const formatTrainingDay = (value: string) => {
    return dayLabels[value] ?? value;
  };

  const handleAvatarChange = async (photo_url: UserAvatar) => {
    setSavedMessage('');
    setIsSaving(true);

    try {
      await updateProfile({ photo_url });
      setSavedMessage('Аватар оновлено в таблиці users.');
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : 'Не вдалося оновити аватар.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setSavedMessage('');
    setIsUploadingPhoto(true);

    try {
      await uploadPhoto(file);
      setSavedMessage('Фото завантажено в src/app/userphotos і записано в users.photo_url.');
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : 'Не вдалося завантажити фото.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage('');
    setIsSaving(true);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
      });
      setSavedMessage('Дані профілю оновлено в таблиці users.');
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : 'Не вдалося оновити профіль.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Кабінет користувача</Badge>
            <h1 className="font-headline text-4xl font-bold md:text-5xl">Профіль {user.username}</h1>
            <p className="max-w-3xl text-muted-foreground">
              Основні дані профілю читаються з таблиці users і зберігаються назад у неї.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[25fr_75fr]">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Мій профіль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <UserAvatarIcon avatar={user.photo_url} className="h-28 w-28" />
                  <h2 className="mt-4 text-2xl font-bold text-primary">{user.username}</h2>
                  <p className="text-sm text-muted-foreground">Роль: {user.role}</p>
                  <div className="mt-4 grid w-full grid-cols-2 gap-2">
                    <Button type="button" variant={user.photo_url === 'dumbbell' ? 'default' : 'outline'} className="gap-2" onClick={() => handleAvatarChange('dumbbell')} disabled={isSaving}>
                      <Dumbbell className="h-4 w-4" />
                      Гантеля
                    </Button>
                    <Button type="button" variant={user.photo_url === 'bottle' ? 'default' : 'outline'} className="gap-2" onClick={() => handleAvatarChange('bottle')} disabled={isSaving}>
                      <CupSoda className="h-4 w-4" />
                      Пляшка
                    </Button>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full gap-2 border-white/10 bg-white/5"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isSaving || isUploadingPhoto}
                  >
                    <ImagePlus className="h-4 w-4" />
                    {isUploadingPhoto ? 'Завантажуємо фото...' : 'Додати власне фото'}
                  </Button>
                </div>

                <form className="space-y-4" onSubmit={handleSaveProfile}>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Прізвище ім&apos;я по батькові</Label>
                    <Input id="full_name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Іваненко Іван Іванович" className="border-white/10 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Вага</Label>
                      <Input id="weight" type="number" min="1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="75" className="border-white/10 bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Ріст</Label>
                      <Input id="height" type="number" min="1" value={height} onChange={(event) => setHeight(event.target.value)} placeholder="180" className="border-white/10 bg-white/5" />
                    </div>
                  </div>
                  <Button className="w-full bg-primary font-bold text-background" disabled={isSaving}>
                    {isSaving ? 'Зберігаємо...' : 'Зберегти профіль'}
                  </Button>
                  {savedMessage ? <p className="text-center text-sm text-secondary">{savedMessage}</p> : null}
                </form>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="glass-card border-white/10">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="font-headline text-2xl">Історія тренувань</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-white/10">
                        <TableHead>Дата</TableHead>
                        <TableHead>День</TableHead>
                        <TableHead>Заняття</TableHead>
                        <TableHead>Тренер</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead className="text-right">Час</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isTrainingsLoading ? (
                        <TableRow className="border-b-white/5">
                          <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                            Завантажуємо історію тренувань...
                          </TableCell>
                        </TableRow>
                      ) : trainings.length ? (
                        trainings.map((training) => (
                          <TableRow key={training.id} className="border-b-white/5">
                            <TableCell className="text-primary">{formatTrainingDate(training.date)}</TableCell>
                            <TableCell>{formatTrainingDay(training.day_of_week)}</TableCell>
                            <TableCell>{training.title}</TableCell>
                            <TableCell>{training.trainer_name}</TableCell>
                            <TableCell>{training.specialty}</TableCell>
                            <TableCell className="text-right font-bold">{training.start_time}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="border-b-white/5">
                          <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                            Записів у user_training ще немає.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {trainingsMessage ? <p className="mt-4 text-sm text-destructive">{trainingsMessage}</p> : null}
                </CardContent>
              </Card>

              <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Активність за днями тижня</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyTrainingUsage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          formatter={(value) => [value, 'Кількість']}
                          contentStyle={{ backgroundColor: '#141B1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#26D9BA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-5">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Найчастіший день тренувань</p>
                      <h3 className="text-2xl font-bold text-secondary">
                        {mostActiveDay.value > 0 ? mostActiveDay.name : 'Немає записів'}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 h-[210px]">
                    {weeklyTrainingPieData.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={weeklyTrainingPieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={46}
                            outerRadius={78}
                            paddingAngle={weeklyTrainingPieData.length > 1 ? 4 : 0}
                          >
                            {weeklyTrainingPieData.map((day, index) => (
                              <Cell key={day.name} fill={trainingDayChartColors[index % trainingDayChartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [value, 'Кількість']}
                            contentStyle={{ backgroundColor: '#141B1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-xl border border-white/10 bg-background/20 text-sm text-muted-foreground">
                        Немає даних для діаграми
                      </div>
                    )}
                  </div>

                  {weeklyTrainingPieData.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {weeklyTrainingPieData.map((day, index) => (
                        <div key={day.name} className="flex items-center justify-between gap-2 rounded-lg bg-background/20 px-3 py-2 text-xs">
                          <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: trainingDayChartColors[index % trainingDayChartColors.length] }}
                            />
                            <span className="truncate">{day.name}</span>
                          </span>
                          <span className="font-bold text-foreground">{day.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
