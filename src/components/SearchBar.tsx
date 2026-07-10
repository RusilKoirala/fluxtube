'use client';

import { Search } from "lucide-react";
import { useState } from "react";
import { useMovieStore } from "@/store/useMovieStore";
import { useRouter } from "next/router";


export function SearchBar() {
    const [query, setQuery] = useState('')
    const router = useRouter()
    const setSearchQuery = useMovieStore((state)=> state.setsearchQuery)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            setSearchQuery(query)
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e)=> setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </form>
    )
}