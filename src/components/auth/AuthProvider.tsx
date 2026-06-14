"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCurrentUser,
  loginStoredUser,
  logoutStoredUser,
  PublicUser,
  registerStoredUser,
  updateStoredUser,
  UserAvatar,
} from '@/lib/auth-storage';

type AuthContextValue = {
  user: PublicUser | null;
  isReady: boolean;
  login: (username: string, password: string) => PublicUser;
  register: (username: string, password: string) => PublicUser;
  logout: () => void;
  updateProfile: (updates: { photo_url?: UserAvatar; full_name?: string; weight?: number | null; height?: number | null }) => PublicUser;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const publicRoutes = ['/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
    setIsReady(true);
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
    login: (username, password) => {
      const loggedUser = loginStoredUser(username, password);
      setUser(loggedUser);
      return loggedUser;
    },
    register: (username, password) => {
      const registeredUser = registerStoredUser(username, password);
      setUser(registeredUser);
      return registeredUser;
    },
    logout: () => {
      logoutStoredUser();
      setUser(null);
      router.replace('/login');
    },
    updateProfile: (updates) => {
      if (!user) throw new Error('Потрібна авторизація.');
      const updatedUser = updateStoredUser(user.id, updates);
      setUser(updatedUser);
      return updatedUser;
    },
  }), [isReady, router, user]);

  const shouldHideProtectedContent = !isReady || (!user && !publicRoutes.includes(pathname));

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
