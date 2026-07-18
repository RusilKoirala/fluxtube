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
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block bg-[#f5c518] text-black font-extrabold text-[24px] px-3 py-1.5 rounded tracking-wide mb-4">
            FluxTube
          </Link>
          <h1 className="text-[24px] font-bold text-white mb-1">Create Account</h1>
          <p className="text-[14px] text-neutral-500">Join FluxTube today</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-[13px] font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded text-white text-[14px] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-[13px] font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"/>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded text-white text-[14px] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50"
                  placeholder="johndoe@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-[13px] font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"/>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded text-white text-[14px] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50" 
                  placeholder="At least 6 characters"
                />
              </div>
              <p className="text-neutral-500 text-[12px] mt-1.5">Minimum 6 characters</p>
            </div>

            {signup.isError && (
              <div className="text-red-400 text-[13px] text-center bg-red-900/20 border border-red-800 rounded p-3">
                {(signup.error as any)?.response?.data?.error || 'Signup failed'}
              </div>
            )}

            <button 
              type="submit"
              disabled={signup.isPending}
              className="w-full py-3 bg-[#f5c518] hover:bg-[#f5c518]/90 text-black rounded font-semibold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {signup.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-500 text-[13px]">
              Already have an account?{' '}
              <Link href='/login' className="text-[#f5c518] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
