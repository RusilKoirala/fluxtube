'use client';

import { Review } from '@/types/user';


import { Star, Heart, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useLikesCount, useLikeReview, useUnlikeReview } from '@/hooks/useLikes';


import { useMovieStore } from '@/store/useMovieStore';
import { useState } from 'react';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
  showMovieLink?: boolean;
}

export function ReviewCard({ review, onEdit, onDelete, showMovieLink }: ReviewCardProps) {
  const currentUserId = useMovieStore((state) => state.currentUserId);
  const { data: likesCount = 0 } = useLikesCount(review.id);
  const likeReview = useLikeReview();
  const unlikeReview = useUnlikeReview();

  const [isLiked, setIsLiked] = useState(false);
  const isOwner = currentUserId === review.userId;

  const handleLike = () => {
    if (!currentUserId) return;

    if (isLiked) {
      unlikeReview.mutate({ userId: currentUserId, reviewId: review.id });
      setIsLiked(false);
    } else {
      likeReview.mutate({ userId: currentUserId, reviewId: review.id });
      setIsLiked(true);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
     

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.avatarUrl ? (
            <Image
              src={review.avatarUrl}
              alt={review.username || 'User'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (

            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/70 font-medium">
                {review.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <p className="text-white font-medium">{review.username}</p>
            <p className="text-white/50 text-xs">
              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>


        {isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-white/70" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="p-2 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>
        )}
      </div>




      <div className="flex items-center gap-2 mb-3">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-white/20'
            }`}
          />
        ))}
        <span className="text-white/70 text-sm ml-2">{review.rating}/10</span>
      </div>

   

      <p className="text-white/80 leading-relaxed mb-4">{review.content}</p>

    
    
      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <button
          onClick={handleLike}
          disabled={!currentUserId}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? 'fill-red-400 text-red-400' : ''}`}
          />
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  );
}
