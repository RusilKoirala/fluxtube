'use client';

import { use, useState } from 'react';
import { Header } from '@/components/Header';
import { MovieGrid } from '@/components/MovieGrid';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewModal } from '@/components/ReviewModal';
import { useMovieDetails, 
    useRecommendations } from '@/hooks/useMovies';
import { useMovieReviews, useDeleteReview } from '@/hooks/useReviews';
import { getImageUrl } from '@/lib/api/tmdb';
import { TrailerModal } from '@/components/TrailerModal';


import Image from 'next/image';
import { Calendar, Clock, Star, Plus, Check, Eye, Play, MessageSquare, Share2 } from 'lucide-react';
import { useAddToWatchlist, useRemoveFromWatchlist, useAddToWatched, useWatchlist, useWatched } from '@/hooks/useWatchlist';
import { useMovieStore } from '@/store/useMovieStore';
import { cn } from '@/lib/utils';



import { Review } from '@/types/user';

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieId = parseInt(id);

  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { data: recommendations } = useRecommendations(movieId);
  const { data: reviews = [] } = useMovieReviews(movieId);
  const deleteReview = useDeleteReview();

  const currentUserId = useMovieStore((state) => state.currentUserId);
  const { data: watchlist = [] } = useWatchlist(currentUserId || 0);
  const { data: watched = [] } = useWatched(currentUserId || 0);

  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const addToWatched = useAddToWatched();

  const isInWatchlist = watchlist.some((item: any) => item.movieId === movieId);
  const isWatched = watched.some((item: any) => item.movieId === movieId);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>();


  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<{key: string; name:string} | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  const userReview = reviews.find((r) => r.userId === currentUserId);
  const otherReviews = reviews.filter((r) => r.userId !== currentUserId);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);

    setIsReviewModalOpen(true);
  };

  const getOfficialTrailer = () => {
    if (!movie?.videos?.results) {
      console.log('No videos data:', movie?.videos);
      return null;
    }

    console.log('Available videos:', movie.videos.results);

    const trailer = movie.videos.results.find(
      (video)=> video.type === 'Trailer' && video.site === 'YouTube' && video.official
    )

    if (!trailer) {
      const anyTrailer = movie.videos.results.find(
        (video)=> video.type === 'Trailer' && video.site === 'YouTube'
      );
      console.log('Found non-official trailer:', anyTrailer);
      return anyTrailer;
    }

    console.log('Found official trailer:', trailer);
    return trailer;
  }

  const trailer= getOfficialTrailer();

  const handleDeleteReview = (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(reviewId);
    }
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-neutral-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="text-neutral-500 text-sm">Movie not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-6">
        <div className="text-[13px] text-neutral-500 mb-2">
          Home › Movies › {movie.genres?.[0]?.name || 'Details'}
        </div>

        <h1 className="text-[32px] font-bold text-white mb-2">
          {movie.title}{' '}
          <span className="font-normal text-neutral-500">
            ({new Date(movie.release_date).getFullYear()})
          </span>
        </h1>

        <div className="flex items-center gap-3 text-[14px] text-neutral-500 mb-4 flex-wrap">
          {movie.runtime && (
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          )}
          <span>{movie.genres?.map(g => g.name).join(', ')}</span>
          <span>{new Date(movie.release_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-6 grid grid-cols-1 md:grid-cols-[300px_1fr_260px] gap-4">
        <div className="aspect-[2/3] relative rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-600 text-[13px]">
              Poster image
            </div>
          )}
        </div>

        <div className="relative min-h-[280px] rounded border border-neutral-800 overflow-hidden bg-gradient-to-br from-neutral-800 to-black">
          {movie.backdrop_path ? (
            <Image
              src={getImageUrl(movie.backdrop_path, 'w1280')}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-600 text-[13px]">
              Backdrop / trailer thumbnail
            </div>
          )}
          <button
            onClick={() => {
              if (trailer) {
                setSelectedTrailer({key: trailer.key, name: trailer.name});
                setShowTrailer(true);
              }
            }}
            disabled={!trailer}
            className={cn(
              "absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 rounded-full text-white text-[13px] border",
              trailer
                ? "bg-black/60 backdrop-blur-sm border-white/30 hover:bg-black/80"
                : "bg-black/30 border-white/20 opacity-50 cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4 fill-white" />
            {trailer ? 'Play trailer' : 'No trailer'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded p-3">
            <div className="text-[12px] text-neutral-500 mb-2">FLUXTUBE RATING</div>
            <div className="flex items-center gap-2">
              <Star className="w-7 h-7 fill-[#f5c518] text-[#f5c518]" />
              <span className="text-[22px] font-bold text-white">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-[13px] text-neutral-500">/10</span>
              <span className="text-[11px] text-neutral-600 ml-auto">
                {reviews.length}
              </span>
            </div>
          </div>

          {currentUserId && (
            <>
              <button
                onClick={() => {
                  if (isInWatchlist) {
                    removeFromWatchlist.mutate({ userId: currentUserId, movieId });
                  } else {
                    addToWatchlist.mutate({ userId: currentUserId, movieId });
                  }
                }}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-white text-[13px] border",
                  isInWatchlist
                    ? "bg-neutral-700 border-neutral-600 hover:bg-neutral-600"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                )}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                onClick={() => addToWatched.mutate({ userId: currentUserId, movieId })}
                disabled={isWatched}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-white text-[13px] border",
                  isWatched
                    ? "bg-green-800 border-green-700 cursor-default"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                )}
              >
                <Eye className="w-4 h-4" />
                {isWatched ? 'Watched' : 'Mark Watched'}
              </button>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-[13px] hover:bg-neutral-700"
              >
                <MessageSquare className="w-4 h-4" />
                {userReview ? 'Edit Review' : 'Write Review'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-[13px] hover:bg-neutral-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </>
          )}
        </div>
      </div>

      {showShareToast && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50 text-[13px]">
          Link copied to clipboard!
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
        <h2 className="text-[20px] font-semibold text-white mb-3">Storyline</h2>
        <p className="text-[14px] text-neutral-300 leading-relaxed max-w-[800px]">
          {movie.overview}
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {movie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="border border-neutral-700 px-2 py-1 rounded-full text-[12px] text-neutral-500"
            >
              #{genre.name.toLowerCase().replace(' ', '-')}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
        <h2 className="text-[20px] font-semibold text-white mb-4">
          Reviews ({reviews.length})
        </h2>

        <div className="space-y-4 max-w-4xl">
          {userReview && (
            <div className="border-l-4 border-[#f5c518] pl-4">
              <p className="text-neutral-400 text-[12px] mb-3">YOUR REVIEW</p>
              <ReviewCard
                review={userReview}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            </div>
          )}

          {otherReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-[14px]">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 py-5 border-t border-neutral-800">
          <h2 className="text-[20px] font-semibold text-white mb-3">
            More Like This
          </h2>
          <MovieGrid movies={recommendations} />
        </div>
      )}

      {currentUserId && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseModal}
          userId={currentUserId}
          movieId={movieId}
          movieTitle={movie.title}
          existingReview={editingReview || userReview}
        />
      )}

      {selectedTrailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          videoKey={selectedTrailer.key}
          title={selectedTrailer.name}
        />
      )}

      <footer className="max-w-[1200px] mx-auto px-4 py-8 border-t border-neutral-800 text-neutral-600 text-[12px]">
        FluxTube
      </footer>
    </div>
  );
}
