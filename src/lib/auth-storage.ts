import { PublicUser } from '@/lib/user-types';

export type { PublicUser, UserAvatar } from '@/lib/user-types';

const CURRENT_USER_KEY = 'zenithfit_current_user';

export function saveCurrentUser(user: PublicUser | null) {
  if (typeof window === 'undefined') return;

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): PublicUser | null {
  if (typeof window === 'undefined') return null;

  const rawUser = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as PublicUser;
  } catch {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function logoutStoredUser() {
  saveCurrentUser(null);
}
