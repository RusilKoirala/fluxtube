import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

export function MovieGrid({movies, title}: {movies: Movie[], title?: string} ) {
    if (!movies || movies.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No movies found</p>
            </div>
        )
    };

    return (
        <div>
            { title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}