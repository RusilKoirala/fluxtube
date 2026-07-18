'use client';

import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/lib/api/tmdb";
import { Movie } from "@/types/movie";
import { useMovieStore } from "@/store/useMovieStore";


export default function WatchedPage() {
    const currentUserId = useMovieStore((state)=> state.currentUserId);
    const { data: watchedList = [] } = useWatchlist(currentUserId || 0);
    
    const movieIds = watchedList.filter((item: any) => item.watchedAt).map((item: any)=> item.movieId);

    const { data: movies = []} = useQuery({
        queryKey: ['watched-movies', movieIds],
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
                    Watched Movies
                </h1>

                {!currentUserId ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Please log in to view your watched movies</p>
                    </div>
                ): movies.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">You haven't watched any movies yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}