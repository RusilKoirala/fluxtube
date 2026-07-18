'use client';

import { use } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { useSearchParams } from "next/navigation";
import { useSearchMovies } from "@/hooks/useMovies";
import { Suspense } from "react";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { data: results, isLoading } = useSearchMovies(query);

    return (
        <main className="container max-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">
                Search results for "{query}"
            </h1>

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">Searching...</p>
                </div>
            ): (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results && results.length > 0 ? (
                        results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    ) : (
                        <p className="text-gray-400 col-span-full text-center py-12">
                            No results found
                        </p>
                    )}
                </div>
            )}
        </main>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-black">
            <Header/>
            <Suspense fallback={
                <main className="container max-auto px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-400">Loading...</p>
                    </div>
                </main>
            }>
                <SearchContent />
            </Suspense>
        </div>
    )
}