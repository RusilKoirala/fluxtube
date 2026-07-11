'use client';

import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/lib/api/tmdb";
import { Movie } from "@/types/movie";
import { useMovieStore } from "@/store/useMovieStore";


export default function WatchlistPage() {
    const currentUserId = useMovieStore((state)=> state.currentUserId);
    const { data: watchlist = [] } = useMovieStore((state)=> state.currentUserId || 0)
    
    const movieIds = watchlist.map((item: any)=> item.movieId);

    const { data: movies = []} = useQuery({
        queryKey: ['watchlist-movies', movieIds],
        queryFn: async() => {
            const moviePromises = movieIds.map((id: number)=> tmdbClient.get<Movie>(`/movie/${id}`));
            const responses  = await Promise.all(moviePromises);
            return responses.map(res=> res.data);
        },
        enabled: movieIds.length > 0,
    })


    return (
        <div className="min-h-screen bg-black">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">
                    My watchlist
                </h1>

                {!currentUserId ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Please log in to view your watchlist</p>
                    </div>
                ): (
                    <MovieCard movie={movies}/>
                )}
            </main>
        </div>
    )
}