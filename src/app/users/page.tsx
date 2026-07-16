"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import {
  useSearchUsers,
  usePopularUsers,
  useSuggestedUsers,
} from "@/hooks/useUserSearch";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import { useMovieStore } from "@/store/useMovieStore";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = useMovieStore((state) => state.currentUserId);

  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchUsers(searchQuery);
  const { data: popularUsers = [], isLoading: popularLoading } =
    usePopularUsers(10);
  const { data: suggestUsers = [], isLoading: suggestedLoading } =
    useSuggestedUsers(currentUserId || 0, 10);

  const showSearch = searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-32 px-6 md:px-12 lg:px-14 pb-24">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {showSearch && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Search className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em]">
                Search Results ({searchResults.length})
              </h2>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-lg h-32 animate-pulse"
                  />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40">No users found</p>
              </div>
            )}
          </section>
        )}

        {!showSearch && currentUserId && (
            <section className="mb-16">
                <div className="flex itmes-center gap-3 mb-8">
                    <Sparkles className="w-5 h-5 text-purple-500"/>
                    <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em]">
                        Suggested For You
                    </h2>
                </div>

                {suggestedLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/5 rounded-lg h-32 animate-pulse" />
                        ))}
                    </div>
                ): suggestUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                ): (
                    <div className="text-center py-12">
                        <p className="text-white/40">No suggestions</p>
                    </div>
                )}
            </section>
        )}


        {!showSearch && (
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-5 h-5 text-[#E50914]"/>
                    <h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-[0.15em]">Popular Users</h2>
                </div>

                {popularLoading? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(8).map((_,i)=> (
                            <div key={i} className="bg-white/5 rounded-lg h-32 animate-pulse"/>
                        ))]}
                    </div>
                ): (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {popularUsers.map((users)=> (
                            <UserCard key={users.id} user={users}/>
                        ))}
                    </div>
                )}
            </section>
        )}
      </main>
    </div>
  );
}
