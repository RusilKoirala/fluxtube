import { Review } from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


// find reviewsss
export const useReviews = (movieId: number) => {
    return useQuery({
        queryKey: ['reviews',movieId],
        queryFn: async () => {
            const { data }= await axios.get(`/api/reviews?movieId=${movieId}`)
            return data;
        },
    })
}




// create review
export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, movieId, content, rating}: { userId: number; movieId: number; content: string, rating: number})=> {
            const { data } = await axios.post('/api/reviews', {userId, movieId, content, rating})
            return data;
        },
        onSuccess: (_, variables)=> {
            queryClient.invalidateQueries({
                queryKey: ['reviews', variables.movieId]
            });
            queryClient.invalidateQueries({
                queryKey: ['reviews', 'user', variables.userId]
            })
        }
    })
}

// hook for movie review
export const useMovieReviews = (movieId: number) => {
    return useQuery({
        queryKey: ['reviews', 'movie', movieId],
        queryFn: async() => {
            const { data } = await axios.get<Review[]>(`/api/review?movieId=${movieId}`)
            return data;
        },
        enabled: !!movieId,
    })
}


// hook for user review 
export const useUserReviews = (userId: number) => {

    return useQuery({
        queryKey: ['reviews', 'user', userId],
        queryFn: async () => {
            const {data} = await axios.get<Review[]>(`/api/reviews?userId=${userId}`)
            return data;
        }, 
        enabled: !!userId,
    })
}



export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ reviewId , content, rating}: {
            reviewId : number,
            content?: string,
            rating?: number,
        })=> {
            const { data } = await axios.patch(`/api/reviews/${reviewId}`, {
                content, rating
            })
            return data;
        }
    })
    
}


export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      await axios.delete(`/api/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};