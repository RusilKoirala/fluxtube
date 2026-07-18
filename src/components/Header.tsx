'use client';

import Link from 'next/link';
import { Search, Menu, User, Bookmark, LogOut, UserCircle, Home, Film, Users as UsersIcon, TrendingUp } from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';


export function Header() {
  const currentUserId = useMovieStore((state) => state.currentUserId);
  const clearCurrentUserId = useMovieStore((state) => state.clearCurrentUserId);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
    };

    if (showUserMenu || showMenuDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showMenuDropdown]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    clearCurrentUserId();
    setShowUserMenu(false);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feed?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="flex items-center justify-center gap-5 px-4 py-2">
        <Link href="/" className="bg-[#f5c518] text-black font-extrabold text-[20px] px-2 py-1 rounded tracking-wide">
          FluxTube
        </Link>

        <div className="relative" ref={menuDropdownRef}>
          <button 
            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            className="flex items-center gap-2 text-white text-[14px] font-semibold cursor-pointer hover:opacity-80"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          {showMenuDropdown && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded shadow-lg">
              <Link
                href="/"
                onClick={() => setShowMenuDropdown(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/feed"
                onClick={() => setShowMenuDropdown(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white border-t border-neutral-800"
              >
                <Film className="w-4 h-4" />
                <span>Discover Movies</span>
              </Link>
              {currentUserId && (
                <>
                  <Link
                    href="/watchlist"
                    onClick={() => setShowMenuDropdown(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white border-t border-neutral-800"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>My Watchlist</span>
                  </Link>
                  <Link
                    href="/users"
                    onClick={() => setShowMenuDropdown(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white border-t border-neutral-800"
                  >
                    <UsersIcon className="w-4 h-4" />
                    <span>Find Users</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-[600px] flex bg-white rounded overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, actors, or genres"
            className="flex-1 border-none px-4 py-2 text-[14px] text-neutral-900 outline-none"
          />
          <button type="submit" className="border-none bg-neutral-200 px-4 hover:bg-neutral-300">
            <Search className="w-4 h-4 text-neutral-700" />
          </button>
        </form>


        <div className="flex items-center gap-4 text-white text-[13px]">
          {currentUserId ? (
            <>
              <Link href="/watchlist" className="hover:opacity-80 flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                <span>Watchlist</span>
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hover:opacity-80 flex items-center"
                >
                  <UserCircle className="w-6 h-6" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded shadow-lg">
                    <Link
                      href={`/profile/${currentUserId}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/users"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white border-t border-neutral-800"
                    >
                      <User className="w-4 h-4" />
                      <span>Find Users</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white border-t border-neutral-800 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className="hover:opacity-80">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
