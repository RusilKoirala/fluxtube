import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


// find reviewsss
export const useReviews = (movieId: number) => {
    return useQuery({
        queryKey: ['reviews',movieId],
        queryFn: async () => {
            const { data }= await axios.get(`/api/reviews?movieId=${movieId}`)
            return data;
        }
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
            })
        }
    })
}