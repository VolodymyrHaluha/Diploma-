'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dumbbell, CupSoda, Activity, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserAvatarIcon } from '@/components/auth/UserAvatarIcon';
import { UserAvatar } from '@/lib/auth-storage';

const workoutHistory = [
  { date: '12.06.2026', plan: 'Преміум', classTitle: 'HIIT Circuit', trainer: 'Маркус Торн', equipment: 'Бігові доріжки', duration: 55 },
  { date: '10.06.2026', plan: 'Преміум', classTitle: 'Power Yoga', trainer: 'Олена Венс', equipment: 'Мат', duration: 45 },
  { date: '08.06.2026', plan: 'Преміум', classTitle: 'Body Pump', trainer: 'Сара Дж.', equipment: 'Гантелі', duration: 60 },
  { date: '06.06.2026', plan: 'Преміум', classTitle: 'Spin Mastery', trainer: 'Девід Бек', equipment: 'Велотренажер', duration: 50 },
];

const equipmentUsage = [
  { name: 'Гантелі', value: 42 },
  { name: 'Бігові доріжки', value: 35 },
  { name: 'Велотренажер', value: 28 },
  { name: 'Мат', value: 20 },
];

const attendanceByPlan = [
  { name: 'Абонемент', value: 4 },
  { name: 'Відвідування', value: 12 },
  { name: 'Тренажери', value: 8 },
];

const COLORS = ['#66CCFF', '#26D9BA', '#FF9933', '#A17FFF'];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '');
  const [height, setHeight] = useState(user?.height?.toString() ?? '');
  const [savedMessage, setSavedMessage] = useState('');

  const favoriteEquipment = useMemo(() => {
    return equipmentUsage.reduce((favorite, item) => item.value > favorite.value ? item : favorite, equipmentUsage[0]);
  }, []);

  if (!user) return null;

  const handleAvatarChange = (photo_url: UserAvatar) => {
    updateProfile({ photo_url });
  };

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      weight: weight ? Number(weight) : null,
      height: height ? Number(height) : null,
    });
    setSavedMessage('Дані профілю оновлено.');
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
              Лівий блок займає 25% простору та містить фото, логін і персональні дані. Правий блок займає 75% і показує історію тренувань, діаграми та найчастіше використовуваний тренажер.
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
                    <Button type="button" variant={user.photo_url === 'dumbbell' ? 'default' : 'outline'} className="gap-2" onClick={() => handleAvatarChange('dumbbell')}>
                      <Dumbbell className="h-4 w-4" />
                      Гантеля
                    </Button>
                    <Button type="button" variant={user.photo_url === 'bottle' ? 'default' : 'outline'} className="gap-2" onClick={() => handleAvatarChange('bottle')}>
                      <CupSoda className="h-4 w-4" />
                      Бутилка
                    </Button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSaveProfile}>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Прізвище імʼя По-батькові</Label>
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
                  <Button className="w-full bg-primary font-bold text-background">Зберегти профіль</Button>
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
                        <TableHead>Абонемент</TableHead>
                        <TableHead>Заняття</TableHead>
                        <TableHead>Тренер</TableHead>
                        <TableHead>Тренажер</TableHead>
                        <TableHead className="text-right">Хв.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workoutHistory.map((workout) => (
                        <TableRow key={`${workout.date}-${workout.classTitle}`} className="border-b-white/5">
                          <TableCell className="text-primary">{workout.date}</TableCell>
                          <TableCell>{workout.plan}</TableCell>
                          <TableCell>{workout.classTitle}</TableCell>
                          <TableCell>{workout.trainer}</TableCell>
                          <TableCell>{workout.equipment}</TableCell>
                          <TableCell className="text-right font-bold">{workout.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Діаграма використання тренажерів</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={equipmentUsage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#141B1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#26D9BA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Аналітика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-5">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Найчастіше використовуваний тренажер</p>
                          <h3 className="text-2xl font-bold text-secondary">{favoriteEquipment.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="h-[210px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={attendanceByPlan} innerRadius={45} outerRadius={75} paddingAngle={5} dataKey="value">
                            {attendanceByPlan.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#141B1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Надалі ці дані потрібно формувати SQL-запитами з таблиць membership_plans, subscriptions, attendance та equipment_usage.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
