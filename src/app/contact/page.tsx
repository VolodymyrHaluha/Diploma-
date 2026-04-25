'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <div className="py-20 container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-headline font-bold mb-6">Наші <span className="text-primary">Контакти</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ми завжди готові відповісти на ваші запитання та допомогти вам почати свій шлях до здоров'я та сили в ZenithFit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Контактна форма */}
          <Card className="glass-card border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Напишіть нам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ваше ім'я</label>
                    <Input placeholder="Іван" className="bg-white/5 border-white/10 focus:border-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email</label>
                    <Input type="email" placeholder="ivan@mail.com" className="bg-white/5 border-white/10 focus:border-primary h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Тема</label>
                  <Input placeholder="Запитання щодо абонемента" className="bg-white/5 border-white/10 focus:border-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Повідомлення</label>
                  <Textarea placeholder="Ваше запитання або пропозиція..." className="bg-white/5 border-white/10 focus:border-primary min-h-[150px] resize-none" />
                </div>
                <Button className="w-full bg-primary text-background font-bold h-14 text-lg hover:scale-[1.02] transition-transform">
                  Відправити повідомлення
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Інформація */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl font-headline">Локація</h3>
                <p className="text-muted-foreground leading-relaxed">вул. Фітнесу, 123, Luxury District, Київ</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Phone className="text-secondary w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl font-headline">Телефон</h3>
                <p className="text-muted-foreground">+380 (44) 123-45-67<br/>+380 (50) 987-65-43</p>
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl font-headline">Email</h3>
                <p className="text-muted-foreground">hello@zenithfit.ua<br/>support@zenithfit.ua</p>
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Clock className="text-secondary w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl font-headline">Години</h3>
                <p className="text-muted-foreground">Пн-Пт: 07:00 - 23:00<br />Сб-Нд: 09:00 - 21:00</p>
              </div>
            </div>

            {/* Декоративний блок */}
            <div className="relative h-[220px] rounded-2xl overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <div className="space-y-2">
                  <MapPin className="w-10 h-10 mx-auto text-primary opacity-50 group-hover:scale-110 transition-transform" />
                  <p className="font-headline font-bold text-lg">Завітайте до нас сьогодні!</p>
                  <p className="text-sm text-muted-foreground">Київ, Luxury District, біля Центрального Парку</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
