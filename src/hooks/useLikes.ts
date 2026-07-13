import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export const useLikesCount = (reviewId: number) => {
    return useQuery({
        queryKey: ['likes', reviewId],
        queryFn: async() => {
            const { data }= await axios.get<{count: number}>(`/api/likes?reviewId=${reviewId}`);
            return data.count;
        },
        enabled: !!reviewId,
    })
}

export const useLikeReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ userId, reviewId }: {userId: number; reviewId: number})=>{
            const { data } = await axios.post('/api/likes', { userId, reviewId});
            return data;
        }, 
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['likes', variables.reviewId]
            })
        }
    })
}



export const useUnlikeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reviewId }: { userId: number; reviewId: number }) => {
      await axios.delete(`/api/likes?userId=${userId}&reviewId=${reviewId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['likes', variables.reviewId] });
    },
  });
};