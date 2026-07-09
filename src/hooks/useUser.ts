 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { User, UserProfile } from "@/types/user"


// useUsers function to get users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axios.get<User[]>('/api/users');
            return data;
        }
    })
}




// useUser function to get user
export const useUser = (userId: number) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async ()=> {
            const { data } = await axios.get<UserProfile>(`/api/users/${userId}`)
            return data;
        }, 
        enabled: !!userId
    })
}

// user function to createe user
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: { username: string; email: string; avatarUrl?: string; bio?: string}) => {
            const { data } = await axios.post('/api/users', userData)
            return data;

        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({ queryKey: ['users']});
        },

    });
};





// user function update userr
export const userUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ userId, updates }: { userId: Number; updates: Partial<User>}) => {
            const { data } = await axios.patch(`/api/users/${userId}`, updates);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['user', variables.userId]
            })
        }
    })
}