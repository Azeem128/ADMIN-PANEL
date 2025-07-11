// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { Search, Plus, Edit, Star, ArrowLeft } from "lucide-react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TooltipItem } from "chart.js";

// import { useFetchRestaurantItemById } from "../../api/RestaurantRelatedApi/useFetchRestaurantItemById";
// import { useFetchRestaurantById } from "../../api/RestaurantRelatedApi/useFetchRestaurantById"; // Add this if it exists, or create it below
// // Register Chart.js components
// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// interface RestaurantItem {
//   itemid: string;
//   restaurantid: string;
//   itemname: string;
//   itemdescription: string | null;
//   baseprice: number;
//   availablestatus: boolean;
//   discount: number | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   itemImages: string[];
//   category: string;
// }

// interface Restaurant {
//   restaurantid: string;
//   restaurantownerid: string;
//   restaurantname: string;
//   restaurantlocation: string;
//   starttiming: string | null;
//   endtiming: string | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   restaurantImage: string | null;
//   business_type: string | null;
//   business_category: string | null;
//   cuisine: string | null;
//   branches: number | null;
//   restaurantitems: RestaurantItem[];
// }

// export default function FoodDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const [timeFilter, setTimeFilter] = useState<string>("monthly");
//   const [currency, setCurrency] = useState<string>("USD");
//   const { data: food, isLoading, error } = useFetchRestaurantItemById(id);
//   const { data: restaurant } = useFetchRestaurantById(food?.restaurantid || "");

//   const getChartData = () => {
//     // Placeholder: Replace with real revenue data from Supabase when available
//     const revenueData = {
//       monthly: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [1200, 1500, 1300, 1800, 1600, 2200, 1900, 1700, 2000, 2100, 2300, 2500] },
//       weekly: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [450, 600, 500, 700] },
//       daily: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [120, 150, 130, 180, 160, 220, 190] },
//     };
//     const selectedData = revenueData[timeFilter as keyof typeof revenueData];
//     const currencyRates = { USD: 1, PKR: 285, EUR: 0.85, GBP: 0.73 };
//     const convertedData = selectedData.data.map((value) => value * currencyRates[currency as keyof typeof currencyRates]);
//     return {
//       labels: selectedData.labels,
//       datasets: [
//         { label: "Revenue", data: convertedData, borderColor: "#60a5fa", backgroundColor: "#60a5fa", tension: 0.4, fill: { target: "origin", above: "rgba(96, 165, 250, 0.2)" } },
//       ],
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { enabled: true, callbacks: { label: (context: TooltipItem<"line">) => `${currency} ${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } },
//     },
//     scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] }, beginAtZero: true, ticks: { callback: (value: number) => `${value}` } } },
//   };

//   const getHighlightedRevenue = () => {
//     const chartData = getChartData();
//     return Math.max(...chartData.datasets[0].data).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   if (!id || isNaN(parseInt(id))) {
//     return <p className="p-6 text-gray-600">Invalid food ID.</p>;
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="min-h-screen bg-gray-100 p-6 text-center text-red-500">Error loading food: {error.message}</div>;
//   }

//   if (!food) {
//     return <p className="p-6 text-gray-600">Food item not found.</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => router.push("/food")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <ArrowLeft className="h-5 w-5" /> Back to Foods
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">🍽️ {restaurant?.restaurantname || "Food"}</h1>
//         </div>
//         <Link href="/food/new">
//           <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
//             <Plus className="h-5 w-5" /> New Menu
//           </button>
//         </Link>
//       </div>

//       <div className="relative mb-6">
//         <input
//           type="text"
//           placeholder="Search here..."
//           className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Menus</h2>
//           <Image
//             src={food.itemImages?.[0] || "https://via.placeholder.com/300"}
//             alt={food.itemname}
//             width={300}
//             height={160}
//             className="w-full h-40 object-cover rounded-lg mb-4"
//           />
//           <p className="text-sm text-gray-500 mb-2">Category: {food.category}</p>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">{food.itemname}</h3>
//           <p className={`text-sm font-medium mb-4 ${food.availablestatus ? "text-green-500" : "text-red-500"}`}>
//             {food.availablestatus ? "Stock Available" : "Out of Stock"}
//           </p>
//           <div className="flex gap-3 mb-6">
//             <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
//               Add Menu
//             </button>
//             <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2">
//               <Edit className="h-4 w-4" /> Edit Menu
//             </button>
//           </div>
//           <div className="mb-6">
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
//             <p className="text-gray-600">{food.itemdescription}</p>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Info</h4>
//             <p className="text-gray-600">Nutrition data not available yet.</p> {/* Placeholder until nutrition is fetched */}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setTimeFilter("monthly")}
//                 className={`px-3 py-1 rounded-full ${timeFilter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("weekly")}
//                 className={`px-3 py-1 rounded-full ${timeFilter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Weekly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("daily")}
//                 className={`px-3 py-1 rounded-full ${timeFilter === "daily" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Daily
//               </button>
//               <select
//                 value={currency}
//                 onChange={(e) => setCurrency(e.target.value)}
//                 className="px-3 py-1 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
//               >
//                 <option value="USD">USD</option>
//                 <option value="PKR">PKR</option>
//                 <option value="EUR">EUR</option>
//                 <option value="GBP">GBP</option>
//               </select>
//             </div>
//           </div>
//           <div className="relative">
//             <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
//               {currency} {getHighlightedRevenue()}
//             </div>
//             <div className="h-64">
//               <Line data={getChartData()} options={chartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Placeholder: Replace with real reviews data fetch */}
//           <p className="text-gray-600">Reviews data not available yet.</p>
//         </div>
//       </div>
//     </div>
//   );
// }





// 

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useFetchRestaurantItemById } from "../../api/RestaurantRelatedApi/useFetchRestaurantItemById";
import { RestaurantItem } from "../../api/RestaurantRelatedApi/restaurantTypes";
import Link from "next/link";
import RemoteImageRestaurantItems from "../../components/RemoteImages/RemoteImageRestaurantItems";
import Layout from "../../components/Layout";
import { format } from "date-fns";

export default function FoodDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: food, isLoading, error } = useFetchRestaurantItemById(id); // Assuming this hook can be extended for restaurantname

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error || !food) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-red-600 font-medium">
            Error loading food details: {error?.message || "Item not found"}
          </p>
        </div>
      </Layout>
    );
  }

  // Calculate discounted price
  const originalPrice = food.baseprice;
  const discountPercentage = food.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">{food.itemname}</h1>
            <Link href="/food">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                Back to Food Items Menu
              </button>
            </Link>
          </div>
          {/* Image Section */}
          <div className="mb-8">
            {food.itemImages && food.itemImages.length > 0 ? (
              <RemoteImageRestaurantItems
                path={food.itemImages[0]}
                alt={food.itemname}
                className="w-64 h-64 mx-auto object-cover rounded-lg shadow-md"
                width={256}
                height={256}
              />
            ) : (
              <div className="w-64 h-64 mx-auto rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                No Image Available
              </div>
            )}
          </div>
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Category</h2>
                <p className="text-gray-600">{food.category || "N/A"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Restaurant</h2>
                <p className="text-gray-600">{food.restaurantname || "Not assigned"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Description</h2>
                <p className="text-gray-600">{food.itemdescription || "No description provided"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Rating</h2>
                <p className="text-gray-600">{food.rating ? `${food.rating}/5` : "Not rated"}</p>
              </div>
            </div>

            {/* Right Column - Pricing and Status */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Original Price</h2>
                <p className="text-gray-600 line-through">${originalPrice.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Discount</h2>
                <p className="text-gray-600">{discountPercentage}%</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Final Price</h2>
                <p className="text-2xl font-bold text-green-600">${discountedPrice.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Availability</h2>
                <p className={`text-lg font-medium ${food.availablestatus ? "text-green-600" : "text-red-600"}`}>
                  {food.availablestatus ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="mt-6 border-t pt-4 text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-md font-medium">Created On</h2>
                <p>{food.createdat ? format(new Date(food.createdat), "PPP") : "N/A"}</p>
              </div>
              <div>
                <h2 className="text-md font-medium">Last Updated</h2>
                <p>{food.updatedat ? format(new Date(food.updatedat), "PPP") : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Item ID (Optional, for admin use) */}
          <div className="mt-6 text-gray-500 text-sm">
            <p>Item ID: {food.itemid}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}