'use client';

import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { usePopularMovies, useTrendingMovies } from "@/hooks/useMovies";

export default function HomePage() {
  const { data: popular, isLoading: popularLoading, error: popularError} = usePopularMovies();
  const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();


  return (
    <div className="min-h-screen bg-black">
      <Header/>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Trending */}
        <section>
          { trendingLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading trending movies...</p>
            </div>
          ) : trendingError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error: {String(trendingError)}</p>
            </div>
          ) : (
            <MovieGrid movies={trending || []} title="Trending This Week" />
          )}
        </section>

        {/* Popular */}
        <section>
          { popularLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading popular movies...</p>
            </div>
          ) : popularError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error: {String(popularError)}</p>
            </div>
          ) : (
            <MovieGrid movies={popular || []} title="Popular Movies" />
          )}
        </section>
      </main>
    </div>
  );
}
