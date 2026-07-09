// just types  for typescripttt

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids?: number[];
    genres?: Genre[];
    runtime?: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: Genre[];
    tagline: string;
    status: string;
}

export interface WatchlistItem {
    id: number;
    movieId: number;
    addedAt: string;
}

export interface WatchedItem {
    id: number;
    movieId: number;
    watchedAt: string;
    rating?: number;
}