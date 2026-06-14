"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserAvatarIcon } from '@/components/auth/UserAvatarIcon';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Головна', href: '/' },
    { name: 'Абонементи', href: '/membership' },
    { name: 'Заняття', href: '/classes' },
    { name: 'Тренери', href: '/trainers' },
    { name: 'Розклад', href: '/schedule' },
    { name: 'Новини', href: '/news' },
    { name: 'Контакти', href: '/contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled || pathname !== '/' ? "bg-background/80 backdrop-blur-md border-b py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-background group-hover:rotate-12 transition-transform">Z</div>
          <span className="text-xl font-headline font-bold tracking-tighter neon-glow-blue uppercase">ZenithFit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:border-primary/50 hover:text-primary">
                <UserAvatarIcon avatar={user.photo_url} className="h-9 w-9" />
                <span className="text-sm font-bold">{user.username}</span>
              </Link>
              <Button type="button" variant="outline" className="border-white/10 bg-white/5" onClick={logout}>
                Вийти
              </Button>
            </div>
          ) : null}
        </nav>

        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Відкрити меню"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div 
        className={cn(
          "fixed inset-0 top-[60px] bg-background z-40 md:hidden transition-transform duration-300 flex flex-col items-center justify-center gap-8 p-10",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-headline font-bold hover:text-primary text-foreground"
          >
            {link.name}
          </Link>
        ))}
        {user ? (
          <>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xl font-headline font-bold hover:text-primary">
              <UserAvatarIcon avatar={user.photo_url} className="h-12 w-12" />
              {user.username}
            </Link>
            <Button type="button" size="lg" variant="outline" className="w-full border-white/10 bg-white/5" onClick={() => { setMobileMenuOpen(false); logout(); }}>
              Вийти
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
