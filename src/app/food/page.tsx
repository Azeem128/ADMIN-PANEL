
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { Search, Eye, Edit, Trash } from "lucide-react";
// import { useFetchRestaurantItems } from "../api/RestaurantRelatedApi/useFetchRestaurantItems";
// import { RestaurantItem } from "../api/RestaurantRelatedApi/restaurantTypes";
// import RemoteImageRestaurantItems from "../components/RemoteImages/RemoteImageRestaurantItems";

// // Sidebar Component
// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <div
//       className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       } fixed`}
//     >
//       <div className="p-4 flex justify-between items-center">
//         <h2 className={`text-xl font-bold ${!isOpen && "hidden"}`}>PakEats</h2>
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="text-white focus:outline-none"
//         >
//           {isOpen ? "«" : "»"}
//         </button>
//       </div>
//       <ul className="mt-4">
//         <li className="p-2 hover:bg-gray-700">
//           <Link href="/dashboard">Dashboard</Link>
//         </li>
//         <li className="p-2 hover:bg-gray-700">
//           <Link href="/foods">Foods</Link>
//         </li>
//         <li className="p-2 hover:bg-gray-700">
//           <Link href="/orders">Orders</Link>
//         </li>
//         <li className="p-2 hover:bg-gray-700">
//           <Link href="/settings">Settings</Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// // Navbar Component
// const Navbar = () => (
//   <nav className="bg-green-600 p-4 text-white flex justify-between items-center fixed w-full top-0 z-10 ml-64">
//     <h1 className="text-xl font-bold">Restaurant Owner Panel</h1>
//     <div>
//       <span className="mr-4">Owner Name</span>
//       <button className="bg-white text-green-600 px-4 py-2 rounded">
//         Logout
//       </button>
//     </div>
//   </nav>
// );

// // Main Foods Page Component
// export default function FoodsPage() {
//   const { data: foods, isLoading, error } = useFetchRestaurantItems();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [availabilityFilter, setAvailabilityFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 text-center text-red-500">
//         Error loading foods: {error.message}
//       </div>
//     );
//   }

//   const filteredFoods = foods?.filter((food: RestaurantItem) => {
//     const matchesSearch =
//       food.itemname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       food.itemdescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       food.category.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       categoryFilter === "all" || food.category === categoryFilter;

//     const matchesAvailability =
//       availabilityFilter === "all" ||
//       (availabilityFilter === "available" && food.availablestatus) ||
//       (availabilityFilter === "unavailable" && !food.availablestatus);

//     return matchesSearch && matchesCategory && matchesAvailability;
//   });

//   const totalItems = filteredFoods?.length || 0;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedFoods = filteredFoods?.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="ml-64 flex-1">
//         <Navbar />
//         <div className="min-h-screen bg-gray-100 p-6 mt-16">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//               🍽️ Foods
//             </h1>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by name, description, or category..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//               />
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//             >
//               <option value="all">All Categories</option>
//               {[...new Set(foods?.map((food) => food.category))].map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={availabilityFilter}
//               onChange={(e) => setAvailabilityFilter(e.target.value)}
//               className="px-4 py-2 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
//             >
//               <option value="all">All Availability</option>
//               <option value="available">Available</option>
//               <option value="unavailable">Unavailable</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//             {paginatedFoods?.map((food: RestaurantItem) => (
//               <div
//                 key={food.itemid}
//                 className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 transform hover:scale-105"
//               >
//                 {food.itemImages && food.itemImages.length > 0 ? (
//                   <RemoteImageRestaurantItems
//                     path={food.itemImages[0]}
//                     alt={food.itemname}
//                     className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover"
//                     width={128}
//                     height={128}
//                   />
//                 ) : (
//                   <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//                     No Image
//                   </div>
//                 )}
//                 <h3 className="text-lg font-semibold mb-1 text-gray-800">
//                   {food.itemname}
//                 </h3>
//                 <p className="text-gray-500 text-sm">{food.category}</p>
//                 <p className="text-sm font-medium mt-1">
//                   {food.itemdescription
//                     ? food.itemdescription.substring(0, 50) +
//                       (food.itemdescription.length > 50 ? "..." : "")
//                     : ""}
//                 </p>
//                 <p
//                   className={`text-sm font-medium mt-1 ${
//                     food.availablestatus ? "text-green-500" : "text-red-500"
//                   }`}
//                 >
//                   {food.availablestatus ? "Available" : "Out of Stock"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Price: $
//                   {(
//                     food.baseprice -
//                     ((food.discount || 0) * food.baseprice) / 100
//                   ).toFixed(2)}
//                 </p>
//                 <div className="mt-3 flex justify-center gap-2">
//                   <Link href={`/food-detail/${food.itemid}`}>
//                     <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition duration-200">
//                       <Eye className="h-4 w-4" />
//                     </button>
//                   </Link>
//                   <Link href={`/food/edit/${food.itemid}`}>
//                     <button className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition duration-200">
//                       <Edit className="h-4 w-4" />
//                     </button>
//                   </Link>
//                   <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-200">
//                     <Trash className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 flex justify-between items-center">
//             <p className="text-gray-600">
//               Showing {paginatedFoods?.length} from {totalItems} Items
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
//               >
//                 {"<"}
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-full ${
//                     currentPage === page
//                       ? "bg-green-500 text-white"
//                       : "bg-gray-200 hover:bg-gray-300"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
//               >
//                 {">"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, Edit, Trash } from "lucide-react"; // Ensure all icons are imported
import { useFetchRestaurantItems } from "../api/RestaurantRelatedApi/useFetchRestaurantItems";
import { RestaurantItem } from "../api/RestaurantRelatedApi/restaurantTypes";
import RemoteImageRestaurantItems from "../components/RemoteImages/RemoteImageRestaurantItems";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../components/Layout"; // Use the provided Layout component

// Main Foods Page Component
export default function FoodsPage() {
  const { data: foods, isLoading, error } = useFetchRestaurantItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState<RestaurantItem | null>(null);
  const itemsPerPage = 15;

  const handleEditFood = (food: RestaurantItem) => {
    setCurrentFood(food);
    setIsEditModalOpen(true);
  };

  const handleUpdateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFood) return;

    const form = e.target as HTMLFormElement;
    const updatedData = {
      itemname: form.itemname.value,
      itemdescription: form.itemdescription.value || null,
      baseprice: parseFloat(form.baseprice.value) || 0,
      discount: parseFloat(form.discount.value) || 0,
      availablestatus: form.availablestatus.value === "true",
    };

    toast.info("Updating food item...");
    const { error } = await supabase
      .from("restaurantitems")
      .update(updatedData)
      .eq("itemid", currentFood.itemid);

    if (error) {
      toast.error("Failed to update food: " + error.message);
    } else {
      toast.success("Food item updated successfully!");
      setIsEditModalOpen(false);
      setCurrentFood(null);
      // Refresh data (temporary; replace with refetch if available)
      window.location.reload();
    }
  };

  const handleDeleteFood = async (itemid: string) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;

    toast.info("Deleting food item...");
    const { error } = await supabase.from("restaurantitems").delete().eq("itemid", itemid);

    if (error) {
      toast.error("Failed to delete food: " + error.message);
    } else {
      toast.success("Food item deleted successfully!");
      // Refresh data (temporary)
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-red-600">Error loading foods: {error.message}</p>
        </div>
      </Layout>
    );
  }

  const filteredFoods = foods?.filter((food: RestaurantItem) => {
    const itemName = food.itemname?.toLowerCase() || "";
    const itemDescription = food.itemdescription?.toLowerCase() || "";
    const category = food.category?.toLowerCase() || "";
    const matchesSearch =
      itemName.includes(searchQuery.toLowerCase()) ||
      itemDescription.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && food.availablestatus) ||
      (availabilityFilter === "unavailable" && !food.availablestatus);

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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            🍽️ Foods
          </h1>
        </div>

        {isEditModalOpen && currentFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-80">
              <h2 className="text-lg font-bold mb-3 text-green-900">Edit Food Item</h2>
              <form onSubmit={handleUpdateFood}>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="itemname"
                    defaultValue={currentFood.itemname}
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="itemdescription"
                    defaultValue={currentFood.itemdescription || ""}
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="baseprice"
                    defaultValue={currentFood.baseprice}
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    defaultValue={currentFood.discount || 0}
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Status</label>
                  <select
                    name="availablestatus"
                    defaultValue={currentFood.availablestatus.toString()}
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
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
            {[...new Set(foods?.map((food) => food.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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
          {paginatedFoods?.map((food: RestaurantItem) => (
            <div
              key={food.itemid}
              className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              {food.itemImages && food.itemImages.length > 0 ? (
                <RemoteImageRestaurantItems
                  path={food.itemImages[0]}
                  alt={food.itemname}
                  className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{food.itemname}</h3>
              <p className="text-gray-500 text-sm">{food.category}</p>
              <p className="text-sm font-medium mt-1">
                {food.itemdescription
                  ? food.itemdescription.substring(0, 50) +
                    (food.itemdescription.length > 50 ? "..." : "")
                  : ""}
              </p>
              <p
                className={`text-sm font-medium mt-1 ${
                  food.availablestatus ? "text-green-500" : "text-red-500"
                }`}
              >
                {food.availablestatus ? "Available" : "Out of Stock"}
              </p>
              <p className="text-sm text-gray-600">
                Price: $
                {(
                  food.baseprice - ((food.discount || 0) * food.baseprice) / 100
                ).toFixed(2)}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Link href={`/food-detail/${food.itemid}`}>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={() => handleEditFood(food)}
                  className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition duration-200"
                >
                  <Edit className="h-4 w-4" /> {/* Now properly defined */}
                </button>
                <button
                  onClick={() => handleDeleteFood(food.itemid)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-200"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {paginatedFoods?.length} from {totalItems} Items
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-full ${
                  currentPage === page
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}