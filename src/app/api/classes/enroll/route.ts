export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { getSessionUserId } from '@/lib/server/session';
import { createUserTraining } from '@/lib/server/training-repository';
 
export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const classSessionId = Number(body.class_session_id);

    if (!Number.isInteger(classSessionId) || classSessionId <= 0) {
      return NextResponse.json({ message: 'Невірне заняття.' }, { status: 400 });
    }

    const training = await createUserTraining(userId, classSessionId);
    return NextResponse.json({ training });
  } catch (error) {
    console.error('Class enrollment API error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося записатися на тренування.') },
      { status: 503 }
    );
  }
}
