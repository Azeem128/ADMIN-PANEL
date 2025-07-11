"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar, FaReply, FaEdit, FaTrash } from "react-icons/fa";

// Interface for Review data
interface Review {
  id: number;
  dishName: string;
  category: string;
  comment: string;
  reviewerName: string;
  rating: number;
  date: string;
  image: string;
  tags: string[];
  reply: string;
}

// Dummy data for reviews
const initialReviews: Review[] = [
  {
    id: 1,
    dishName: "Chicken Biryani Special",
    category: "Main Course",
    comment: "Tasty and aromatic biryani, loved the spices and tender chicken!",
    reviewerName: "Roberto Jr.",
    rating: 4.8,
    date: "2025-04-10",
    image: "https://images.unsplash.com/photo-1589302168068-379d868adade",
    tags: ["Good Services", "Tasty Food"],
    reply: "",
  },
  {
    id: 2,
    dishName: "Mutton Karahi",
    category: "Main Course",
    comment: "Spicy and tender karahi, a must-try for meat lovers!",
    reviewerName: "Freddy Mercury",
    rating: 4.6,
    date: "2025-04-18",
    image: "https://images.unsplash.com/photo-1625944228123-2db2d93131f2",
    tags: ["Tasty Food"],
    reply: "",
  },
  {
    id: 3,
    dishName: "Haleem",
    category: "Main Course",
    comment: "The haleem was rich and comforting, a true delight!",
    reviewerName: "Hassan Raza",
    rating: 4.6,
    date: "2025-04-22",
    image: "https://images.unsplash.com/photo-1642351697999-ce8d64e2dd91",
    tags: ["Good Services"],
    reply: "",
  },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterPeriod, setFilterPeriod] = useState("Last 30 Days");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter((review) => {
    if (filterPeriod === "All Time") return true;
    const reviewDate = new Date(review.date);
    const now = new Date("2025-04-26");
    const daysDiff = (now.getTime() - reviewDate.getTime()) / (1000 * 3600 * 24);
    return filterPeriod === "Last 30 Days" ? daysDiff <= 30 : daysDiff <= 60;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const topReviews = sortedReviews.slice(0, 3);

  const handleReply = (review: Review) => {
    setCurrentReview(review);
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const replyText = form.reply.value;
    setReviews(
      reviews.map((r) =>
        r.id === currentReview!.id ? { ...r, reply: replyText } : r
      )
    );
    setIsReplyModalOpen(false);
    setCurrentReview(null);
    form.reset();
  };

  const handleEditReview = (review: Review) => {
    setCurrentReview(review);
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const updatedReview = {
      ...currentReview!,
      comment: form.comment.value,
      rating: parseFloat(form.rating.value),
    };
    setReviews(
      reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
    setIsEditModalOpen(false);
    setCurrentReview(null);
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  // Render stars for a review
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Reviews</h1>
        <p className="text-sm text-gray-500">Dashboard Customer Reviews</p>
      </div>

      {/* Filters */}
      <div className="flex justify-end gap-4 mb-6">
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 60 Days">Last 60 Days</option>
          <option value="All Time">All Time</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="Highest Rated">Highest Rated</option>
          <option value="Most Recent">Most Recent</option>
        </select>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && currentReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Reply to {currentReview.reviewerName}</h2>
            <form onSubmit={handleSubmitReply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Reply</label>
                <textarea
                  name="reply"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="p-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg">
                  Submit Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && currentReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Review</h2>
            <form onSubmit={handleUpdateReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  name="comment"
                  defaultValue={currentReview.comment}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={currentReview.rating}
                  min="1"
                  max="5"
                  step="0.1"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="p-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900">{review.dishName}</h3>
            <p className="text-sm text-green-600">{review.category}</p>
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            <div className="flex items-center mt-2">
              <Image
                src={`https://randomuser.me/api/portraits/men/${review.id}.jpg`}
                alt={review.reviewerName}
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-medium">{review.reviewerName}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="ml-auto flex items-center">
                {renderStars(review.rating)}
                <span className="ml-1 text-sm">{review.rating}</span>
              </div>
            </div>
            {review.reply && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Reply: {review.reply}</p>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleReply(review)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaReply className="mr-2" /> Reply
              </button>
              <button
                onClick={() => handleEditReview(review)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;