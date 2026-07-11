'use client';

import { use } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { useSearchParams } from "next/navigation";
import { useSearchMovies } from "@/hooks/useMovies";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { data: results, isLoading } = useSearchMovies(query);

    return (
        <div className="min-h-screen bg-black">
            <Header/>

            <main className="container max-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">
                    Search results for "{query}"
                </h1>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Searching...</p>
                    </div>
                ): (
                    <MovieCard movie={results || []}/>
                )}
            </main>
        </div>
    )
}