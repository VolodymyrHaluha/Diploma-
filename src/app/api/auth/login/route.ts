import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { findUserByUsername, toPublicUser, verifyPassword } from '@/lib/server/users-repository';
import { setAuthCookie } from '@/lib/server/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json({ message: 'Заповніть логін і пароль.' }, { status: 400 });
  }

  try {
    const user = await findUserByUsername(username);
    const isPasswordValid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!user || !isPasswordValid) {
      return NextResponse.json({ message: 'Невірний логін або пароль.' }, { status: 401 });
    }

    const response = NextResponse.json({ user: toPublicUser(user) });
    setAuthCookie(response, user.id);
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося перевірити користувача в таблиці users.') },
      { status: 503 }
    );
  }
}
