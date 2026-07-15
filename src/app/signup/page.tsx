"use client";

import { useState } from "react";
import Link from "next/link";


import { useSignup } from "@/hooks/useAuth";
import { Film, Mail, Lock, User, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  

  const signup = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate({ username, email, password });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justfiy-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Film className="w-8 h-8 text-[#E50914]" />
            <span className="text-2xl font-bold text-white">FluxTube</span>
          </Link>
          <p className="text-white/60 mt-2">Create your account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />


                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
                <label className="block text-white/90 texxt-sm font-medium mb-2 uppercase tracking-wider">
                Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"/>
                    <input 
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white  placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
                    placeholder="johndoe@example.com"
                    />
                </div>
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
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50" 
                    placeholder="******"
                    />
                </div>
                <p className="text-white/40 text-xs mt-2">Minimum 6 characters</p>
            </div>

            {signup.isError && (
                <div className="text-red-400 texxt-sm text-center">
                    {(signup.error as any)?.response?.data?.error || 'Signup failed'}
                </div>
            )}

            <button 
            type="submit"
            disabled={signup.isPending}
            className="w-full py-3 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-lg font-medium uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {signup.isPending ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin"/>
                    <span>Creating Account...</span>
                    </>
                ): (
                    <span>Sign Up </span>
                )}
            </button>
          </form>


          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
            Already are a member?{' '}
            <Link href='/login' className="text-[#E50914] hover:underline">
            
            </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
