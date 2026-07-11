'use client';

import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { usePopularMovies, useTrendingMovies } from "@/hooks/useMovies";
import { TrendingUp, Star } from "lucide-react";

export default function HomePage() {
  const { data: popular, isLoading: popularLoading } = usePopularMovies();
  const { data: trending, isLoading: trendingLoading } = useTrendingMovies();

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

    
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              Discover Movies
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto tracking-wide">
              Track what you watch, share with friends, and never forget a great movie
            </p>
          </div>
        </div>
      </div>

      <main className="px-6 md:px-12 lg:px-14 pb-24 space-y-16">
     
        <section>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em]">
              Trending This Week
            </h2>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-white/5 rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={trending || []} />
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em]">
              Popular Right Now
            </h2>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-white/5 rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={popular || []} />
          )}
        </section>
      </main>
    </div>
  );
}