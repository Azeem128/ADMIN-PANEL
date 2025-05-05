// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { Search, Plus, Eye, Edit, Trash } from "lucide-react";
// import { useFetchRestaurantItems } from '../api/RestaurantRelatedApi/useFetchRestaurantItems';
// import { FoodItem } from "../api/RestaurantRelatedApi/restaurantTypes";
// import RemoteImageRestaurantItems from "../components/RemoteImages/RemoteImageRestaurantItems";

// export default function FoodsPage() {
//   const { data: foods, isLoading, error } = useFetchRestaurantItems();
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("all");
//   const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 15;


//   if (!foods) {
//     <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//     </div>
//   }
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="min-h-screen bg-gray-100 p-6 text-center text-red-500">Error loading foods: {error.message}</div>;
//   }

//   console.log("Foods data:", foods); // Debugging line to check the fetched data

//   const filteredFoods = foods?.filter((food: FoodItem) => {
//     const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;
//     const matchesAvailability =
//       availabilityFilter === "all" ||
//       (availabilityFilter === "available" && food.available) ||
//       (availabilityFilter === "unavailable" && !food.available);
//     return matchesSearch && matchesCategory && matchesAvailability;
//   });

//   const totalItems = filteredFoods?.length || 0;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedFoods = filteredFoods?.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };



//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             🍽️ Foods
//           </h1>
//           <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
//             <Plus className="h-5 w-5" /> New Menu
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Search here..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//           >
//             <option value="all">All Categories</option>
//             <option value="Food / Noodle">Food / Noodle</option>
//             <option value="Food / Burger">Food / Burger</option>
//             <option value="Food / Pizza">Food / Pizza</option>
//             <option value="Drink / Juice">Drink / Juice</option>
//           </select>
//           <select
//             value={availabilityFilter}
//             onChange={(e) => setAvailabilityFilter(e.target.value)}
//             className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//           >
//             <option value="all">All Availability</option>
//             <option value="available">Available</option>
//             <option value="unavailable">Unavailable</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//           {paginatedFoods?.map((food: FoodItem) => (
//             <div
//               key={food.id}
//               className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 transform hover:scale-105"
//             >
//               {!food.imgSrc ? (
//                  <img
//                  src="https://i.ytimg.com/vi/xXg9mpwpAyg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCdmlEWWHq0Gzuad2Kg8Vg2-XI0KQ"
//                  alt="Preview"
//                  className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover"
//                />
               
//               ) : (
//                 <RemoteImageRestaurantItems path={food.imgSrc} alt="Item Image" fallback="https://i.ytimg.com/vi/xXg9mpwpAyg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCdmlEWWHq0Gzuad2Kg8Vg2-XI0KQ" />
//               )}
//               {/* <img
//                 src={food.imgSrc}
//                 alt={food.name}
//                 className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover"
//                 onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
//               /> */}
//               <h3 className="text-lg font-semibold mb-1 text-gray-800">{food.name}</h3>
//               <p className="text-gray-500 text-sm">{food.category}</p>
//               <p
//                 className={`text-sm font-medium mt-1 ${food.available ? "text-green-500" : "text-red-500"
//                   }`}
//               >
//                 {food.available ? "Available" : "Out of Stock"}
//               </p>
//               <div className="mt-3 flex justify-center gap-2">
//                 <Link href={`/food-detail/${food.id}`}>
//                   <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition duration-200">
//                     <Eye className="h-4 w-4" />
//                   </button>
//                 </Link>
//                 <button className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition duration-200">
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-200">
//                   <Trash className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-between items-center">
//           <p className="text-gray-600">
//             Showing {paginatedFoods?.length} from {totalItems} Menu
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
//             >
//               &lt;
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-3 py-1 rounded-full ${currentPage === page ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"
//                   }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Search, Plus, Eye, Edit, Trash } from "lucide-react";
import { useFetchRestaurantItems } from '../api/RestaurantRelatedApi/useFetchRestaurantItems';
import { FoodItem } from "../api/RestaurantRelatedApi/restaurantTypes";
import RemoteImageRestaurantItems from "../components/RemoteImages/RemoteImageRestaurantItems";

export default function FoodsPage() {
  const { data: foods, isLoading, error } = useFetchRestaurantItems();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  if (!foods) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-6 text-center text-red-500">Error loading foods: {error.message}</div>;
  }

  console.log("Foods data:", foods); // Debugging line to check the fetched data

  const filteredFoods = foods?.filter((food: FoodItem) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && food.available) ||
      (availabilityFilter === "unavailable" && !food.available);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const totalItems = filteredFoods?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFoods = filteredFoods?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🍽️ Foods
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
            <Plus className="h-5 w-5" /> New Menu
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          >
            <option value="all">All Categories</option>
            <option value="Food / Noodle">Food / Noodle</option>
            <option value="Food / Burger">Food / Burger</option>
            <option value="Food / Pizza">Food / Pizza</option>
            <option value="Drink / Juice">Drink / Juice</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {paginatedFoods?.map((food: FoodItem) => (
            <div
              key={food.id}
              className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              {!food.imgSrc ? (
                <Image
                  src="https://i.ytimg.com/vi/xXg9mpwpAyg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCdmlEWWHq0Gzuad2Kg8Vg2-XI0KQ"
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover"
                />
              ) : (
                <RemoteImageRestaurantItems path={food.imgSrc} alt="Item Image" fallback="https://i.ytimg.com/vi/xXg9mpwpAyg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCdmlEWWHq0Gzuad2Kg8Vg2-XI0KQ" />
              )}
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{food.name}</h3>
              <p className="text-gray-500 text-sm">{food.category}</p>
              <p
                className={`text-sm font-medium mt-1 ${food.available ? "text-green-500" : "text-red-500"}`}
              >
                {food.available ? "Available" : "Out of Stock"}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Link href={`/food-detail/${food.id}`}>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                </Link>
                <button className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-200">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {paginatedFoods?.length} from {totalItems} Menu
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-full ${currentPage === page ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}