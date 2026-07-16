'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useCreateReview, useUpdateReview } from '@/hooks/useReviews';
import { Review } from '@/types/user';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  movieId: number;
  movieTitle: string;
  existingReview?: Review;
}

export function ReviewModal({ isOpen, onClose, userId, movieId, movieTitle, existingReview }: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [content, setContent] = useState(existingReview?.content || '');
  const [hoveredRating, setHoveredRating] = useState(0);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !content.trim()) return;

    try {
      if (existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          content,
          rating,
        });
      } else {
        await createReview.mutateAsync({
          userId,
          movieId,
          content,
          rating,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#181818] border border-white/10 rounded-lg max-w-2xl w-full p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white uppercase tracking-wider mb-2">
              {existingReview ? 'Edit Review' : 'Write Review'}
            </h2>
            <p className="text-white/60 text-sm">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-medium mb-3 uppercase tracking-wider">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'w-8 h-8',
                      i < (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/20 hover:text-white/40'
                    )}
                  />
                </button>
              ))}
              <span className="ml-3 text-white/70 text-lg">{rating}/10</span>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-medium mb-3 uppercase tracking-wider">
              Your Review
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows={6}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 resize-none"
            />
            <p className="text-white/40 text-xs mt-2">{content.length} characters</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm font-medium uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || !content.trim()}
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded text-sm font-medium uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {existingReview ? 'Update' : 'Submit'} Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
