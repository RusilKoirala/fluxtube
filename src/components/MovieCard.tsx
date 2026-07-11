'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/api/tmdb';
import { Star, Plus, Check, Eye, Play } from 'lucide-react';
import { useAddToWatchlist, useRemoveFromWatchlist, useAddToWatched, useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';
import { cn } from '@/lib/utils';

export function MovieCard({ movie }: { movie: Movie }) {
  if (!movie || !movie.id) return null;

  const currentUserId = useMovieStore((state) => state.currentUserId);
  const { data: watchlist = [] } = useWatchlist(currentUserId || 0);
  const { data: watched = [] } = useWatched(currentUserId || 0);

  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const addToWatched = useAddToWatched();

  const isInWatchlist = watchlist.some((item: any) => item.movieId === movie.id);
  const isWatched = watched.some((item: any) => item.movieId === movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) return;

    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: currentUserId, movieId: movie.id });
    } else {
      addToWatchlist.mutate({ userId: currentUserId, movieId: movie.id });
    }
  };

  const handleMarkWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) return;

    addToWatched.mutate({ userId: currentUserId, movieId: movie.id });
  };

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative overflow-hidden rounded-md bg-black/20 backdrop-blur transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        {/* Poster */}
        <div className="relative aspect-[2/3]">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title || 'Movie poster'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            unoptimized
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Play Button - Center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[#E50914]/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 drop-shadow-lg">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-white/90">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-white/70">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
            </div>

            {/* Action Buttons */}
            {currentUserId && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleWatchlistToggle}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium transition-all",
                    isInWatchlist
                      ? "bg-[#E50914] text-white"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  )}
                >
                  {isInWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span className="uppercase tracking-wide">{isInWatchlist ? 'Added' : 'List'}</span>
                </button>

                <button
                  onClick={handleMarkWatched}
                  disabled={isWatched}
                  className={cn(
                    "flex items-center justify-center p-2 rounded transition-all",
                    isWatched
                      ? "bg-green-600/80 text-white cursor-default"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Watched Badge */}
        {isWatched && (
          <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-[0.65rem] px-2 py-1 rounded-sm font-medium shadow-lg uppercase tracking-wider">
            Watched
          </div>
        )}
      </div>
    </Link>
  );
}
