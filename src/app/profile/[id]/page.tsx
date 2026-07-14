'use client';

import { use, useState } from 'react';
import { Header } from '@/components/Header';
import { MovieGrid } from '@/components/MovieGrid';
import { ReviewCard } from '@/components/ReviewCard';
import { FollowButton } from '@/components/FollowButton';
import { useUser } from '@/hooks/useUser';
import { useUserReviews } from '@/hooks/useReviews';
import { useFollowers, useFollowing } from '@/hooks/useFollow';
import { useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';
import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/lib/api/tmdb';




import { Movie } from '@/types/movie';
import Image from 'next/image';
import { Film, Users, Clock, Star, List as ListIcon } from 'lucide-react';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = parseInt(id);
  const currentUserId = useMovieStore((state) => state.currentUserId);

  const { data: user, isLoading: userLoading } = useUser(userId);
  const { data: reviews = [] } = useUserReviews(userId);
  const { data: followers = [] } = useFollowers(userId);
  const { data: following = [] } = useFollowing(userId);
  const { data: watchlist = [] } = useWatchlist(userId);
  const { data: watched = [] } = useWatched(userId);

  const [activeTab, setActiveTab] = useState<'reviews' | 'watchlist' | 'watched' | 'followers' | 'following'>('reviews');

  const isOwnProfile = currentUserId === userId;

  // fetch movies for watchlistt
  const watchlistMovieIds = watchlist.map((item: any) => item.movieId);
  const { data: watchlistMovies = [] } = useQuery({
    queryKey: ['watchlist-movies', watchlistMovieIds],
    queryFn: async () => {
      if (watchlistMovieIds.length === 0) return [];
      const moviePromises = watchlistMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`)
      );
      const responses = await Promise.all(moviePromises);
      return responses.map(res => res.data);
    },
    enabled: watchlistMovieIds.length > 0,
  });

  // fetch movies for watched
  const watchedMovieIds = watched.map((item: any) => item.movieId);
  const { data: watchedMovies = [] } = useQuery({
    queryKey: ['watched-movies', watchedMovieIds],
    queryFn: async () => {
      if (watchedMovieIds.length === 0) return [];
      const moviePromises = watchedMovieIds.map((id: number) =>
        tmdbClient.get<Movie>(`/movie/${id}`)
      );
      const responses = await Promise.all(moviePromises);
      return responses.map(res => res.data);
    },
    enabled: watchedMovieIds.length > 0,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-white/40 text-lg uppercase tracking-widest">User not found</div>
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

   
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {user.username}
                </h1>
                <p className="text-white/60">{user.email}</p>
              </div>

              {!isOwnProfile && currentUserId && (
                <FollowButton
                  followerId={currentUserId}
                  followingId={userId}
                />
              )}
            </div>

            {user.bio && (
              <p className="text-white/70 text-lg mb-6 max-w-2xl">
                {user.bio}
              </p>
            )}

         
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <Film className="w-5 h-5 text-[#E50914]" />
                  <span className="text-2xl font-bold">{user.reviewCount}</span>
                </div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Reviews</p>
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <ListIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold">{user.watchlistCount}</span>
                </div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Watchlist</p>
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold">{user.watchedCount}</span>
                </div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Watched</p>
              </div>



              <button
                onClick={() => setActiveTab('followers')}
                className="text-center md:text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold">{user.followersCount}</span>
                </div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Followers</p>
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className="text-center md:text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-white/90 mb-1">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span className="text-2xl font-bold">{user.followingCount}</span>


                </div>
                <p className="text-white/50 text-sm uppercase tracking-wider">Following</p>
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="px-6 md:px-12 lg:px-14">
        <div className="border-b border-white/10 mb-12">


          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'reviews', label: 'Reviews', count: reviews.length },
              { id: 'watchlist', label: 'Watchlist', count: watchlistMovies.length },
              { id: 'watched', label: 'Watched', count: watchedMovies.length },
              { id: 'followers', label: 'Followers', count: followers.length },
              { id: 'following', label: 'Following', count: following.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E50914]'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>


        <div className="pb-24">
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-4xl">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} showMovieLink />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/40">No reviews yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            watchlistMovies.length > 0 ? (
              <MovieGrid movies={watchlistMovies} />
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40">Watchlist is empty</p>
              </div>
            )
          )}

          {activeTab === 'watched' && (
            watchedMovies.length > 0 ? (
              <MovieGrid movies={watchedMovies} />
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40">No watched movies yet</p>
              </div>
            )
          )}

          {activeTab === 'followers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div
                    key={follower.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {follower.avatarUrl ? (
                        <Image
                          src={follower.avatarUrl}
                          alt={follower.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />


                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-white/70 font-medium">
                            {follower.username[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{follower.username}</p>
                        {follower.bio && (
                          <p className="text-white/50 text-sm line-clamp-1">{follower.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>



                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-white/40">No followers yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.length > 0 ? (
                following.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />


                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-white/70 font-medium">
                            {user.username[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.username}</p>
                        {user.bio && (
                          <p className="text-white/50 text-sm line-clamp-1">{user.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (


                
                <div className="col-span-full text-center py-12">
                  <p className="text-white/40">Not following anyone yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
