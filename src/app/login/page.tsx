'use client';


import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";
import { Film,Mail, Lock, Loader2 } from "lucide-react";



export default function LoginPage() {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        login.mutate({
            email,
            password
        })
    }



    return (


        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <Link  href="/"
                    className="inline-flex items-center gap-3">
                        <Film className="w-8 h-8 text-[#E50914]"/>
                        <span className="text-2xl font-bold text-white">FluxTube</span>
                    </Link>
                    <p className="text-white/60 mt-2">Sign in to your account</p>
                </div>



                <div className="bg-white/5 backdrop:blur-sm border border-white/10 rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
                            Email
                            </label> 
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"/>
                            <input 
                            type="email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none  focus:ring-[#E50914]/50"
                            placeholder="jhondoe@example.com"
                            />
                        </div>


                        <div> 

                            <label className="block text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
                             Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"/>
                                <input
                                type="password"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)} 
                                required
                                minLength={6}
                                className="w-full pl-12 pr-4 py-3 bg-black/30 border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                                placeholder="***********"
                                />
                            </div>
                        </div>

                        {login.isError && (
                            <div className="text-red-400 text-sm text-center">
                                {(login.error as any)?.response?.data?.error || 'Login failed'}
                            </div>
                        )}

                        <button type="submit" disabled={login.isPending} 
                        className="w-full py-3 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-lg font-medium uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {login.isPending ? (
                                <>
                                <Loader2 className="w-5 h-5 animate-spin"/>
                                <span>Signing In...</span>
                                </>
                            ): (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>


                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                        Be a member! {' '}
                        </p>
                        <Link href='/signup' className="text-[#E50914] hover:underline">
                        Signup
                        </Link>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}