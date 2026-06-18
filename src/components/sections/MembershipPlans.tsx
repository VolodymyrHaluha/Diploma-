"use client";

import React, { FormEvent, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

type MembershipPlan = {
  name: 'Базовий' | 'Преміум' | 'VIP';
  price: string;
  description: string;
  features: string[];
  popular: boolean;
};

type DemoCheckoutResponse = {
  message?: string;
};

const plans: MembershipPlan[] = [
  {
    name: 'Базовий',
    price: '49',
    description: 'Ідеальний старт для комфортного доступу до преміального тренажерного залу.',
    features: [
      'Доступ до тренажерного залу',
      'Роздягальні та шафки',
      'Стандартні групові заняття',
      'Первинна фітнес-оцінка',
    ],
    popular: false,
  },
  {
    name: 'Преміум',
    price: '89',
    description: 'Найпопулярніший план для тих, хто тренується регулярно та хоче більше можливостей.',
    features: [
      'Усе з Базового плану',
      'Необмежені групові заняття',
      'Доступ до басейну та SPA',
      'Консультація з харчування',
      '2 гостьові візити на місяць',
    ],
    popular: true,
  },
  {
    name: 'VIP',
    price: '149',
    description: 'Максимальний рівень сервісу з персональним супроводом і преміальними перевагами.',
    features: [
      'Усе з Преміум плану',
      '4 персональні тренування на місяць',
      'Доступ до VIP-зони',
      'Сервіс рушників і форми',
      'Пакет спортивного харчування',
    ],
    popular: false,
  },
];

const initialPaymentForm = {
  cardHolder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function MembershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const isPaymentFormReady = useMemo(() => {
    const cardDigits = paymentForm.cardNumber.replace(/\D/g, '');
    const cvvDigits = paymentForm.cvv.replace(/\D/g, '');

    return (
      paymentForm.cardHolder.trim().length >= 2 &&
      cardDigits.length >= 12 &&
      /^\d{2}\/\d{2}$/.test(paymentForm.expiry) &&
      cvvDigits.length >= 3
    );
  }, [paymentForm]);

  const openCheckout = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setPaymentForm(initialPaymentForm);
    setMessage('');
  };

  const closeCheckout = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedPlan(null);
      setPaymentForm(initialPaymentForm);
      setMessage('');
    }
  };

  const updatePaymentField = (field: keyof typeof initialPaymentForm, value: string) => {
    setPaymentForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setMessage('');
  };

  const handleDemoCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPlan) return;

    if (!isPaymentFormReady) {
      setMessage('Заповніть усі демо-дані картки перед підтвердженням.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/membership/demo-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_name: selectedPlan.name,
          card_holder: paymentForm.cardHolder,
          card_number: paymentForm.cardNumber,
          expiry: paymentForm.expiry,
          cvv: paymentForm.cvv,
        }),
      });
      const data = await response.json().catch(() => ({})) as DemoCheckoutResponse;

      if (!response.ok) {
        throw new Error(data.message ?? 'Не вдалося оформити демо-абонемент.');
      }

      setMessage(data.message ?? `Демо-оплату підтверджено. Активовано план ${selectedPlan.name}.`);
      setPaymentForm(initialPaymentForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не вдалося оформити демо-абонемент.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="membership" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">
            Оберіть свій <span className="text-primary">абонемент</span>
          </h2>
          <p className="text-muted-foreground">
            Прозорі тарифи для реальних результатів. Приєднуйтеся до преміальної фітнес-спільноти ZenithFit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'glass-card flex flex-col transition-all duration-300 hover:-translate-y-2',
                plan.popular ? 'border-primary/50 ring-2 ring-primary/20 scale-105' : 'border-white/10'
              )}
            >
              {plan.popular && (
                <div className="bg-primary text-background font-bold text-[10px] uppercase tracking-tighter py-1 text-center">
                  Найпопулярніший
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <div className="pt-4 pb-2">
                  <span className="text-4xl font-bold font-headline">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/ міс.</span>
                </div>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="w-full h-px bg-white/10" />
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={cn(
                    'w-full font-bold',
                    plan.popular ? 'bg-primary text-background' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                  onClick={() => openCheckout(plan)}
                >
                  Обрати план
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={closeCheckout}>
        <DialogContent className="glass-card border-white/10 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              Демо-оплата онлайн
            </DialogTitle>
            <DialogDescription>
              Це демонстраційна форма — кошти не списуються, а дані картки не зберігаються. Після підтвердження план
              буде записано в таблицю clients для поточного користувача.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleDemoCheckout}>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
              Обраний план:{' '}
              <span className="font-bold text-primary">
                {selectedPlan?.name} · ${selectedPlan?.price}/міс.
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-holder">Імʼя власника картки</Label>
              <Input
                id="card-holder"
                value={paymentForm.cardHolder}
                onChange={(event) => updatePaymentField('cardHolder', event.target.value)}
                placeholder="IVAN PETRENKO"
                autoComplete="cc-name"
                className="bg-background/70 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-number">Номер картки</Label>
              <Input
                id="card-number"
                value={paymentForm.cardNumber}
                onChange={(event) => updatePaymentField('cardNumber', formatCardNumber(event.target.value))}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                autoComplete="cc-number"
                className="bg-background/70 border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Термін дії</Label>
                <Input
                  id="card-expiry"
                  value={paymentForm.expiry}
                  onChange={(event) => updatePaymentField('expiry', formatExpiry(event.target.value))}
                  placeholder="12/30"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  className="bg-background/70 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  value={paymentForm.cvv}
                  onChange={(event) => updatePaymentField('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className="bg-background/70 border-white/10"
                />
              </div>
            </div>

            {message ? <p className="text-sm text-secondary">{message}</p> : null}

            <DialogFooter>
              <Button
                type="submit"
                className="bg-secondary text-background hover:bg-secondary/90 font-bold"
                disabled={isSubmitting || !isPaymentFormReady}
              >
                {isSubmitting ? 'Підтверджуємо...' : 'Підтвердити демо-оплату'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}