"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCurrentUser,
  logoutStoredUser,
  PublicUser,
  saveCurrentUser,
  UserAvatar,
} from '@/lib/auth-storage';

type ProfileUpdates = {
  photo_url?: string;
  full_name?: string;
  weight?: number | null;
  height?: number | null;
};

type AuthContextValue = {
  user: PublicUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<PublicUser>;
  register: (username: string, password: string) => Promise<PublicUser>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdates) => Promise<PublicUser>;
  uploadPhoto: (file: File) => Promise<PublicUser>;
};

type UserResponse = {
  user?: PublicUser;
  message?: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const publicRoutes = ['/login'];

async function readUserResponse(response: Response) {
  const data = await response.json().catch(() => ({})) as UserResponse;

  if (!response.ok || !data.user) {
    throw new Error(data.message ?? 'Сталася помилка. Спробуйте ще раз.');
  }

  return data.user;
}

async function postUser(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return readUserResponse(response);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = getCurrentUser();

    if (!storedUser) {
      setIsReady(true);
      return;
    }

    let isActive = true;

    fetch('/api/auth/profile', { cache: 'no-store' })
      .then(readUserResponse)
      .then((freshUser) => {
        if (!isActive) return;
        saveCurrentUser(freshUser);
        setUser(freshUser);
      })
      .catch(() => {
        if (!isActive) return;
        logoutStoredUser();
        setUser(null);
      })
      .finally(() => {
        if (isActive) setIsReady(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [isReady, pathname, router, user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isReady,
    login: async (username, password) => {
      const loggedUser = await postUser('/api/auth/login', { username, password });
      saveCurrentUser(loggedUser);
      setUser(loggedUser);
      return loggedUser;
    },
    register: async (username, password) => {
      const registeredUser = await postUser('/api/auth/register', { username, password });
      saveCurrentUser(registeredUser);
      setUser(registeredUser);
      return registeredUser;
    },
    logout: () => {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
      logoutStoredUser();
      setUser(null);
      router.replace('/login');
    },
    updateProfile: async (updates) => {
      if (!user) throw new Error('Потрібна авторизація.');

      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedUser = await readUserResponse(response);

      saveCurrentUser(updatedUser);
      setUser(updatedUser);
      return updatedUser;
    },
    uploadPhoto: async (file) => {
      if (!user) throw new Error('Потрібна авторизація.');

      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/auth/photo', {
        method: 'POST',
        body: formData,
      });
      const updatedUser = await readUserResponse(response);

      saveCurrentUser(updatedUser);
      setUser(updatedUser);
      return updatedUser;
    },
  }), [isReady, router, user]);

  const isPublicRoute = publicRoutes.includes(pathname);
  const shouldHideProtectedContent = !isPublicRoute && (!isReady || !user);

  return (
    <AuthContext.Provider value={value}>
      {shouldHideProtectedContent ? (
        <main className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary/30" />
            <p className="text-sm text-muted-foreground">Перевіряємо авторизацію...</p>
          </div>
        </main>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
