// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { Search, Plus, Edit, Star } from "lucide-react";
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

// export default function FoodDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const [food, setFood] = useState<any>(null);
//   const [timeFilter, setTimeFilter] = useState<string>("monthly");

//   useEffect(() => {
//     if (id) {
//       const selectedFood = dummyFoodDetails.find((item) => item.id === parseInt(id));
//       setFood(selectedFood);
//     }
//   }, [id]);

//   // Chart Data for Revenue
//   const chartData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
//     datasets: [
//       {
//         label: "Revenue",
//         data: [300, 400, 350, 600, 500, 872.556, 700, 650, 800],
//         borderColor: "#60a5fa",
//         backgroundColor: "#60a5fa",
//         tension: 0.4,
//         fill: {
//           target: "origin",
//           above: "rgba(96, 165, 250, 0.2)",
//         },
//       },
//     ],
//   };

//   // Chart Options
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { enabled: true },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: {
//         grid: { borderDash: [5, 5] },
//         beginAtZero: true,
//         ticks: {
//           callback: (value: any) => `${value}%`,
//         },
//       },
//     },
//   };

//   if (!food) return <p className="p-6 text-gray-600">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           🍽️ Foods
//         </h1>
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
//             </div>
//           </div>
//           <div className="relative">
//             <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
//               ${chartData.datasets[0].data[5].toLocaleString()}
//             </div>
//             <div className="h-64">
//               <Line data={chartData} options={chartOptions} />
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




"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, Plus, Edit, Star } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// Define FoodItem interface
interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: string;
  available: boolean;
  imgSrc: string;
  ingredients: string;
  nutrition: string;
}

// Dummy Food Details Data
const dummyFoodDetails: FoodItem[] = [
  {
    id: 1,
    name: "Spicy Mozzarella with Barbeque",
    category: "Food / Noodle",
    price: "$12",
    available: true,
    imgSrc: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=300&h=300&auto=format&fit=crop",
    ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
    nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "Burger Jumbo Special With Spicy",
    category: "Food / Burger",
    price: "$10",
    available: true,
    imgSrc: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=300&auto=format&fit=crop",
    ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
    nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    name: "Pizza Piezza Special Nuggets",
    category: "Food / Pizza",
    price: "$15",
    available: true,
    imgSrc: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&h=300&auto=format&fit=crop",
    ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
    nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    name: "Spicy Mozzarella with Barbeque",
    category: "Food / Noodle",
    price: "$12",
    available: false,
    imgSrc: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=300&h=300&auto=format&fit=crop",
    ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
    nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 5,
    name: "Sprite the Flavour with Avocado Juice",
    category: "Drink / Juice",
    price: "$5",
    available: true,
    imgSrc: "https://images.unsplash.com/photo-1600271886742-f049cd2d1259?q=80&w=300&h=300&auto=format&fit=crop",
    ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
    nutrition: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

// Dummy Reviews Data
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

export default function FoodDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [food, setFood] = useState<FoodItem | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>("monthly");

  useEffect(() => {
    if (id) {
      const selectedFood = dummyFoodDetails.find((item) => item.id === parseInt(id));
      setFood(selectedFood || null);
    }
  }, [id]);

  // Chart Data for Revenue
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Revenue",
        data: [300, 400, 350, 600, 500, 872.556, 700, 650, 800],
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

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { borderDash: [5, 5] },
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  if (!food) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🍽️ Foods
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
          <Plus className="h-5 w-5" /> New Menu
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Menu Section */}
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

        {/* Revenue Section */}
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
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              ${chartData.datasets[0].data[5].toLocaleString()}
            </div>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
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