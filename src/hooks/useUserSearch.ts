import { useQuery } from "@tanstack/react-query";
import axios  from "axios";

interface UserSearchResult {
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    followersCount: number;
}


export const useSearchUsers = ( query: string) => {
    return useQuery({
        queryKey: ['users', 'search', query],
        queryFn: async()=> {
            const { data } = await axios.get<UserSearchResult[]>(`/api/users/search?q=${encodeURIComponent(query)}`)
            return data;
        },
        enabled: query.length > 0,
    })
}

export const usePopularUsers = (limit = 0) => {
    return useQuery({
        queryKey: ['users', 'popular', limit],
        queryFn: async ( )=> {
            const { data } = await axios.get<UserSearchResult[]>(
                `/api/users/popular?limit=${limit}`
            )
            return data;
        }
    })
}

export const useSuggestedUsers = (userId: number, limit = 10)=> {
    return useQuery({
        queryKey: ['users','suggested', userId,limit],
        queryFn: async ( )=> {
            const { data } = await axios.get<UserSearchResult[]>(
                `/api/users/suggested?userId=${userId}&limit=${limit}`
            )
            return data;
        },
        enabled: !!userId,
    })
}


