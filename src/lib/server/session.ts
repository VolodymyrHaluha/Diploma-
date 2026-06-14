import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'zenithfit_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.AUTH_SECRET ?? 'zenithfit-local-session-secret';
}

function signSession(userId: number, expiresAt: number) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(`${userId}.${expiresAt}`)
    .digest('base64url');
}

function createSessionValue(userId: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${userId}.${expiresAt}.${signSession(userId, expiresAt)}`;
}

function shouldUseSecureCookie() {
  return process.env.AUTH_COOKIE_SECURE === 'true';
}

function verifySessionValue(value: string) {
  const [rawUserId, rawExpiresAt, signature] = value.split('.');
  const userId = Number(rawUserId);
  const expiresAt = Number(rawExpiresAt);

  if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(expiresAt)) {
    return null;
  }

  if (expiresAt < Math.floor(Date.now() / 1000)) {
    return null;
  }

  const expectedSignature = signSession(userId, expiresAt);
  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature ?? '');

  if (expectedBuffer.length !== actualBuffer.length) {
    return null;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer) ? userId : null;
}

export function setAuthCookie(response: NextResponse, userId: number) {
  response.cookies.set(AUTH_COOKIE_NAME, createSessionValue(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureCookie(),
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureCookie(),
    maxAge: 0,
    path: '/',
  });
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return session ? verifySessionValue(session) : null;
}
