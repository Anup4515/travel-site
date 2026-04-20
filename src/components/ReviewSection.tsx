"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import { IReview } from "@/types";

interface ReviewSectionProps {
  packageId: string;
  reviews: IReview[];
  onReviewAdded: (review: IReview) => void;
  onRefresh?: () => Promise<void>;
}

export default function ReviewSection({ packageId, reviews, onReviewAdded, onRefresh }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/packages/${packageId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title,
          comment,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        onReviewAdded(newReview);
        toast.success("Review added successfully!");
        setShowModal(false);
        setTitle("");
        setComment("");
        setRating(5);
        
        // Refetch package to sync data from backend
        if (onRefresh) {
          await onRefresh();
        }
      } else {
        const error = await res.json().catch(() => ({}));
        toast.error(error.error || "Failed to add review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2 flex items-center gap-3">
              <MessageSquare size={28} className="text-blue-500 dark:text-yellow-400" />
              What Travellers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Read experiences from fellow travelers</p>
          </div>
          {session && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition whitespace-nowrap"
            >
              + Add Review
            </button>
          )}
        </div>

        {/* Reviews List */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div
                key={review._id || `${review.userId}-${index}-${review.title}`}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-800"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    {review.rating}.0
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">{review.title}</h3>

                {/* Review Comment */}
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4 mb-4">{review.comment}</p>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently"}
                    </p>
                  </div>
                  {review.helpful !== undefined && (
                    <button className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      👍 {review.helpful || 0}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {session
                ? "Be the first to share your experience with this amazing package!"
                : "Sign in to leave a review"}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-black dark:text-white">Share Your Experience</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-3">
                  How would you rate this package?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition"
                    >
                      <Star
                        size={40}
                        className={
                          star <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-700"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Amazing experience, highly recommended!"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-yellow-400 outline-none transition"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience, what did you love most about this package? What would you recommend to others?"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-yellow-400 outline-none transition resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
