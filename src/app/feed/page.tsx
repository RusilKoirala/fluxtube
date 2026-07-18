'use client';

import { Header } from '@/components/Header';
import { MovieGrid } from '@/components/MovieGrid';
import { usePopularMovies, useTrendingMovies, useSearchMovies } from '@/hooks/useMovies';
import { Star, TrendingUp, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FeedContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data: popular = [], isLoading: popularLoading } = usePopularMovies();
  const { data: trending = [], isLoading: trendingLoading } = useTrendingMovies();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchMovies(searchQuery);

  const showSearch = searchQuery.length > 0;

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-6">
        <h1 className="text-[32px] font-bold text-white mb-2">
          {showSearch ? `Search: "${searchQuery}"` : 'Discover Movies'}
        </h1>
        <p className="text-[14px] text-neutral-500">
          {showSearch ? `${searchResults.length} results found` : 'Browse trending and popular movies'}
        </p>
      </div>

      {showSearch && (
        <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
          <h2 className="text-[20px] font-semibold text-white mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#f5c518]" />
            Search Results
          </h2>
          {searchLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <MovieGrid movies={searchResults} />
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-[14px]">No movies found</p>
            </div>
          )}
        </div>
      )}

      {!showSearch && (
        <>
          <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
            <h2 className="text-[20px] font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#f5c518]" />
              Trending This Week
            </h2>
            {trendingLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <MovieGrid movies={trending} />
            )}
          </div>

          <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
            <h2 className="text-[20px] font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#f5c518]" />
              Popular Right Now
            </h2>
            {popularLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-neutral-900 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <MovieGrid movies={popular} />
            )}
          </div>
        </>
      )}

      <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
        FluxTube
      </footer>
    </>
  );
}

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Suspense fallback={
        <div className="max-w-[1200px] mx-auto px-4 pt-24">
          <div className="text-center py-12">
            <p className="text-neutral-500">Loading...</p>
          </div>
        </div>
      }>
        <FeedContent />
      </Suspense>
    </div>
  );
}