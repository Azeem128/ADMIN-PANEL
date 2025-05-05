
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Search, Plus, Edit, Star, ArrowLeft } from "lucide-react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// // Register Chart.js components
// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// // Dummy Food Details Data
// const dummyFoodDetails = [
//   {
//     id: 1,
//     name: "Spicy Mozzarella with Barbeque",
//     category: "Food / Noodle",
//     price: "$12",
//     available: true,
//     imgSrc: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=300&h=300&auto=format&fit=crop",
//     ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//     nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: 2,
//     name: "Burger Jumbo Special With Spicy",
//     category: "Food / Burger",
//     price: "$10",
//     available: true,
//     imgSrc: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=300&auto=format&fit=crop",
//     ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//     nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: 3,
//     name: "Pizza Piezza Special Nuggets",
//     category: "Food / Pizza",
//     price: "$15",
//     available: true,
//     imgSrc: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&h=300&auto=format&fit=crop",
//     ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//     nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: 4,
//     name: "Spicy Mozzarella with Barbeque",
//     category: "Food / Noodle",
//     price: "$12",
//     available: false,
//     imgSrc: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=300&h=300&auto=format&fit=crop",
//     ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//     nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//   },
//   {
//     id: 5,
//     name: "Sprite the Flavour with Avocado Juice",
//     category: "Drink / Juice",
//     price: "$5",
//     available: true,
//     imgSrc: "https://images.unsplash.com/photo-1600271886742-f049cd2d1259?q=80&w=300&h=300&auto=format&fit=crop",
//     ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//     nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
//   },
// ];

// // Dummy Reviews Data
// const dummyReviews = [
//   {
//     id: 1,
//     name: "Johnny Ahmed",
//     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//     rating: 5,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
//   {
//     id: 2,
//     name: "Maria Vania",
//     avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//     rating: 4,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
//   {
//     id: 3,
//     name: "Sarah Mueller",
//     avatar: "https://randomuser.me/api/portraits/women/3.jpg",
//     rating: 5,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
// ];

// // Dummy Revenue Data for Different Time Periods
// const revenueData = {
//   monthly: {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     data: [1200, 1500, 1300, 1800, 1600, 2200, 1900, 1700, 2000, 2100, 2300, 2500],
//   },
//   weekly: {
//     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     data: [450, 600, 500, 700],
//   },
//   daily: {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     data: [120, 150, 130, 180, 160, 220, 190],
//   },
// };

// // Currency Conversion Rates (relative to USD)
// const currencyRates = {
//   USD: 1,
//   PKR: 285,
//   EUR: 0.85,
//   GBP: 0.73,
// };

// export default function FoodDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const [food, setFood] = useState<any>(null);
//   const [timeFilter, setTimeFilter] = useState<string>("monthly");
//   const [currency, setCurrency] = useState<string>("USD");
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (id) {
//       // Simulate async data fetch with a delay
//       setLoading(true);
//       const timeout = setTimeout(() => {
//         const selectedFood = dummyFoodDetails.find((item) => item.id === parseInt(id));
//         setFood(selectedFood || null);
//         setLoading(false);
//       }, 1000); // Simulated 1-second delay
//       return () => clearTimeout(timeout);
//     }
//   }, [id]);

//   // Chart Data for Revenue
//   const getChartData = () => {
//     const selectedData = revenueData[timeFilter as keyof typeof revenueData];
//     const convertedData = selectedData.data.map((value) => value * currencyRates[currency as keyof typeof currencyRates]);
//     return {
//       labels: selectedData.labels,
//       datasets: [
//         {
//           label: "Revenue",
//           data: convertedData,
//           borderColor: "#60a5fa",
//           backgroundColor: "#60a5fa",
//           tension: 0.4,
//           fill: {
//             target: "origin",
//             above: "rgba(96, 165, 250, 0.2)",
//           },
//         },
//       ],
//     };
//   };

//   // Chart Options
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (context: any) => {
//             const value = context.parsed.y;
//             return `Revenue: ${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: {
//         grid: { borderDash: [5, 5] },
//         beginAtZero: true,
//         ticks: {
//           callback: (value: any) => `${value}`,
//         },
//       },
//     },
//   };

//   // Get the highlighted revenue value (highest value in the dataset)
//   const getHighlightedRevenue = () => {
//     const chartData = getChartData();
//     const maxRevenue = Math.max(...chartData.datasets[0].data);
//     return maxRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   // Handle invalid ID
//   if (!id || isNaN(parseInt(id))) {
//     return <p className="p-6 text-gray-600">Invalid food ID.</p>;
//   }

//   // Handle food not found
//   if (!loading && food === null) {
//     return <p className="p-6 text-gray-600">Food item not found.</p>;
//   }

//   // Show loading spinner
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => router.push("/food")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <ArrowLeft className="h-5 w-5" /> Back to Foods
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             🍽️ Foods
//           </h1>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
//           <Plus className="h-5 w-5" /> New Menu
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <input
//           type="text"
//           placeholder="Search here..."
//           className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Detail Menu Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Menus</h2>
//           <img
//             src={food.imgSrc}
//             alt={food.name}
//             className="w-full h-40 object-cover rounded-lg mb-4"
//             onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300")} // Fallback image
//           />
//           <p className="text-sm text-gray-500 mb-2">Category: {food.category}</p>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">{food.name}</h3>
//           <p className={`text-sm font-medium mb-4 ${food.available ? "text-green-500" : "text-red-500"}`}>
//             {food.available ? "Stock Available" : "Out of Stock"}
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
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h4>
//             <p className="text-gray-600">{food.ingredients}</p>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Info</h4>
//             <p className="text-gray-600">{food.nutrition}</p>
//           </div>
//         </div>

//         {/* Revenue Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setTimeFilter("monthly")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("weekly")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Weekly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("daily")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "daily" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
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

//       {/* Customer Reviews Section */}
//       <div className="mt-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {dummyReviews.map((review) => (
//             <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
//               <div className="flex items-center gap-3 mb-2">
//                 <img
//                   src={review.avatar}
//                   alt={review.name}
//                   className="w-10 h-10 rounded-full"
//                   onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")} // Fallback image
//                 />
//                 <div>
//                   <p className="font-semibold text-gray-800">{review.name}</p>
//                   <div className="flex gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Search, Plus, Edit, Star, ArrowLeft } from "lucide-react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";
// import { useFetchRestaurantItemById } from '../../api/RestaurantRelatedApi/useFetchRestaurantItemById';

// // Register Chart.js components
// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// // Dummy Reviews Data (to be replaced with real data in the future)
// const dummyReviews = [
//   {
//     id: 1,
//     name: "Johnny Ahmed",
//     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//     rating: 5,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
//   {
//     id: 2,
//     name: "Maria Vania",
//     avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//     rating: 4,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
//   {
//     id: 3,
//     name: "Sarah Mueller",
//     avatar: "https://randomuser.me/api/portraits/women/3.jpg",
//     rating: 5,
//     comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
//   },
// ];

// // Dummy Revenue Data for Different Time Periods (to be replaced with real data in the future)
// const revenueData = {
//   monthly: {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     data: [1200, 1500, 1300, 1800, 1600, 2200, 1900, 1700, 2000, 2100, 2300, 2500],
//   },
//   weekly: {
//     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     data: [450, 600, 500, 700],
//   },
//   daily: {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     data: [120, 150, 130, 180, 160, 220, 190],
//   },
// };

// // Currency Conversion Rates (relative to USD)
// const currencyRates = {
//   USD: 1,
//   PKR: 285,
//   EUR: 0.85,
//   GBP: 0.73,
// };

// export default function FoodDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const [timeFilter, setTimeFilter] = useState<string>("monthly");
//   const [currency, setCurrency] = useState<string>("USD");

//   const { data: food, isLoading, error } = useFetchRestaurantItemById(id);

//   const getChartData = () => {
//     const selectedData = revenueData[timeFilter as keyof typeof revenueData];
//     const convertedData = selectedData.data.map((value) => value * currencyRates[currency as keyof typeof currencyRates]);
//     return {
//       labels: selectedData.labels,
//       datasets: [
//         {
//           label: "Revenue",
//           data: convertedData,
//           borderColor: "#60a5fa",
//           backgroundColor: "#60a5fa",
//           tension: 0.4,
//           fill: {
//             target: "origin",
//             above: "rgba(96, 165, 250, 0.2)",
//           },
//         },
//       ],
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (context: any) => {
//             const value = context.parsed.y;
//             return `Revenue: ${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: {
//         grid: { borderDash: [5, 5] },
//         beginAtZero: true,
//         ticks: {
//           callback: (value: any) => `${value}`,
//         },
//       },
//     },
//   };

//   const getHighlightedRevenue = () => {
//     const chartData = getChartData();
//     const maxRevenue = Math.max(...chartData.datasets[0].data);
//     return maxRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             🍽️ Foods
//           </h1>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
//           <Plus className="h-5 w-5" /> New Menu
//         </button>
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
//           <img
//             src={food.imgSrc}
//             alt={food.name}
//             className="w-full h-40 object-cover rounded-lg mb-4"
//             onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300")}
//           />
//           <p className="text-sm text-gray-500 mb-2">Category: {food.category}</p>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">{food.name}</h3>
//           <p className={`text-sm font-medium mb-4 ${food.available ? "text-green-500" : "text-red-500"}`}>
//             {food.available ? "Stock Available" : "Out of Stock"}
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
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h4>
//             <p className="text-gray-600">{food.ingredients}</p>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Info</h4>
//             <p className="text-gray-600">{food.nutrition}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setTimeFilter("monthly")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("weekly")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
//               >
//                 Weekly
//               </button>
//               <button
//                 onClick={() => setTimeFilter("daily")}
//                 className={`px-3 py-1 rounded-full ${
//                   timeFilter === "daily" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                 } hover:bg-blue-600 hover:text-white transition duration-200`}
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
//           {dummyReviews.map((review) => (
//             <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
//               <div className="flex items-center gap-3 mb-2">
//                 <img
//                   src={review.avatar}
//                   alt={review.name}
//                   className="w-10 h-10 rounded-full"
//                   onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
//                 />
//                 <div>
//                   <p className="font-semibold text-gray-800">{review.name}</p>
//                   <div className="flex gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Plus, Edit, Star, ArrowLeft } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TooltipItem } from "chart.js";
import { useFetchRestaurantItemById } from '../../api/RestaurantRelatedApi/useFetchRestaurantItemById';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// Dummy Reviews Data (to be replaced with real data in the future)
const dummyReviews = [
  {
    id: 1,
    name: "Johnny Ahmed",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
  },
  {
    id: 2,
    name: "Maria Vania",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
  },
  {
    id: 3,
    name: "Sarah Mueller",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
  },
];

// Dummy Revenue Data for Different Time Periods (to be replaced with real data in the future)
const revenueData = {
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [1200, 1500, 1300, 1800, 1600, 2200, 1900, 1700, 2000, 2100, 2300, 2500],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [450, 600, 500, 700],
  },
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [120, 150, 130, 180, 160, 220, 190],
  },
};

// Currency Conversion Rates (relative to USD)
const currencyRates = {
  USD: 1,
  PKR: 285,
  EUR: 0.85,
  GBP: 0.73,
};

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [timeFilter, setTimeFilter] = useState<string>("monthly");
  const [currency, setCurrency] = useState<string>("USD");

  const { data: food, isLoading, error } = useFetchRestaurantItemById(id);

  const getChartData = () => {
    const selectedData = revenueData[timeFilter as keyof typeof revenueData];
    const convertedData = selectedData.data.map((value) => value * currencyRates[currency as keyof typeof currencyRates]);
    return {
      labels: selectedData.labels,
      datasets: [
        {
          label: "Revenue",
          data: convertedData,
          borderColor: "#60a5fa",
          backgroundColor: "#60a5fa",
          tension: 0.4,
          fill: {
            target: "origin",
            above: "rgba(96, 165, 250, 0.2)",
          },
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const value = context.parsed.y;
            return `Revenue: ${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { borderDash: [5, 5] },
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value}`,
        },
      },
    },
  };

  const getHighlightedRevenue = () => {
    const chartData = getChartData();
    const maxRevenue = Math.max(...chartData.datasets[0].data);
    return maxRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!id || isNaN(parseInt(id))) {
    return <p className="p-6 text-gray-600">Invalid food ID.</p>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-6 text-center text-red-500">Error loading food: {error.message}</div>;
  }

  if (!food) {
    return <p className="p-6 text-gray-600">Food item not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/food")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Foods
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🍽️ Foods
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
          <Plus className="h-5 w-5" /> New Menu
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Menus</h2>
          <Image
            src={food.imgSrc || "https://via.placeholder.com/300"}
            alt={food.name}
            width={300}
            height={160}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <p className="text-sm text-gray-500 mb-2">Category: {food.category}</p>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{food.name}</h3>
          <p className={`text-sm font-medium mb-4 ${food.available ? "text-green-500" : "text-red-500"}`}>
            {food.available ? "Stock Available" : "Out of Stock"}
          </p>
          <div className="flex gap-3 mb-6">
            <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
              Add Menu
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2">
              <Edit className="h-4 w-4" /> Edit Menu
            </button>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h4>
            <p className="text-gray-600">{food.ingredients}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Info</h4>
            <p className="text-gray-600">{food.nutrition}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeFilter("monthly")}
                className={`px-3 py-1 rounded-full ${
                  timeFilter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                } hover:bg-blue-600 hover:text-white transition duration-200`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter("weekly")}
                className={`px-3 py-1 rounded-full ${
                  timeFilter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                } hover:bg-blue-600 hover:text-white transition duration-200`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeFilter("daily")}
                className={`px-3 py-1 rounded-full ${
                  timeFilter === "daily" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                } hover:bg-blue-600 hover:text-white transition duration-200`}
              >
                Daily
              </button>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-1 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="USD">USD</option>
                <option value="PKR">PKR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {currency} {getHighlightedRevenue()}
            </div>
            <div className="h-64">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}