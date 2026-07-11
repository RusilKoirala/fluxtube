'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/api/tmdb';
import { Star, Plus, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToWatchlist, useRemoveFromWatchlist, useAddToWatched, useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';



export function MovieCard({ movie }: { movie: Movie }) {
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
    if (!currentUserId) return;

    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: currentUserId, movieId: movie.id });
    } else {
      addToWatchlist.mutate({ userId: currentUserId, movieId: movie.id });
    }
  };

  const handleMarkWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUserId) return;

    addToWatched.mutate({ userId: currentUserId, movieId: movie.id });
  };

  return (
    <Link href={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 transition-transform hover:scale-105">

        <div className="relative aspect-[2/3]">
          <Image
  src={getImageUrl(movie.poster_path)}
  alt={movie.title || 'Movie poster'}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
  unoptimized
/>



          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-4">
            <p className="text-white text-sm line-clamp-3 mb-3">{movie.overview}</p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isInWatchlist ? "secondary" : "default"}
                onClick={handleWatchlistToggle}
                disabled={!currentUserId}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>

              <Button
                size="sm"
                variant={isWatched ? "secondary" : "outline"}
                onClick={handleMarkWatched}
                disabled={!currentUserId || isWatched}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>


        <div className="p-3">
          <h3 className="font-semibold text-white truncate">{movie.title}</h3>

          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-gray-400">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>

            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        </div>


        {isWatched && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Watched
          </div>
        )}
      </div>
    </Link>
  );
}
