'use client';

import { use } from 'react';
import { Header } from '@/components/Header';
import { MovieGrid } from '@/components/MovieGrid';
import { useMovieDetails, useRecommendations } from '@/hooks/useMovies';
import { getImageUrl } from '@/lib/api/tmdb';
import Image from 'next/image';
import { Calendar, Clock, Star, Plus, Check, Eye, Play } from 'lucide-react';
import { useAddToWatchlist, useRemoveFromWatchlist, useAddToWatched, useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';
import { cn } from '@/lib/utils';

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieId = parseInt(id);

  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { data: recommendations } = useRecommendations(movieId);

  const currentUserId = useMovieStore((state) => state.currentUserId);
  const { data: watchlist = [] } = useWatchlist(currentUserId || 0);
  const { data: watched = [] } = useWatched(currentUserId || 0);

  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const addToWatched = useAddToWatched();

  const isInWatchlist = watchlist.some((item: any) => item.movieId === movieId);
  const isWatched = watched.some((item: any) => item.movieId === movieId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">Loading...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">Movie not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

  
      <div className="relative h-screen">

        <div className="absolute inset-0">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
  
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        </div>

   
        <div className="relative h-full flex items-end">
          <div className="px-6 md:px-12 lg:px-14 pb-16 md:pb-20 w-full">
            <div className="max-w-4xl">
    
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                {movie.title}
              </h1>

       
              {movie.tagline && (
                <p className="text-lg md:text-xl text-white/70 italic mb-6 tracking-wide">
                  "{movie.tagline}"
                </p>
              )}

    
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-white/80 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-white/50">/10</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>

                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}

                <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded text-xs uppercase tracking-wider">
                  {movie.status}
                </div>
              </div>

  
              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs uppercase tracking-wider text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {currentUserId && (
                <div className="flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded text-sm font-medium uppercase tracking-wider transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Trailer</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isInWatchlist) {
                        removeFromWatchlist.mutate({ userId: currentUserId, movieId });
                      } else {
                        addToWatchlist.mutate({ userId: currentUserId, movieId });
                      }
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-medium uppercase tracking-wider transition-all",
                      isInWatchlist
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    )}
                  >
                    {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isInWatchlist ? 'In Watchlist' : 'Add to List'}</span>
                  </button>

                  <button
                    onClick={() => addToWatched.mutate({ userId: currentUserId, movieId })}
                    disabled={isWatched}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-medium uppercase tracking-wider transition-all",
                      isWatched
                        ? "bg-green-600/80 text-white cursor-default"
                        : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-14 py-16 md:py-20">
        <div className="max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em] mb-6">
            Overview
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed tracking-wide">
            {movie.overview}
          </p>
        </div>
      </div>

     
      {recommendations && recommendations.length > 0 && (
        <div className="px-6 md:px-12 lg:px-14 pb-24">
          <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em] mb-8">
            More Like This
          </h2>
          <MovieGrid movies={recommendations} />
        </div>
      )}
    </div>
  );
}
