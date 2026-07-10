'use client';

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Film, User, List, Clock} from 'lucide-react'
import { useMovieStore } from "@/store/useMovieStore";
import { Button } from './ui/button'


export function Header() {
    const currentUserId = useMovieStore((state)=> state.currentUserId);

    return (
        <header className="sticky top-0 z-50 bg-black/95 backdrop:blur border-b border-gray-800">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justfiy-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                    <Film className="w-8 h-8 text-red-500"/>
                    <span className="text-xl font-bold text-white">FluxTube</span>
                    </Link>

                    <div className="flex-1 max-w-2xl">
                        <SearchBar/>    
                    </div> 

                    <nav className="flex items-center gap-4">
                        <Link href="">
                        <Button variant="ghost" size="sm">
                            <List className="w-5 h-5"/>
                            <span className="ml-2 hidden sm:inline">Watchlist</span>
                        </Button>
                        </Link>

                        <Link href="/watched">
                            <Button variant="ghost" size="sm">
                                <Clock className="w-5 h-5"/>
                                <span className="ml-2 hidden sm:inline">Watched</span>
                            </Button>
                        </Link>

                        <Link href={currentUserId ? `/profile/${currentUserId}` : '/login'}>
                            <Button variant="ghost"
                            size="sm"
                            >
                                <User className="w-5 h-5"/>
                                <span className="ml-2 hidden sm:inline">Profile</span>
                            </Button>
                        </Link>
                    </nav> 
                </div>
            </div>
        </header>
    )
}