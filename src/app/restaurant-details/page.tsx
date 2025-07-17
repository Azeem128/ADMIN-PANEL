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
  itemImages: string[] | string | null;
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
  restaurant_location_latitude: number;
  restaurant_location_longitude: number;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantimage: string | null;
  business_type: string;
  business_category: string;
  cuisine: string;
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
      const { restaurants, error: fetchError } = await fetchRestaurants(page, restaurantsPerPage);
      if (fetchError) throw fetchError;
      setRestaurants(restaurants || []);
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
    }
  }, [data]);

  const subscription = supabase
    .channel("restaurants-channel")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "restaurants" }, (payload) => {
      const newRestaurant = payload.new as Restaurant;
      setRestaurants((prev) => [{ ...newRestaurant, restaurantitems: [] }, ...prev]);
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "restaurants" }, (payload) => {
      const updatedRestaurant = payload.new as Restaurant;
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.restaurantid === updatedRestaurant.restaurantid
            ? { ...updatedRestaurant, restaurantitems: restaurant.restaurantitems }
            : restaurant
        )
      );
    })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "restaurants" }, (payload) => {
      const deletedRestaurantId = payload.old.restaurantid;
      setRestaurants((prev) => prev.filter((restaurant) => restaurant.restaurantid !== deletedRestaurantId));
    })
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
      restaurant_location_latitude: parseFloat(form.restaurant_location_latitude.value) || currentRestaurant.restaurant_location_latitude,
      restaurant_location_longitude: parseFloat(form.restaurant_location_longitude.value) || currentRestaurant.restaurant_location_longitude,
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
          <div className="animate-pulse bg-gray-200 rounded-full h-12 w-12"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error?.message}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No restaurants available.</p>
            <button
              onClick={() => fetchRestaurantsLocal(1)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.restaurantid} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">{restaurant.restaurantname}</h2>
                  <p className="text-gray-500 mt-1">
                    Location: ({restaurant.restaurant_location_latitude}, {restaurant.restaurant_location_longitude})
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(restaurant.restaurantid)}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEditRestaurant(restaurant)}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    disabled={loadingAction}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.restaurantid)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    disabled={loadingAction}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={filteredRestaurants.length < restaurantsPerPage}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${filteredRestaurants.length < restaurantsPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition`}
          >
            Next
          </button>
        </div>

        {isEditModalOpen && currentRestaurant && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Restaurant</h2>
              <form onSubmit={handleUpdateRestaurant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="restaurantname"
                    defaultValue={currentRestaurant.restaurantname}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    name="restaurant_location_latitude"
                    defaultValue={currentRestaurant.restaurant_location_latitude}
                    step="0.000001"
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    name="restaurant_location_longitude"
                    defaultValue={currentRestaurant.restaurant_location_longitude}
                    step="0.000001"
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    name="starttiming"
                    defaultValue={currentRestaurant.starttiming || ""}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    name="endtiming"
                    defaultValue={currentRestaurant.endtiming || ""}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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