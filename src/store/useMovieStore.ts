import { create } from "zustand";
import { persist } from "zustand/middleware"

interface MovieStore {
    currentUserId : number | null;
    setCurrentUserId: (id: number)=> void;
    clearCurrentUserId: () => void;
    searchQuery: string;
    setsearchQuery: (query: string)=> void;
}

export const useMovieStore = create<MovieStore>() (
    persist(
        (set) => ({
            currentUserId: null,
            setCurrentUserId: (id) => set({
                currentUserId: id
            }),
            clearCurrentUserId: () => set({ currentUserId: null }),
            searchQuery: '',
            setsearchQuery: (query)=> set({ searchQuery: query}),
        }), 
        {
            name: 'movie-storage'
        }
    )
)