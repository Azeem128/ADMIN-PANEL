// "use client";

// import { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/supabaseClient";
// import { useReadRestaurants } from "../api/RestaurantRelatedApi/useRestaurants";
// import { addRestaurant, updateRestaurant, deleteRestaurant } from "../api/RestaurantRelatedApi/restaurant";
// import Layout from "../components/Layout";

// // Interfaces aligned with Supabase schema
// interface RestaurantItem {
//   itemid: string;
//   restaurantid: string;
//   itemname: string;
//   itemdescription: string | null;
//   baseprice: number;
//   discount: number | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
// }

// interface Restaurant {
//   restaurantid: string;
//   restaurantname: string;
//   restaurantlocation: string;
//   starttiming: string | null;
//   endtiming: string | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   restaurantitems: RestaurantItem[];
// }

// const RestaurantDetails = () => {
//   const { data, isLoading, isError, error } = useReadRestaurants();
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemPage, setItemPage] = useState<{ [key: string]: number }>({});
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isEditRatingModalOpen, setIsEditRatingModalOpen] = useState(false);
//   const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
//   const [loadingAction, setLoadingAction] = useState(false);
//   const restaurantsPerPage = 10;
//   const itemsPerPage = 6;

//   // Fetch restaurants with server-side pagination
//   const fetchRestaurants = async (page: number) => {
//     setLoadingAction(true);
//     try {
//       const { data: restaurantsData, error: fetchError } = await supabase
//         .from("restaurants")
//         .select(`
//           restaurantid,
//           restaurantname,
//           restaurantlocation,
//           starttiming,
//           endtiming,
//           rating,
//           createdat,
//           updatedat,
//           restaurantitems (
//             itemid,
//             restaurantid,
//             itemname,
//             itemdescription,
//             baseprice,
//             discount,
//             rating,
//             createdat,
//             updatedat
//           )
//         `)
//         .range((page - 1) * restaurantsPerPage, page * restaurantsPerPage - 1)
//         .order("createdat", { ascending: false });

//       console.log("Fetched restaurants:", restaurantsData); // Debug log

//       if (fetchError) throw fetchError;

//       if (restaurantsData) {
//         setRestaurants(restaurantsData as Restaurant[]);
//       } else {
//         setRestaurants([]);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast.error("Failed to fetch restaurants: " + (err as Error)?.message || "Unknown error");
//       setRestaurants([]);
//     } finally {
//       setLoadingAction(false);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants(currentPage); // Ensure initial fetch on mount
//   }, [currentPage]);

//   useEffect(() => {
//     if (data) {
//       setRestaurants(data as Restaurant[]);
//       console.log("Data from useReadRestaurants:", data); // Debug log
//     }
//   }, [data]);

//   const subscription = supabase
//     .channel("restaurants-channel")
//     .on(
//       "postgres_changes",
//       { event: "INSERT", schema: "public", table: "restaurants" },
//       (payload) => {
//         const newRestaurant = payload.new as Restaurant;
//         setRestaurants((prev) => [
//           {
//             ...newRestaurant,
//             restaurantitems: [],
//           },
//           ...prev,
//         ]);
//         console.log("New restaurant added:", newRestaurant); // Debug log
//       }
//     )
//     .on(
//       "postgres_changes",
//       { event: "UPDATE", schema: "public", table: "restaurants" },
//       (payload) => {
//         const updatedRestaurant = payload.new as Restaurant;
//         setRestaurants((prev) =>
//           prev.map((restaurant) =>
//             restaurant.restaurantid === updatedRestaurant.restaurantid
//               ? {
//                   ...updatedRestaurant,
//                   restaurantitems: restaurant.restaurantitems,
//                 }
//               : restaurant
//           )
//         );
//         console.log("Restaurant updated:", updatedRestaurant); // Debug log
//       }
//     )
//     .on(
//       "postgres_changes",
//       { event: "DELETE", schema: "public", table: "restaurants" },
//       (payload) => {
//         const deletedRestaurantId = payload.old.restaurantid;
//         setRestaurants((prev) => prev.filter((restaurant) => restaurant.restaurantid !== deletedRestaurantId));
//         console.log("Restaurant deleted:", deletedRestaurantId); // Debug log
//       }
//     )
//     .subscribe();

//   useEffect(() => {
//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [subscription]);

//   const filteredRestaurants = restaurants.filter((restaurant) =>
//     restaurant.restaurantname.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     setExpandedRestaurant(null);
//   };

//   const toggleFoodItems = (restaurantId: string) => {
//     setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
//     if (expandedRestaurant !== restaurantId) {
//       setItemPage((prev) => ({ ...prev, [restaurantId]: 1 }));
//     }
//   };

//   const handleItemPageChange = (restaurantId: string, page: number) => {
//     setItemPage((prev) => ({ ...prev, [restaurantId]: page }));
//   };

//   const handleAddRestaurant = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingAction(true);
//     toast.info("Adding restaurant...");

//     const form = e.target as HTMLFormElement;
//     const restaurantData = {
//       restaurantname: form.restaurantname.value,
//       restaurantlocation: form.restaurantlocation.value,
//       starttiming: form.starttiming.value || null,
//       endtiming: form.endtiming.value || null,
//     };

//     try {
//       const { data: newRestaurant, error } = await addRestaurant(restaurantData);

//       if (error) {
//         throw error;
//       }

//       if (newRestaurant) {
//         toast.success("Restaurant added successfully!");
//         setIsAddModalOpen(false);
//         form.reset();
//         fetchRestaurants(currentPage); // Refresh data after adding
//       } else {
//         throw new Error("No data returned from addRestaurant");
//       }
//     } catch (err) {
//       console.error("Add restaurant error:", err);
//       toast.error("Failed to add restaurant: " + (err as Error)?.message || "Unknown error");
//     } finally {
//       setLoadingAction(false);
//     }
//   };

//   const handleEditRestaurant = (restaurant: Restaurant) => {
//     setCurrentRestaurant(restaurant);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateRestaurant = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentRestaurant) return;

//     setLoadingAction(true);
//     toast.info("Updating restaurant...");

//     const form = e.target as HTMLFormElement;
//     const restaurantData = {
//       restaurantname: form.restaurantname.value,
//       restaurantlocation: form.restaurantlocation.value,
//       starttiming: form.starttiming.value || null,
//       endtiming: form.endtiming.value || null,
//     };

//     try {
//       const { data: updatedRestaurant, error } = await updateRestaurant(currentRestaurant.restaurantid, restaurantData);

//       if (error) {
//         throw error;
//       }

//       if (updatedRestaurant) {
//         toast.success("Restaurant updated successfully!");
//         setIsEditModalOpen(false);
//         setCurrentRestaurant(null);
//         fetchRestaurants(currentPage); // Refresh data after updating
//       } else {
//         throw new Error("No data returned from updateRestaurant");
//       }
//     } catch (err) {
//       console.error("Update restaurant error:", err);
//       toast.error("Failed to update restaurant: " + (err as Error)?.message || "Unknown error");
//     } finally {
//       setLoadingAction(false);
//     }
//   };

//   const handleEditRating = (restaurant: Restaurant) => {
//     setCurrentRestaurant(restaurant);
//     setIsEditRatingModalOpen(true);
//   };

//   const handleUpdateRating = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentRestaurant) return;

//     setLoadingAction(true);
//     toast.info("Updating rating...");

//     const form = e.target as HTMLFormElement;
//     const newRating = parseFloat(form.rating.value);

//     try {
//       const { data: updatedRestaurant, error } = await updateRestaurant(currentRestaurant.restaurantid, {
//         rating: newRating,
//       });

//       if (error) {
//         throw error;
//       }

//       if (updatedRestaurant) {
//         toast.success("Rating updated successfully!");
//         setRestaurants((prev) =>
//           prev.map((restaurant) =>
//             restaurant.restaurantid === currentRestaurant.restaurantid
//               ? { ...restaurant, rating: newRating }
//               : restaurant
//           )
//         );
//         setIsEditRatingModalOpen(false);
//         setCurrentRestaurant(null);
//       } else {
//         throw new Error("No data returned from updateRating");
//       }
//     } catch (err) {
//       console.error("Update rating error:", err);
//       toast.error("Failed to update rating: " + (err as Error)?.message || "Unknown error");
//     } finally {
//       setLoadingAction(false);
//     }
//   };

//   const handleDeleteRestaurant = async (restaurantId: string) => {
//     if (!confirm("Are you sure you want to delete this restaurant?")) return;

//     setLoadingAction(true);
//     toast.info("Deleting restaurant...");

//     try {
//       const { error } = await deleteRestaurant(restaurantId);

//       if (error) {
//         throw error;
//       }

//       toast.success("Restaurant deleted successfully!");
//       setExpandedRestaurant(null);
//       fetchRestaurants(currentPage); // Refresh data after deleting
//     } catch (err) {
//       console.error("Delete restaurant error:", err);
//       toast.error("Failed to delete restaurant: " + (err as Error)?.message || "Unknown error");
//     } finally {
//       setLoadingAction(false);
//     }
//   };

//   if (isLoading || loadingAction) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">Loading restaurants...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-red-600">Error: {error?.message}</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (restaurants.length === 0) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">No restaurants available. <button onClick={() => fetchRestaurants(1)} className="text-emerald-600 underline">Retry</button></p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-lime-50 p-6">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-extrabold text-emerald-900 drop-shadow-md">Restaurant Details</h1>
//           </div>
//           <div className="flex items-center space-x-6">
//             <div className="relative w-72">
//               <input
//                 type="text"
//                 placeholder="Search restaurants..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white shadow-sm"
//               />
//               <svg
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//             </div>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
//               disabled={loadingAction}
//             >
//               <FaPlus className="text-lg" /> <span className="font-semibold">Add Restaurant</span>
//             </button>
//           </div>
//         </div>

//         {isAddModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
//               <h2 className="text-2xl font-bold mb-6 text-emerald-900">Add Restaurant</h2>
//               <form onSubmit={handleAddRestaurant}>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="restaurantname"
//                     required
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Location</label>
//                   <input
//                     type="text"
//                     name="restaurantlocation"
//                     required
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Start Time</label>
//                   <input
//                     type="time"
//                     name="starttiming"
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">End Time</label>
//                   <input
//                     type="time"
//                     name="endtiming"
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsAddModalOpen(false)}
//                     className="p-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Adding..." : "Add"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {isEditModalOpen && currentRestaurant && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
//               <h2 className="text-2xl font-bold mb-6 text-emerald-900">Edit Restaurant</h2>
//               <form onSubmit={handleUpdateRestaurant}>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="restaurantname"
//                     defaultValue={currentRestaurant.restaurantname}
//                     required
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Location</label>
//                   <input
//                     type="text"
//                     name="restaurantlocation"
//                     defaultValue={currentRestaurant.restaurantlocation}
//                     required
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Start Time</label>
//                   <input
//                     type="time"
//                     name="starttiming"
//                     defaultValue={currentRestaurant.starttiming || ""}
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">End Time</label>
//                   <input
//                     type="time"
//                     name="endtiming"
//                     defaultValue={currentRestaurant.endtiming || ""}
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditModalOpen(false)}
//                     className="p-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Updating..." : "Update"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {isEditRatingModalOpen && currentRestaurant && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">
//               <h2 className="text-2xl font-bold mb-6 text-emerald-900">Edit Rating for {currentRestaurant.restaurantname}</h2>
//               <form onSubmit={handleUpdateRating}>
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
//                   <input
//                     type="number"
//                     name="rating"
//                     step="0.1"
//                     min="0"
//                     max="5"
//                     defaultValue={currentRestaurant.rating}
//                     required
//                     className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditRatingModalOpen(false)}
//                     className="p-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Updating..." : "Update Rating"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className="space-y-8">
//           {filteredRestaurants.map((restaurant) => {
//             const currentItemPage = itemPage[restaurant.restaurantid] || 1;
//             const indexOfLastItem = currentItemPage * itemsPerPage;
//             const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//             const currentItems = restaurant.restaurantitems.slice(indexOfFirstItem, indexOfLastItem);
//             const totalItemPages = Math.ceil(restaurant.restaurantitems.length / itemsPerPage);

//             return (
//               <div
//                 key={restaurant.restaurantid}
//                 className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
//               >
//                 <div
//                   className="flex items-center p-6 cursor-pointer bg-gradient-to-r from-emerald-100 to-lime-100 hover:from-emerald-200 hover:to-lime-200 transition-all duration-300"
//                   onClick={() => toggleFoodItems(restaurant.restaurantid)}
//                 >
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-extrabold text-emerald-900">{restaurant.restaurantname}</h2>
//                     <p className="text-md text-gray-700 mt-1">Location: {restaurant.restaurantlocation}</p>
//                     <p className="text-md text-gray-700">
//                       Hours: {restaurant.starttiming || "N/A"} - {restaurant.endtiming || "N/A"}
//                     </p>
//                     <div className="flex items-center mt-1">
//                       <p className="text-md text-gray-700">Rating: {restaurant.rating || "N/A"}</p>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEditRating(restaurant);
//                         }}
//                         className="ml-3 p-1 text-emerald-600 hover:text-emerald-800 transition-all duration-300"
//                         disabled={loadingAction}
//                       >
//                         <FaStar className="text-lg" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleEditRestaurant(restaurant);
//                       }}
//                       className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
//                       disabled={loadingAction}
//                     >
//                       <FaEdit className="text-lg" /> <span className="font-semibold">Edit</span>
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteRestaurant(restaurant.restaurantid);
//                       }}
//                       className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
//                       disabled={loadingAction}
//                     >
//                       <FaTrash className="text-lg" /> <span className="font-semibold">Delete</span>
//                     </button>
//                     <div className="flex items-center">
//                       {expandedRestaurant === restaurant.restaurantid ? (
//                         <FaChevronUp className="text-emerald-600 text-xl" />
//                       ) : (
//                         <FaChevronDown className="text-emerald-600 text-xl" />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {expandedRestaurant === restaurant.restaurantid && (
//                   <div className="p-6 bg-gray-50 animate-fade-in">
//                     <h3 className="text-xl font-bold text-emerald-900 mb-6">Menu Items</h3>
//                     {restaurant.restaurantitems.length > 0 ? (
//                       <>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                           {currentItems.map((item) => (
//                             <div
//                               key={item.itemid}
//                               className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
//                             >
//                               <h4 className="text-lg font-semibold text-emerald-800">{item.itemname}</h4>
//                               <p className="text-sm text-gray-600 mt-2">{item.itemdescription || "No description"}</p>
//                               <p className="text-md text-green-600 mt-2">Price: ${item.baseprice.toFixed(2)}</p>
//                               {item.discount !== null && (
//                                 <p className="text-md text-red-600 mt-1">Discount: {item.discount}%</p>
//                               )}
//                               <p className="text-sm text-gray-600 mt-1">Rating: {item.rating || "N/A"}</p>
//                               <p className="text-sm text-gray-500 mt-1">
//                                 Created: {new Date(item.createdat).toLocaleDateString()}
//                               </p>
//                               <p className="text-sm text-gray-500 mt-1">
//                                 Updated: {new Date(item.updatedat).toLocaleDateString()}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                         {totalItemPages > 1 && (
//                           <div className="flex justify-center mt-6 space-x-2">
//                             {Array.from({ length: totalItemPages }, (_, index) => (
//                               <button
//                                 key={index + 1}
//                                 onClick={() => handleItemPageChange(restaurant.restaurantid, index + 1)}
//                                 className={`px-4 py-2 rounded-lg ${
//                                   currentItemPage === index + 1
//                                     ? "bg-emerald-600 text-white"
//                                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                 } transition-all duration-300`}
//                               >
//                                 {index + 1}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <p className="text-gray-600 text-md">No items available for this restaurant.</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex justify-center mt-8 space-x-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-6 py-2 rounded-lg ${
//               currentPage === 1
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-emerald-600 text-white hover:bg-emerald-700"
//             } transition-all duration-300 shadow-md`}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={filteredRestaurants.length < restaurantsPerPage}
//             className={`px-6 py-2 rounded-lg ${
//               filteredRestaurants.length < restaurantsPerPage
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-emerald-600 text-white hover:bg-emerald-700"
//             } transition-all duration-300 shadow-md`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default RestaurantDetails;




"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { useReadRestaurants } from "../api/RestaurantRelatedApi/useRestaurants";
import { updateRestaurant, deleteRestaurant, fetchRestaurants } from "../api/RestaurantRelatedApi/restaurant";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";

interface RestaurantItem {
  itemid: string;
  restaurantid: string;
  itemname: string;
  itemdescription: string | null;
  baseprice: number;
  discount: number | null;
  rating: number;
  createdat: string;
  updatedat: string;
  availablestatus: boolean;
  itemImages: string[];
  category: string;
}

interface Order {
  orderid: string;
  cartid: string;
  customerid: string;
  restaurantid: string;
  status: string;
  paymentmethod: string;
  totalamount: number;
  createdat: string;
  updatedat: string;
  riderid: string | null;
}

interface Restaurant {
  restaurantid: string;
  restaurantownerid: string;
  restaurantname: string;
  restaurantlocation: string;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantImage: string | null;
  restaurantitems: RestaurantItem[];
}

const RestaurantDetails = () => {
  const { data, isLoading, isError, error } = useReadRestaurants();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const restaurantsPerPage = 10;
  const router = useRouter();

  const fetchRestaurantsLocal = async (page: number) => {
    setLoadingAction(true);
    try {
      const { restaurants } = await fetchRestaurants(page, restaurantsPerPage);
      setRestaurants(restaurants);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch restaurants: " + (err as Error)?.message || "Unknown error");
      setRestaurants([]);
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    fetchRestaurantsLocal(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setRestaurants(data);
      console.log("Data from useReadRestaurants:", data);
    }
  }, [data]);

  const subscription = supabase
    .channel("restaurants-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "restaurants" },
      (payload) => {
        const newRestaurant = payload.new as Restaurant;
        setRestaurants((prev) => [{ ...newRestaurant, restaurantitems: [] }, ...prev]);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "restaurants" },
      (payload) => {
        const updatedRestaurant = payload.new as Restaurant;
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant.restaurantid === updatedRestaurant.restaurantid
              ? { ...updatedRestaurant, restaurantitems: restaurant.restaurantitems }
              : restaurant
          )
        );
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "restaurants" },
      (payload) => {
        const deletedRestaurantId = payload.old.restaurantid;
        setRestaurants((prev) => prev.filter((restaurant) => restaurant.restaurantid !== deletedRestaurantId));
      }
    )
    .subscribe();

  useEffect(() => {
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [subscription]);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.restaurantname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRestaurant) return;

    setLoadingAction(true);
    toast.info("Updating restaurant...");

    const form = e.target as HTMLFormElement;
    const restaurantData = {
      restaurantname: form.restaurantname.value,
      restaurantlocation: form.restaurantlocation.value,
      starttiming: form.starttiming.value || null,
      endtiming: form.endtiming.value || null,
    };

    try {
      const updatedRestaurant = await updateRestaurant(currentRestaurant.restaurantid, restaurantData);
      if (updatedRestaurant) {
        toast.success("Restaurant updated successfully!");
        setIsEditModalOpen(false);
        setCurrentRestaurant(null);
        fetchRestaurantsLocal(currentPage);
      } else {
        throw new Error("No data returned from updateRestaurant");
      }
    } catch (err) {
      console.error("Update restaurant error:", err);
      toast.error("Failed to update restaurant: " + (err as Error)?.message || "Unknown error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    setLoadingAction(true);
    toast.info("Deleting restaurant...");

    try {
      await deleteRestaurant(restaurantId);
      toast.success("Restaurant deleted successfully!");
      fetchRestaurantsLocal(currentPage);
    } catch (err) {
      console.error("Delete restaurant error:", err);
      toast.error("Failed to delete restaurant: " + (err as Error)?.message || "Unknown error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleViewDetails = (restaurantId: string) => {
    router.push(`/restaurant-details_f/${restaurantId}`);
  };

  if (isLoading || loadingAction) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-red-600">Error: {error?.message}</p>
        </div>
      </Layout>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">No restaurants available. <button onClick={() => fetchRestaurantsLocal(1)} className="text-blue-600 underline">Retry</button></p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              className="absolute right-2 top-2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.restaurantid} className="p-3 bg-white border border-gray-200 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">{restaurant.restaurantname}</h2>
                  <p className="text-sm text-gray-600">Location: {restaurant.restaurantlocation}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRestaurant(restaurant)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loadingAction}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.restaurantid)}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={loadingAction}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleViewDetails(restaurant.restaurantid)}
                    className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={filteredRestaurants.length < restaurantsPerPage}
            className={`px-3 py-1 rounded ${filteredRestaurants.length < restaurantsPerPage ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>

        {isEditModalOpen && currentRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-80">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Edit Restaurant</h2>
              <form onSubmit={handleUpdateRestaurant}>
                <div className="mb-2">
                  <label className="block text-sm text-gray-700">Name</label>
                  <input
                    type="text"
                    name="restaurantname"
                    defaultValue={currentRestaurant.restaurantname}
                    required
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-700">Location</label>
                  <input
                    type="text"
                    name="restaurantlocation"
                    defaultValue={currentRestaurant.restaurantlocation}
                    required
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-700">Start Time</label>
                  <input
                    type="time"
                    name="starttiming"
                    defaultValue={currentRestaurant.starttiming || ""}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm text-gray-700">End Time</label>
                  <input
                    type="time"
                    name="endtiming"
                    defaultValue={currentRestaurant.endtiming || ""}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantDetails;