import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-card pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold">Звʼяжіться <span className="text-primary">з нами</span></h3>
              <p className="text-muted-foreground">Є питання щодо абонементів або занять? Надішліть нам повідомлення.</p>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Повне імʼя" className="bg-background border-white/10 focus:border-primary" />
                <Input placeholder="Email" className="bg-background border-white/10 focus:border-primary" />
              </div>
              <Input placeholder="Тема" className="bg-background border-white/10 focus:border-primary" />
              <Textarea placeholder="Ваше повідомлення" className="bg-background border-white/10 focus:border-primary min-h-[120px]" />
              <Button className="w-full bg-primary text-background font-bold h-12">Надіслати</Button>
            </form>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-headline font-bold">Де нас <span className="text-secondary">знайти</span></h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Локація</h4>
                  <p className="text-sm text-muted-foreground">вул. Фітнесу, 123, Luxury District<br />Київ, Україна</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-secondary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Графік роботи</h4>
                  <p className="text-sm text-muted-foreground">Пн-Пт: 07:00 - 23:00<br />Сб-Нд: 09:00 - 21:00</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Контакти</h4>
                  <p className="text-sm text-muted-foreground">+380 (44) 123-45-67<br />hello@zenithfit.ua</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center font-bold text-background">Z</div>
              <span className="text-2xl font-headline font-bold tracking-tighter uppercase neon-glow-blue">ZenithFit</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              ZenithFit — це більше, ніж тренажерний зал. Ми створюємо сильну спільноту, яка допомагає розкривати потенціал кожного.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
          <p>© 2024 ZenithFit Premium Fitness Club. Усі права захищено.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Політика конфіденційності</Link>
            <Link href="#" className="hover:text-primary">Умови користування</Link>
            <Link href="#" className="hover:text-primary">Cookie-файли</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}