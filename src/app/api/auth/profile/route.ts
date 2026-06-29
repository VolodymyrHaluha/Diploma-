export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { findUserById, ProfileUpdates, toPublicUser, updateUserProfile } from '@/lib/server/users-repository';
import { getSessionUserId } from '@/lib/server/session';
 
function parseNumberOrNull(value: unknown) {
  if (value === null || value === '') return null;
  if (value === undefined) return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function parseAvatar(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmedValue = value.trim();

  if (trimmedValue === 'dumbbell' || trimmedValue === 'bottle' || trimmedValue.startsWith('/userphotos/')) {
    return trimmedValue;
  }

  return undefined;
}

export async function GET(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ message: 'Користувача не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося прочитати профіль із таблиці users.') },
      { status: 503 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
  }

  const updates: ProfileUpdates = {
    photo_url: parseAvatar(body?.photo_url),
    full_name: typeof body?.full_name === 'string' ? body.full_name.trim() : undefined,
    weight: parseNumberOrNull(body?.weight),
    height: parseNumberOrNull(body?.height),
  };

  try {
    const user = await updateUserProfile(userId, updates);

    if (!user) {
      return NextResponse.json({ message: 'Користувача не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося оновити профіль у таблиці users.') },
      { status: 503 }
    );
  }
}
