import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { tmdbClient } from "@/lib/api/tmdb";
import { Movie, MovieDetails } from "@/types/movie";


export const usePopularMovies = () => {
    return useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: async ()=> {
            const { data } = await tmdbClient.get<{ results:Movie[] }>('/movie/popular');
            return data.results;
        }
    })
}

export const useTrendingMovies = () => {
    return useQuery({
        queryKey: ['movies', 'trending'],
        queryFn: async () => {
            const { data }= await tmdbClient.get<{ results: Movie[] }>('/trending/movie/week');
            return data.results;
        }
    })
}


export const useMovieDetails = (movieId: number) => {
    return useQuery({
        queryKey: ['movie', movieId],
        queryFn: async () => {
            const { data }= await tmdbClient.get<MovieDetails>(`/movie/${movieId}`);
            return data;
        },
        enabled: !!movieId,
    })
}


export const useSearchMovies = (query: string) => {
    return useQuery({
        queryKey: ['movies', 'search', query],
        queryFn: async ()=> {
            const { data } = await tmdbClient.get<{ results: Movie[]}>('/search/movie', {
                params: {query},
            });
            return data.results;
        },
        enabled: query.length > 2,
    })
}



export const useRecommendations = (movieId: number) => {
    return useQuery({
        queryKey: ['movies', 'recoomendations', movieId],
        queryFn: async ()=> {
            const {data} = await tmdbClient.get<{results: Movie[]}>(`/movie/${movieId}/recommendations`);
            return data.results;
        },
        enabled: !!movieId,
    })
}