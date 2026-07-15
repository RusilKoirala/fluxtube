'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMovieStore } from "@/store/useMovieStore";


export function ProtectedRoute({ children }: { children: React.ReactNode}) {

    const currentUserId = useMovieStore((state)=> state.currentUserId);

    const router = useRouter();

    useEffect(()=> {
        const token = localStorage.getItem('token');

        if (!token || !currentUserId) {
            router.push('/login');
        }
    }, [currentUserId, router]);

    if (!currentUserId) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white/40 text-lg uppercase tracking-widest">
                Loading...
                </div>
            </div>
        )
    }
    return <>{children}</>
}