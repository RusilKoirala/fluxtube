import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";



export const useWatchlist = (userId: number) => {
    return useQuery({
        queryKey: ['watchlist', userId],
        queryFn: async() => {
            const { data } = await axios.get(`/api/watchlist?userId=${userId}`);
            return data;
        },

        enabled: !!userId,
    })
}


export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, movieId }: { userId: number; movieId: number }) => {
      const { data } = await axios.post('/api/watchlist', { userId, movieId });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', variables.userId] });
    },
  });
};




export const useRemoveFromWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ userId, movieId }: {userId: number; movieId: number}) => {
            await axios.delete(`/api/watchlist?userId=${userId}&movieId=${movieId}`)
        
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['watchlist', variables.userId]
            })
        }
    })
}



export const useWatched= (userId: number)=> {
    return useQuery({
        queryKey: ['watched', userId],
        queryFn: async () => {
            const { data } = await axios.get(`/api/watched?userId=${userId}`);
            return data;
        },
        enabled: !!userId,
    })
}


export const useAddToWatched = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ userId, movieId, rating}: {userId: number; movieId: number; rating?: number}) => {
            const { data } = await axios.post('/api/watched', { userId, movieId, rating});
            return data
        },
        onSuccess: (_, variables)=> {
            queryClient.invalidateQueries({
                queryKey: ['watched', variables.userId]
            })
        }
    })
}




export const useRemoveFromWatched= () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({userId, movieId}: {userId: number; movieId: number}) => {
            await axios.post(`/api/watched?userId=${userId}`)
        }, 
        onSuccess: (_, variables)=> {
            queryClient.invalidateQueries({
                queryKey: ['watched', variables.userId]
            })
        }
    })
}