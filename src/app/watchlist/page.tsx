'use client';

import { Header } from '@/components/Header';
import { MovieGrid } from '@/components/MovieGrid';
import { useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';
import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/lib/api/tmdb';
import { Movie } from '@/types/movie';
import { Bookmark, Clock } from 'lucide-react';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';


export default function WatchlistPage() {
  const currentUserId = useMovieStore((state) => state.currentUserId);
  const { data: watchlist = [] } = useWatchlist(currentUserId || 0);
  const { data: watched = [] } = useWatched(currentUserId || 0);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');

  const watchlistMovieIds = watchlist.map((item: any) => item.movieId);
  const { data: watchlistMovies = [], isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist-movies', watchlistMovieIds],
    queryFn: async () => {
      if (watchlistMovieIds.length === 0) return [];
      const moviePromises = watchlistMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`),
      );
      const responses = await Promise.all(moviePromises);
      return responses.map((res) => res.data);
    },
    enabled: watchlistMovieIds.length > 0,
  });


  const watchedMovieIds = watched.map((item: any) => item.movieId);
  const { data: watchedMovies = [], isLoading: watchedLoading } = useQuery({
    queryKey: ['watched-movies', watchedMovieIds],
    queryFn: async () => {
      if (watchedMovieIds.length === 0) return [];
      const moviePromises = watchedMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`),
      );
      const responses = await Promise.all(moviePromises);
      return responses.map((res) => res.data);
    },
    enabled: watchedMovieIds.length > 0,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-6">
          <h1 className="text-[32px] font-bold text-white mb-2">My Movies</h1>
          <p className="text-[14px] text-neutral-500">Track your watchlist and watched movies</p>
        </div>


        <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
          <div className="flex gap-6 mb-6 border-b border-neutral-800">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`pb-3 text-[14px] font-medium transition-colors ${
                activeTab === 'watchlist'
                  ? 'text-[#f5c518] border-b-2 border-[#f5c518]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Watchlist ({watchlist.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('watched')}
              className={`pb-3 text-[14px] font-medium transition-colors ${
                activeTab === 'watched'
                  ? 'text-[#f5c518] border-b-2 border-[#f5c518]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Watched ({watched.length})</span>
              </div>
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'watchlist' && (
              <div>
                {watchlistLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
                    ))}
                  </div>
                ) : watchlistMovies.length > 0 ? (
                  <MovieGrid movies={watchlistMovies} />
                ) : (
                  <div className="text-center py-12">
                    <Bookmark className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-500 text-[14px]">Your watchlist is empty</p>
                    <p className="text-neutral-600 text-[13px] mt-1">Add movies you want to watch</p>
                  </div>
                )}
              </div>
            )}


            {activeTab === 'watched' && (
              <div>
                {watchedLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
                    ))}
                  </div>
                ) : watchedMovies.length > 0 ? (
                  <MovieGrid movies={watchedMovies} />
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-500 text-[14px]">No watched movies yet</p>
                    <p className="text-neutral-600 text-[13px] mt-1">Mark movies as watched to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
          FluxTube
        </footer>
      </div>
    </ProtectedRoute>
  );
}
