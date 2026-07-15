'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Film, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMovieStore } from '@/store/useMovieStore';
import { useLogout } from '@/hooks/useAuth';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUserId = useMovieStore((state) => state.currentUserId);
  const logout = useLogout();


  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [currentUserId]);

  useEffect(() => {
    // close menu on click outside
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/watched', label: 'Watched' },
  ];

  const isActivePath = (href: string) => {
    const cleanHref = href.split('?')[0];
    return pathname === cleanHref;
  };

  const handleLogout = () => {
    logout.mutate();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 transition-colors"
            aria-label="Search"
          >


            
            <Search className="h-4 w-4" />
          </Link>

          {currentUserId && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914] hover:bg-[#E50914]/90 transition-colors"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{user.username?.[0]?.toUpperCase()}</span>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">{user.username}</p>
                    <p className="text-white/50 text-xs truncate">{user.email}</p>
                  </div>

                  <Link
                    href={`/profile/${currentUserId}`}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/5 transition-colors"
                  >


                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </Link>



                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/90 text-white text-sm rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
