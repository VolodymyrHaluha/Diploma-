'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, UserRound, Database } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />
      <section className="relative overflow-hidden py-20">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Database className="h-4 w-4" />
                Майбутня взаємодія з таблицею users
              </div>
              <h1 className="font-headline text-5xl font-bold leading-tight md:text-6xl">
                Авторизація для <span className="text-primary">адмін-панелі</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Ця сторінка підготовлена для входу користувачів із таблиці <code className="rounded bg-white/10 px-2 py-1 text-primary">users</code>. На наступному етапі форму можна підключити до PostgreSQL, перевіряти <code className="rounded bg-white/10 px-2 py-1 text-primary">username</code> і <code className="rounded bg-white/10 px-2 py-1 text-primary">password_hash</code>, а також враховувати роль користувача.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-primary">username</div>
                  <p className="mt-2 text-sm text-muted-foreground">Логін користувача</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-secondary">hash</div>
                  <p className="mt-2 text-sm text-muted-foreground">Перевірка пароля</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-primary">role</div>
                  <p className="mt-2 text-sm text-muted-foreground">Права доступу</p>
                </div>
              </div>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="h-7 w-7" />
                </div>
                <CardTitle className="font-headline text-3xl">Вхід</CardTitle>
                <CardDescription>
                  Увійдіть за логіном і паролем адміністратора або тренера.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Логін</Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="username" name="username" placeholder="admin" autoComplete="username" className="h-12 border-white/10 bg-white/5 pl-10 focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" className="h-12 border-white/10 bg-white/5 pl-10 focus:border-primary" />
                    </div>
                  </div>
                  <Button className="h-12 w-full bg-primary font-bold text-background hover:bg-primary/90">
                    Увійти в кабінет
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Поки що форма не відправляє дані на сервер. Підключення до PostgreSQL буде додано наступним кроком.
                  </p>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Повернутися на <Link href="/" className="font-bold text-primary hover:underline">головну сторінку</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
