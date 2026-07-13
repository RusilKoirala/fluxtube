"use client";

import { use, useState } from "react";
import { Header } from "@/components/Header";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useUser } from "@/hooks/useUser";
import { useMovieStore } from "@/store/useMovieStore";
import { useUserReviews } from "@/hooks/useReviews";
import { useFollowers, useFollowing } from "@/hooks/useFollow";
import { useWatched, useWatchlist } from "@/hooks/useWatchlist";
import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/lib/api/tmdb";
import { Movie } from "@/types/movie";
import Image from "next/image";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userId = parseInt(id);

  const currentuserId = useMovieStore((state) => state.currentUserId);

  const { data: user, isLoading: userLoading } = useUser(userId);

  const { data: reviews = [] } = useUserReviews(userId);
  const { data: followers = [] } = useFollowers(userId);
  const { data: following = [] } = useFollowing(userId);
  const { data: watchlist = [] } = useWatchlist(userId);
  const { data: watched = [] } = useWatched(userId);

  const [activeTab, setActiveTab] = useState<
    "reviews" | "watchlist" | "watched" | "followers" | "following"
  >("reviews");


  

  const isOwnProfile = currentuserId === userId;

  const watchlistMovieIds = watchlist.map((item: any) => item.movieId);
  const { data: watchlistMovies = [] } = useQuery({
    queryKey: ["watchlist-movies", watchlistMovieIds],
    queryFn: async () => {
      if (watchlistMovieIds.length === 0) return [];
      const moviePromises = watchlistMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`),
      );
      const responses = await Promise.all(moviePromises);
      return responses.map((res) => res.data);
    },
    enabled: watchlistMovieIds.length > 0,
  });

  const watchedMovieIds = watched.map((item: any) => item.movieId);
  const { data: watchedMovies = [] } = useQuery({
    queryKey: ["watched-movies", watchedMovieIds],
    queryFn: async () => {
      if (watchedMovieIds.length === 0) return [];
      const moviePromises = watchedMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`),
      );
      const responses = await Promise.all(moviePromises);
      return responses.map((res) => res.data);
    },
    enabled: watchedMovieIds.length > 0,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">
            Loading..
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">
            User not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      <div className="pt-32 px-6 md:px-12 lg:px-14 pb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                width={160}
                height={160}
                className="rounded-full"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-5xl font-bold text-white/70">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
