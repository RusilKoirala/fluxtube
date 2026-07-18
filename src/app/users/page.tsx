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
import { ProtectedRoute } from "@/components/ProtectedRoute";


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
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-[32px] font-bold text-white mb-2">Find Users</h1>
          <p className="text-[14px] text-neutral-500 mb-6">
            Search and discover movie enthusiasts
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/50 focus:bg-neutral-800 transition-all text-[14px]"
            />
          </div>
        </div>

        {showSearch && (
          <section className="mb-12 border-t border-neutral-800 pt-6">
            <h2 className="text-[20px] font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#f5c518]" />
              Search Results ({searchResults.length})
            </h2>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 rounded h-24 animate-pulse"
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
                <p className="text-neutral-500 text-[14px]">No users found</p>
              </div>
            )}
          </section>
        )}

        {!showSearch && currentUserId && (
          <section className="mb-12 border-t border-neutral-800 pt-6">
            <h2 className="text-[20px] font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f5c518]" />
              Suggested For You
            </h2>

            {suggestedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 rounded h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : suggestUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500 text-[14px]">No suggestions</p>
              </div>
            )}
          </section>
        )}

        {!showSearch && (
          <section className="border-t border-neutral-800 pt-6">
            <h2 className="text-[20px] font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#f5c518]" />
              Popular Users
            </h2>

            {popularLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 rounded h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularUsers.map((users) => (
                  <UserCard key={users.id} user={users} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
        FluxTube
      </footer>
    </div>
    </ProtectedRoute>
  );
}
