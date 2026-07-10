'use client';

import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";

export default function HomePage() {
  const { data: popular, isLoading: popularLoading} = usePopularMovies()
  const { data: trending, isLoading: trendingLoading } = useTrendingMovies();

  return (
    <div className="min-h-screen bg-black">
      <Header/>

      <main className="container mx-auto px-4 py-8 space-y-12">

        <section>
          { trendigLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading trending movies...</p>
            </div>
          ): (
            <MovieCard movie={trending || []} title="Trending"/>
          )}
        </section>

        <section>
          { popularLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading popular movies...</p>
            </div>
          ): (
            <MovieCard movie={popular || []} title="Popular Movies"/>
          )}
        </section>
      </main>
    </div>
)
}