'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Settings, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();




  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/watched', label: 'Watched' },
  ];

  const isActivePath = (href: string) => {
    const cleanHref = href.split('?')[0];
    return pathname === cleanHref;
  };

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50"
    >
      <div className="relative flex h-20 items-center justify-between px-6 md:px-12 lg:px-14">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
           <Film className='w-5 h-5'/>  
            <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/82 sm:inline">
              FluxTube
            </span>
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[0.88rem] uppercase tracking-[0.12em] text-white/86 lg:flex">
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative pb-1.5 transition-colors hover:text-white',
                  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-[#E50914] after:transition-[width] after:duration-300",
                  isActive ? 'text-white after:w-5' : 'after:w-0 hover:after:w-4'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-white">
          <Link
            href="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 hover:bg-black/60"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
        
   
        </div>
      </div>
    </header>
  );
}