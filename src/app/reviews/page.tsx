// "use client";

// import { useState } from "react";
// import { FaStar } from "react-icons/fa";

// const dummyReviews = [
//     { id: 1, name: "John Doe", rating: 5, comment: "Amazing food and fast delivery!", date: "2024-02-01" },
//     { id: 2, name: "Jane Smith", rating: 4, comment: "Great taste, but delivery took a bit longer.", date: "2024-02-10" },
//     { id: 3, name: "Michael Brown", rating: 3, comment: "Good, but expected better quality.", date: "2024-02-15" },
//     { id: 4, name: "Emily Wilson", rating: 5, comment: "Best food service ever!", date: "2024-02-18" },
//     { id: 5, name: "Chris Evans", rating: 2, comment: "Not happy with the packaging.", date: "2024-02-20" },
//     { id: 6, name: "Sophia Lee", rating: 4, comment: "Food was delicious, but little expensive.", date: "2024-02-22" },
// ];

// export default function ReviewsPage() {
//     const [reviews] = useState(dummyReviews);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">⭐ Customer Reviews</h1>

//             <div className="bg-white p-4 rounded-xl shadow-md">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="p-3 text-left">Customer</th>
//                             <th className="p-3 text-left">Rating</th>
//                             <th className="p-3 text-left">Comment</th>
//                             <th className="p-3 text-left">Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reviews.map((review) => (
//                             <tr key={review.id} className="border-b">
//                                 <td className="p-3">{review.name}</td>
//                                 <td className="p-3">
//                                     <div className="flex">
//                                         {Array.from({ length: 5 }, (_, index) => (
//                                             <FaStar
//                                                 key={index}
//                                                 className={`mr-1 ${
//                                                     index < review.rating ? "text-yellow-500" : "text-gray-300"
//                                                 }`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </td>
//                                 <td className="p-3">{review.comment}</td>
//                                 <td className="p-3">{review.date}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
// "use client";

// import { useState } from "react";
// import { FaStar } from "react-icons/fa";

// const reviews = [
//   {
//     id: 1,
//     name: "Roberto Jr.",
//     dish: "Chicken Biryani Special",
//     category: "Main Course",
//     rating: 4.8,
//     comment: "Tasty and aromatic biryani, loved the spices and tender chicken!",
//     date: "2025-04-10",
//     dishImage: "https://images.unsplash.com/photo-1589302168068-379d868adade",
//     userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//     tags: ["Good Services", "Tasty Food"],
//   },
//   {
//     id: 2,
//     name: "Lord Ned Stark",
//     dish: "Beef Nihari with Naan",
//     category: "Main Course",
//     rating: 4.5,
//     comment: "Rich and flavorful nihari, the naan was perfectly soft.",
//     date: "2025-04-15",
//     dishImage: "https://images.unsplash.com/photo-1626503044019-0a4c2d6d6c44",
//     userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
//     tags: ["Excellent", "Friendly Staff"],
//   },
//   {
//     id: 3,
//     name: "Freddy Mercury",
//     dish: "Mutton Karahi",
//     category: "Main Course",
//     rating: 4.6,
//     comment: "Spicy and tender karahi, a must-try for meat lovers!",
//     date: "2025-04-18",
//     dishImage: "https://images.unsplash.com/photo-1625944228123-2db2d93131f2",
//     userImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
//     tags: ["Spicy", "Great Ambiance"],
//   },
//   {
//     id: 4,
//     name: "Ayesha Siddiqui",
//     dish: "Chicken Tikka",
//     category: "Appetizer",
//     rating: 4.3,
//     comment: "Juicy and smoky tikka, paired perfectly with mint chutney.",
//     date: "2025-04-20",
//     dishImage: "https://images.unsplash.com/photo-1599487488170-d91ec9c6d4f5",
//     userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//     tags: ["Tasty", "Quick Service"],
//   },
//   {
//     id: 5,
//     name: "Hassan Raza",
//     dish: "Haleem",
//     category: "Main Course",
//     rating: 4.6,
//     comment: "The haleem was rich and comforting, a true delight!",
//     date: "2025-04-22",
//     dishImage: "https://images.unsplash.com/photo-1642351697999-ce8d64e2dd91",
//     userImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
//     tags: ["Comfort Food", "Excellent"],
//   },
// ];

// const ReviewsPage = () => {
//   const [filterPeriod, setFilterPeriod] = useState<"Last 30 Days" | "Last 60 Days" | "All Time">("Last 30 Days");
//   const [sortOption, setSortOption] = useState<"highest-rated" | "most-recent">("highest-rated");
//   const [visibleOtherReviews, setVisibleOtherReviews] = useState(3);

//   // Filter reviews by period
//   const filterReviewsByPeriod = (reviews: typeof reviews) => {
//     const now = new Date("2025-04-25");
//     return reviews.filter(review => {
//       const reviewDate = new Date(review.date);
//       if (filterPeriod === "Last 30 Days") {
//         return (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
//       } else if (filterPeriod === "Last 60 Days") {
//         return (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24) <= 60;
//       }
//       return true; // All Time
//     });
//   };

//   // Sort reviews
//   const sortReviews = (reviews: typeof reviews) => {
//     return [...reviews].sort((a, b) => {
//       if (sortOption === "highest-rated") {
//         return b.rating - a.rating;
//       }
//       return new Date(b.date).getTime() - new Date(a.date).getTime(); // Most recent
//     });
//   };

//   const filteredReviews = sortReviews(filterReviewsByPeriod(reviews));
//   const topReviews = filteredReviews.slice(0, 3); // Top 3 reviews for cards
//   const otherReviews = filteredReviews;

//   const handleLoadMore = () => {
//     setVisibleOtherReviews(prev => Math.min(prev + 3, otherReviews.length));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900">Reviews</h1>
//           <p className="text-sm text-gray-500">Dashboard &gt; Customer Reviews</p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <select
//             value={filterPeriod}
//             onChange={(e) => setFilterPeriod(e.target.value as any)}
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="Last 30 Days">Last 30 Days</option>
//             <option value="Last 60 Days">Last 60 Days</option>
//             <option value="All Time">All Time</option>
//           </select>
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value as any)}
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="highest-rated">Highest Rated</option>
//             <option value="most-recent">Most Recent</option>
//           </select>
//         </div>
//       </div>

//       {/* Top Reviews */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {topReviews.map((review) => (
//           <div
//             key={review.id}
//             className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
//           >
//             <img
//               src={review.dishImage}
//               alt={review.dish}
//               className="w-full h-40 object-cover rounded-lg mb-4"
//             />
//             <h3 className="text-lg font-semibold text-blue-900">{review.dish}</h3>
//             <p className="text-sm text-green-600 mb-2">{review.category}</p>
//             <p className="text-sm text-gray-600 mb-4">{review.comment}</p>
//             <div className="flex items-center">
//               <img
//                 src={review.userImage}
//                 alt={review.name}
//                 className="w-10 h-10 rounded-full mr-3 border-2 border-blue-200"
//               />
//               <div>
//                 <p className="font-semibold text-blue-900">{review.name}</p>
//                 <p className="text-sm text-gray-500">{review.date}</p>
//               </div>
//               <div className="ml-auto flex items-center">
//                 {Array.from({ length: 5 }, (_, index) => (
//                   <FaStar
//                     key={index}
//                     className={`mr-1 ${index < Math.floor(review.rating) ? "text-yellow-500" : "text-gray-300"}`}
//                   />
//                 ))}
//                 <span className="text-sm font-semibold text-blue-900">{review.rating}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Others Section */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-semibold text-blue-900 mb-4">Others</h2>
//         <p className="text-sm text-gray-500 mb-6">Here is customer review about your restaurant</p>
//         {otherReviews.slice(0, visibleOtherReviews).map((review) => (
//           <div key={review.id} className="border-b border-gray-200 py-4 last:border-b-0">
//             <div className="flex items-center mb-2">
//               <img
//                 src={review.userImage}
//                 alt={review.name}
//                 className="w-10 h-10 rounded-full mr-3 border-2 border-blue-200"
//               />
//               <div>
//                 <p className="font-semibold text-blue-900">{review.name}</p>
//                 <p className="text-sm text-gray-500">{review.date}</p>
//               </div>
//               <div className="ml-auto flex items-center">
//                 {Array.from({ length: 5 }, (_, index) => (
//                   <FaStar
//                     key={index}
//                     className={`mr-1 ${index < Math.floor(review.rating) ? "text-yellow-500" : "text-gray-300"}`}
//                   />
//                 ))}
//                 <span className="text-sm font-semibold text-blue-900">{review.rating}</span>
//               </div>
//             </div>
//             <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {review.tags.map((tag, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//             <button
//               onClick={() => alert(`Replying to ${review.name}'s review...`)}
//               className="text-blue-600 text-sm hover:underline"
//             >
//               Reply
//             </button>
//           </div>
//         ))}
//         {visibleOtherReviews < otherReviews.length && (
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={handleLoadMore}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Load More
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewsPage;
//--------
"use client";

import { useState } from "react";
import { FaStar, FaReply, FaEdit, FaTrash } from "react-icons/fa";

// Dummy data for reviews
const initialReviews = [
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
  const [reviews, setReviews] = useState(initialReviews);
  const [filterPeriod, setFilterPeriod] = useState("Last 30 Days");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);

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

  const handleReply = (review: any) => {
    setCurrentReview(review);
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const replyText = form.reply.value;
    setReviews(
      reviews.map((r) =>
        r.id === currentReview.id ? { ...r, reply: replyText } : r
      )
    );
    setIsReplyModalOpen(false);
    setCurrentReview(null);
    form.reset();
  };

  const handleEditReview = (review: any) => {
    setCurrentReview(review);
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const updatedReview = {
      ...currentReview,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Reviews</h1>
        <p className="text-sm text-gray-500">Dashboard &gt; Customer Reviews</p>
      </div>

      {/* Filters */}
      <div className="flex justify-end space-x-4 mb-6">
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option>Last 30 Days</option>
          <option>Last 60 Days</option>
          <option>All Time</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option>Highest Rated</option>
          <option>Most Recent</option>
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
              <div className="flex justify-end space-x-2">
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900">{review.dishName}</h3>
            <p className="text-sm text-green-600">{review.category}</p>
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            <div className="flex items-center mt-2">
              <img
                src={`https://randomuser.me/api/portraits/men/${review.id}.jpg`}
                alt={review.reviewerName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-medium">{review.reviewerName}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="ml-auto flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(review.rating) ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm">{review.rating}</span>
              </div>
            </div>
            {review.reply && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Reply: {review.reply}</p>
              </div>
            )}
            <div className="flex space-x-2 mt-4">
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