import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


import axios from "axios";
import { Follow } from "@/types/user";
import { boolean } from "drizzle-orm/gel-core";

export const useFollowers = (userId: number) => {
    return useQuery({
        queryKey: ['followers', userId],
        queryFn: async ()=> {
            const { data }= await axios.get<Follow[]>(`/api/follows?userId=${userId}&type=followers`);
            return data;
        },
        enabled: !!userId,
    })
}

export const useFollowing = (userId: number) => {
    return useQuery({
        queryKey: ['following', userId],
        queryFn: async ()=> {
            const { data }= await axios.get<Follow[]>(`/api/follows?userId=${userId}&type=following`)
            return data;
        },
        enabled: !!userId
    })
}


export const useIsFollowing = (followerId: number, followingId: number) => {
    return useQuery({
        queryKey: ['isFollowing', followerId, followingId],
        queryFn: async () => {
            const { data }= await axios.get<{isFollowing: boolean}>(`/api/follows/check?followerId=${followerId}&followingId=${followingId}`);
            return data.isFollowing;
        },
        enabled: !!followerId && !!followingId,
    })

}


export const useFollowerUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ followerId , followingId }: { followerId: number; followingId: number})=>{
            const { data } = await axios.post('/api/follows', {
                followerId, followingId
            })
            return data;
        },
        onSuccess: (_, variables)=> {
            queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.followerId, variables.followingId]});
            queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId]});
            queryClient.invalidateQueries({ queryKey: ['following', variables.followerId]});
            queryClient.invalidateQueries({ queryKey: ['user', variables.followingId]});
        }
    })
}


export const useUnfollowUser = ()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ followerId, followingId }: {followerId: number; followingId: number})=>{
            await axios.delete(`/api/follows?followerId=${followerId}&followingId=${followingId}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.followerId, variables.followingId]})
            queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId]})
            queryClient.invalidateQueries({ queryKey: ['following', variables.followerId]})
            queryClient.invalidateQueries({ queryKey: ['user', variables.followingId]})
        }
    })
}
