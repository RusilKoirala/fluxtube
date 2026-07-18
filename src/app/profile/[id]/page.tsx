"use client";

import { use, useState } from "react";
import { Header } from "@/components/Header";
import { MovieGrid } from "@/components/MovieGrid";
import { ReviewCard } from "@/components/ReviewCard";
import { FollowButton } from "@/components/FollowButton";
import { useUser } from "@/hooks/useUser";
import { useUserReviews } from "@/hooks/useReviews";
import { useFollowers, useFollowing } from "@/hooks/useFollow";
import { useWatchlist, useWatched } from "@/hooks/useWatchlist";
import { useMovieStore } from "@/store/useMovieStore";
import { useQuery } from "@tanstack/react-query";
import { tmdbClient } from "@/lib/api/tmdb";
import { Movie } from "@/types/movie";
import Image from "next/image";
import Link from "next/link";
import { Film, Users, Clock, Star, List as ListIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userId = parseInt(id);
  const currentUserId = useMovieStore((state) => state.currentUserId);

  const { data: user, isLoading: userLoading } = useUser(userId);
  const { data: reviews = [] } = useUserReviews(userId);
  const { data: followers = [] } = useFollowers(userId);
  const { data: following = [] } = useFollowing(userId);
  const { data: watchlist = [] } = useWatchlist(userId);
  const { data: watched = [] } = useWatched(userId);

  const [activeTab, setActiveTab] = useState<
    "reviews" | "watchlist" | "watched" | "followers" | "following"
  >("reviews");

  const isOwnProfile = currentUserId === userId;

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
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-neutral-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-neutral-500 text-sm">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username}
                  width={120}
                  height={120}
                  className="rounded-full border-2 border-neutral-800"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-neutral-400">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-[32px] font-bold text-white mb-1">
                    {user.username}
                  </h1>
                  <p className="text-[14px] text-neutral-500">{user.email}</p>
                </div>

                {!isOwnProfile && currentUserId && (
                  <FollowButton
                    followerId={currentUserId}
                    followingId={userId}
                  />
                )}
              </div>

              {user.bio && (
                <p className="text-[14px] text-neutral-300 mb-4 max-w-2xl">
                  {user.bio}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Star className="w-5 h-5 text-[#f5c518]" />
                  </div>
                  <div className="text-[20px] font-bold text-white">
                    {reviews.length}
                  </div>
                  <div className="text-[12px] text-neutral-500">Reviews</div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <ListIcon className="w-5 h-5 text-[#f5c518]" />
                  </div>
                  <div className="text-[20px] font-bold text-white">
                    {watchlist.length}
                  </div>
                  <div className="text-[12px] text-neutral-500">Watchlist</div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Clock className="w-5 h-5 text-[#f5c518]" />
                  </div>
                  <div className="text-[20px] font-bold text-white">
                    {watched.length}
                  </div>
                  <div className="text-[12px] text-neutral-500">Watched</div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Users className="w-5 h-5 text-[#f5c518]" />
                  </div>
                  <div className="text-[20px] font-bold text-white">
                    {followers.length}
                  </div>
                  <div className="text-[12px] text-neutral-500">Followers</div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Users className="w-5 h-5 text-[#f5c518]" />
                  </div>
                  <div className="text-[20px] font-bold text-white">
                    {following.length}
                  </div>
                  <div className="text-[12px] text-neutral-500">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
          <div className="flex gap-6 mb-6 border-b border-neutral-800">
            {[
              { key: "reviews", label: "Reviews", count: reviews.length },
              { key: "watchlist", label: "Watchlist", count: watchlist.length },
              { key: "watched", label: "Watched", count: watched.length },
              { key: "followers", label: "Followers", count: followers.length },
              { key: "following", label: "Following", count: following.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as
                      | "reviews"
                      | "watchlist"
                      | "watched"
                      | "followers"
                      | "following",
                  )
                }
                className={`pb-3 text-[14px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-[#f5c518] border-b-2 border-[#f5c518]"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p className="text-center text-neutral-500 py-12 text-[14px]">
                    No reviews yet
                  </p>
                )}
              </div>
            )}

            {activeTab === "watchlist" && (
              <div>
                {watchlistMovies.length > 0 ? (
                  <MovieGrid movies={watchlistMovies} />
                ) : (
                  <p className="text-center text-neutral-500 py-12 text-[14px]">
                    Watchlist is empty
                  </p>
                )}
              </div>
            )}

            {activeTab === "watched" && (
              <div>
                {watchedMovies.length > 0 ? (
                  <MovieGrid movies={watchedMovies} />
                ) : (
                  <p className="text-center text-neutral-500 py-12 text-[14px]">
                    No watched movies yet
                  </p>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followers.length > 0 ? (
                  followers.map((follower: any) => (
                    <Link
                      key={follower.id}
                      href={`/profile/${follower.id}`}
                      className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-400">
                          {follower.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-white">
                          {follower.username}
                        </div>
                        <div className="text-[12px] text-neutral-500">
                          {follower.email}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-neutral-500 py-12 text-[14px]">
                    No followers yet
                  </p>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {following.length > 0 ? (
                  following.map((user: any) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.id}`}
                      className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-400">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-white">
                          {user.username}
                        </div>
                        <div className="text-[12px] text-neutral-500">
                          {user.email}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-neutral-500 py-12 text-[14px]">
                    Not following anyone yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
          FluxTube
        </footer>
      </div>
    </ProtectedRoute>
  );
}
