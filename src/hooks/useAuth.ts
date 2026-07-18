import { useMovieStore } from "@/store/useMovieStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";


interface LoginCredentials {
    email: string;
    password: string;
}

interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}


interface AuthResponse {
    user: {
        id: number;
        username: string;
        email: string;
        avatarUrl?: string;
        bio?: string;
    };
    token: string;
}



export const useLogin = () => {
    const setCurrentUserId = useMovieStore((state)=> state.setCurrentUserId);
    const router= useRouter();


    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data }= await axios.post<AuthResponse>('/api/auth/login', credentials);
            return data;
        },
        onSuccess: (data)=> {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user',JSON.stringify(data.user));
            setCurrentUserId(data.user.id)

            router.push('/');
        }
    })
}


export const useSignup = ()=> {
    const setCurrentUserId = useMovieStore((state)=> state.setCurrentUserId)
    const router= useRouter();


    return useMutation({
        mutationFn: async (credentials: SignUpCredentials)=> {
            const {data} = await axios.post<AuthResponse>('/api/auth/signup',credentials);
            return data;
        },
        onSuccess: (data)=> {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user',JSON.stringify(data.user));
            setCurrentUserId(data.user.id)
            router.push('/');
        }
    });
};

export const useLogout =()=> {
    const clearCurrentUserId = useMovieStore((state)=> state.clearCurrentUserId);
    const queryClient = useQueryClient();
    const router= useRouter();

    return useMutation({
        mutationFn: async ()=> {
            localStorage.removeItem('token');
            localStorage.removeItem('user')
            clearCurrentUserId();
            queryClient.clear();
        },
        onSuccess: ()=> {
            router.push('/login')
        }
    })
}


export const useVerifyToken = () => {
    const setCurrentUserId = useMovieStore((state)=> state.setCurrentUserId);

    return useQuery({
        queryKey: ['verifyToken'],
        queryFn: async()=> {
            const token = localStorage.getItem('token')

        if (!token) return null;

        try {
            const { data }= await axios.post('/api/auth/verify', {token});
            setCurrentUserId(data.user.userId);
            return data.user;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
        },
        retry: false,
    })
}