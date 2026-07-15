'use client';

import { useEffect } from "react";
import { useMovieStore } from "@/store/useMovieStore";


export function AuthProvider({children}: {children: React.ReactNode}) {
    const setCurrentUserId = useMovieStore((state)=> state.setCurrentUserId);

    useEffect(()=> {

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                const userData = JSON.parse(user);
                setCurrentUserId(userData.id);

            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, [setCurrentUserId])
    return <>{children}</>
}