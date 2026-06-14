import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeFilename = path.basename(filename);
  const extension = path.extname(safeFilename).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType || safeFilename !== filename) {
    return NextResponse.json({ message: 'Фото не знайдено.' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'app', 'userphotos', safeFilename);
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Фото не знайдено.' }, { status: 404 });
  }
}
