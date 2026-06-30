export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { getSessionUserId } from '@/lib/server/session';
import { listUserTrainings } from '@/lib/server/training-repository';
 
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
    }

    const trainings = await listUserTrainings(userId);
    return NextResponse.json(
      { trainings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Profile trainings API error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося отримати історію тренувань.') },
      { status: 503 }
    );
  }
}
