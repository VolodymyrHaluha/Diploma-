import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { getSessionUserId } from '@/lib/server/session';
import { listUserTrainings } from '@/lib/server/training-repository';

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
    }

    const trainings = await listUserTrainings(userId);
    return NextResponse.json({ trainings });
  } catch (error) {
    console.error('Profile trainings API error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося отримати історію тренувань.') },
      { status: 503 }
    );
  }
}
