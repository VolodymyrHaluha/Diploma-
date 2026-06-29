import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { activateDemoMembership, isMembershipPlanName } from '@/lib/server/membership-repository';
import { getSessionUserId } from '@/lib/server/session';
 
function onlyDigits(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Потрібна авторизація для оформлення абонемента.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const planName = String(body.plan_name ?? '');
    const cardNumber = onlyDigits(body.card_number);
    const expiry = String(body.expiry ?? '').trim();
    const cvv = onlyDigits(body.cvv);
    const cardHolder = String(body.card_holder ?? '').trim();

    if (!isMembershipPlanName(planName)) {
      return NextResponse.json({ message: 'Оберіть коректний план абонемента.' }, { status: 400 });
    }

    if (
      cardNumber.length < 12 ||
      cardNumber.length > 19 ||
      !/^\d{2}\/\d{2}$/.test(expiry) ||
      cvv.length < 3 ||
      cvv.length > 4 ||
      cardHolder.length < 2
    ) {
      return NextResponse.json({ message: 'Заповніть демо-дані картки коректно.' }, { status: 400 });
    }

    const client = await activateDemoMembership(userId, planName);

    if (!client) {
      return NextResponse.json({ message: 'Користувача не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ client, message: `Демо-оплату підтверджено. Активовано план ${planName}.` });
  } catch (error) {
    console.error('Demo membership checkout API error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося оформити демо-абонемент.') },
      { status: 503 }
    );
  }
}