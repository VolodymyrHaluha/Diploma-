'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Lock, UserRound } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const isRegisterMode = mode === 'register';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setMessage('Заповніть логін і пароль.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register(trimmedUsername, trimmedPassword);
      } else {
        await login(trimmedUsername, trimmedPassword);
      }
      router.replace('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(isRegisterMode ? 'login' : 'register');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex min-h-screen items-center overflow-hidden py-12">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Database className="h-4 w-4" />
                Авторизація через таблицю users
              </div>
              <h1 className="font-headline text-5xl font-bold leading-tight md:text-6xl">
                Вхід у <span className="text-primary">ZenithFit</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Логін, пароль і профіль користувача перевіряються через таблицю users. Після успішного входу в header буде показано аватар і логін поточного користувача.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-primary">username</div>
                  <p className="mt-2 text-sm text-muted-foreground">Логін користувача</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-secondary">password_hash</div>
                  <p className="mt-2 text-sm text-muted-foreground">Хеш пароля в БД</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-primary">profile</div>
                  <p className="mt-2 text-sm text-muted-foreground">Дані профілю</p>
                </div>
              </div>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="h-7 w-7" />
                </div>
                <CardTitle className="font-headline text-3xl">{isRegisterMode ? 'Реєстрація' : 'Вхід'}</CardTitle>
                <CardDescription>
                  {isRegisterMode ? 'Створіть запис у таблиці users.' : 'Увійдіть за логіном і паролем із таблиці users.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Логін</Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="admin"
                        autoComplete="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="h-12 border-white/10 bg-white/5 pl-10 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-12 border-white/10 bg-white/5 pl-10 focus:border-primary"
                      />
                    </div>
                  </div>

                  {message ? (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {message}
                    </div>
                  ) : null}

                  <Button className="h-12 w-full bg-primary font-bold text-background hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? 'Перевіряємо users...' : isRegisterMode ? 'Створити акаунт' : 'Увійти в кабінет'}
                  </Button>
                </form>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 h-12 w-full border-secondary/40 bg-secondary/10 font-bold text-secondary hover:bg-secondary hover:text-background"
                  onClick={toggleMode}
                  disabled={isSubmitting}
                >
                  {isRegisterMode ? 'Повернутися до входу' : 'Реєстрація у ZenithFit'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
