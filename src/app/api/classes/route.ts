import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { listClassSessions } from '@/lib/server/training-repository';
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day') ?? undefined;
    const classes = await listClassSessions(day);

    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Classes API error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося отримати заняття.') },
      { status: 503 }
    );
  }
}
