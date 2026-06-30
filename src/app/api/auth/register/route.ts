export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { createUser, toPublicUser } from '@/lib/server/users-repository';
import { setAuthCookie } from '@/lib/server/session';
 
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json({ message: 'Заповніть логін і пароль.' }, { status: 400 });
  }

  try {
    const user = await createUser(username, password);
    const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
    setAuthCookie(response, user.id);
    return response;
  } catch (error) {
    const isDuplicateUser = typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';

    if (isDuplicateUser) {
      return NextResponse.json({ message: 'Користувач із таким логіном уже існує.' }, { status: 409 });
    }

    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося створити користувача в таблиці users.') },
      { status: 503 }
    );
  }
}
