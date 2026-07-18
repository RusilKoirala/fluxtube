// src/app/page.tsx
'use client';

import { Header } from "@/components/Header";
import { usePopularMovies, useTrendingMovies, useMovieDetails } from "@/hooks/useMovies";
import { Star, TrendingUp, Play, Plus, Share2, Calendar, Clock, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/api/tmdb";
import { useMovieStore } from "@/store/useMovieStore";
import { useMovieReviews } from "@/hooks/useReviews";
import { useState } from "react";
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";


export default function HomePage() {
  const { data: popular = [], isLoading: popularLoading } = usePopularMovies();
  const { data: trending = [], isLoading: trendingLoading } = useTrendingMovies();

  const featuredMovieId = trending[0]?.id;
  const { data: featuredMovie } = useMovieDetails(featuredMovieId || 0);
  const { data: featuredReviews = [] } = useMovieReviews(featuredMovieId || 0);

  const currentUserId = useMovieStore((state) => state.currentUserId);
  const [showShareToast, setShowShareToast] = useState(false);

  const { data: watchlist = [] } = useWatchlist(currentUserId || 0);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const isInWatchlist = watchlist.some((item: any) => item.movieId === featuredMovieId);


  const handleShare = () => {
    const url = `${window.location.origin}/movie/${featuredMovieId}`;
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleWatchlistToggle = () => {
    if (!currentUserId || !featuredMovieId) return;
    
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: currentUserId, movieId: featuredMovieId });
    } else {
      addToWatchlist.mutate({ userId: currentUserId, movieId: featuredMovieId });
    }
  };

  if (!featuredMovie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-white/40">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

     
      <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-6">
      
        <div className="text-[13px] text-neutral-500 mb-2">
          Home › Movies › {featuredMovie.genres?.[0]?.name || 'Featured'}
        </div>


        <h1 className="text-[32px] font-bold text-white mb-2">
          {featuredMovie.title}{' '}
          <span className="font-normal text-neutral-500">
            ({new Date(featuredMovie.release_date).getFullYear()})
          </span>
        </h1>

   
        <div className="flex items-center gap-3 text-[14px] text-neutral-500 mb-4 flex-wrap">
        
          {featuredMovie.runtime && (
            <span>{Math.floor(featuredMovie.runtime / 60)}h {featuredMovie.runtime % 60}m</span>
          )}
          <span>{featuredMovie.genres?.map(g => g.name).join(', ')}</span>
          <span>{new Date(featuredMovie.release_date).toLocaleDateString()}</span>
        </div>
      </div>

  
      <div className="max-w-[1200px] mx-auto px-4 pb-6 grid grid-cols-1 md:grid-cols-[300px_1fr_260px] gap-4">

        <div className="aspect-[2/3] relative rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black">
          {featuredMovie.poster_path ? (
            <Image
              src={getImageUrl(featuredMovie.poster_path, 'w500')}
              alt={featuredMovie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-600 text-[13px]">
              Poster image
            </div>
          )}
        </div>

  


        <div className="relative min-h-[280px] rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black">
          {featuredMovie.backdrop_path ? (
            <Image
              src={getImageUrl(featuredMovie.backdrop_path, 'w1280')}
              alt={featuredMovie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-600 text-[13px]">
              Backdrop / trailer thumbnail
            </div>
          )}
          <Link
            href={`/movie/${featuredMovie.id}`}
            className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-full text-white text-[13px] hover:bg-black/80"
          >
            <Play className="w-4 h-4 fill-white" />
            Play trailer
          </Link>
        </div>


        <div className="flex flex-col gap-3">
   
          <div className="bg-neutral-900 border border-neutral-800 rounded p-3">
            <div className="text-[12px] text-neutral-500 mb-2">FLUXTUBE RATING</div>
            <div className="flex items-center gap-2">
              <Star className="w-7 h-7 fill-[#f5c518] text-[#f5c518]" />
              <span className="text-[22px] font-bold text-white">
                {featuredMovie.vote_average.toFixed(1)}
              </span>
              <span className="text-[13px] text-neutral-500">/10</span>
              <span className="text-[11px] text-neutral-600 ml-auto">
                {featuredReviews.length}
              </span>
            </div>
          </div>

          {currentUserId && (
            <>
              <button 
                onClick={handleWatchlistToggle}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-white text-[13px] border",
                  isInWatchlist
                    ? "bg-neutral-700 border-neutral-600 hover:bg-neutral-600"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                )}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-[13px] hover:bg-neutral-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </>
          )}
        </div>
      </div>

      {showShareToast && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50 text-[13px]">
          Link copied to clipboard!
        </div>
      )}


      <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
        <h2 className="text-[20px] font-semibold text-white mb-3">Storyline</h2>
        <p className="text-[14px] text-neutral-300 leading-relaxed max-w-[800px]">
          {featuredMovie.overview}
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {featuredMovie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="border border-neutral-700 px-2 py-1 rounded-full text-[12px] text-neutral-500"
            >
              #{genre.name.toLowerCase().replace(' ', '-')}
            </span>
          ))}
        </div>
      </div>


      <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
        <h2 className="text-[20px] font-semibold text-white mb-3">
          Trending This Week
          <Link href="/feed" className="float-right text-[13px] text-[#f5c518] font-normal hover:underline">
            See all ›
          </Link>
        </h2>
        {trendingLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {trending.slice(0, 6).map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group"
              >
                <div className="aspect-[2/3] relative rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black mb-2">
                  {movie.poster_path ? (
                    <Image
                      src={getImageUrl(movie.poster_path, 'w342')}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-[12px]">
                      Poster
                    </div>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-white group-hover:text-[#f5c518]">
                  {movie.title}
                </div>
                <div className="text-[12px] text-neutral-500">
                  {movie.vote_average.toFixed(1)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


      <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
        <h2 className="text-[20px] font-semibold text-white mb-3">
          Popular Right Now
          <Link href="/feed" className="float-right text-[13px] text-[#f5c518] font-normal hover:underline">
            See all ›
          </Link>
        </h2>
        {popularLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {popular.slice(0, 6).map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group"
              >
                <div className="aspect-[2/3] relative rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black mb-2">
                  {movie.poster_path ? (
                    <Image
                      src={getImageUrl(movie.poster_path, 'w342')}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-[12px]">
                      Poster
                    </div>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-white group-hover:text-[#f5c518]">
                  {movie.title}
                </div>
                <div className="text-[12px] text-neutral-500">
                  {movie.vote_average.toFixed(1)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


      <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
        FluxTube
      </footer>
    </div>
  );
}
