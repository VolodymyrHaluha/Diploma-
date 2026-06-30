import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getDatabaseErrorMessage } from '@/lib/server/db';
import { getSessionUserId } from '@/lib/server/session';
import { toPublicUser, updateUserProfile } from '@/lib/server/users-repository';

export const runtime = 'nodejs';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ message: 'Потрібна авторизація.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('photo');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Оберіть фото для завантаження.' }, { status: 400 });
    }

    const extension = allowedTypes.get(file.type);

    if (!extension) {
      return NextResponse.json({ message: 'Дозволені тільки JPG, PNG або WEBP фото.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Фото має бути не більше 5 MB.' }, { status: 400 });
    }

    const photosDir = path.join(process.cwd(), 'src', 'app', 'userphotos');
    await mkdir(photosDir, { recursive: true });

    const fileName = `user-${userId}-${Date.now()}.${extension}`;
    const filePath = path.join(photosDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, bytes);

    const photoUrl = `/userphotos/${fileName}`;
    const user = await updateUserProfile(userId, { photo_url: photoUrl });

    if (!user) {
      return NextResponse.json({ message: 'Користувача не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error('User photo upload error:', error);
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error, 'Не вдалося завантажити фото.') },
      { status: 503 }
    );
  }
}
