"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";

interface RestaurantItem {
  itemid: string;
  restaurantid: string;
  itemname: string;
  itemdescription: string | null;
  baseprice: number;
  availablestatus: boolean;
  discount: number | null;
  rating: number;
  createdat: string;
  updatedat: string;
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
  business_type: string | null;
  business_category: string | null;
  cuisine: string | null;
  restaurantitems: RestaurantItem[];
}

const RestaurantDetail = () => {
  const { restaurantid } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      try {
        const { data: basicData, error: basicError } = await supabase
          .from("restaurants")
          .select("restaurantid, restaurantname, restaurant_location_latitude, restaurant_location_longitude")
          .eq("restaurantid", restaurantid)
          .single();

        if (basicError) throw basicError;
        if (!basicData) throw new Error("Restaurant not found");

        const { data, error } = await supabase
          .from("restaurants")
          .select(`
            restaurantid,
            restaurantownerid,
            restaurantname,
            restaurant_location_latitude,
            restaurant_location_longitude,
            starttiming,
            endtiming,
            rating,
            createdat,
            updatedat,
            restaurantimage,
            business_type,
            business_category,
            cuisine,
            restaurantitems (
              itemid,
              restaurantid,
              itemname,
              itemdescription,
              baseprice,
              availablestatus,
              discount,
              rating,
              createdat,
              updatedat,
              itemImages,
              category
            )
          `)
          .eq("restaurantid", restaurantid)
          .single();

        if (error) throw error;

        const { data: ownerData } = await supabase
          .from("restaurantowners")
          .select("name")
          .eq("restaurantownerid", data.restaurantownerid)
          .single();
        setOwnerName(ownerData?.name || "N/A");

        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurantid", restaurantid)
          .order("createdat", { ascending: false });
        setAllOrders(orderData || []);
        setFilteredOrders(orderData?.slice(0, 10) || []);
        setTotalOrders(orderData?.length || 0);
        setTotalRevenue(orderData?.reduce((sum, order) => sum + order.totalamount, 0) || 0);

        const normalizedData = {
          ...data,
          restaurantitems: data.restaurantitems.map((item) => ({
            ...item,
            itemImages: Array.isArray(item.itemImages) ? item.itemImages : item.itemImages ? [item.itemImages] : [],
          })),
        };
        setRestaurant(normalizedData as Restaurant);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantid) fetchRestaurantDetails();
  }, [restaurantid]);

  useEffect(() => {
    if (showRecent) {
      setFilteredOrders(allOrders.slice(0, 10));
    } else {
      setFilteredOrders(allOrders);
    }
  }, [showRecent, allOrders]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse bg-gray-200 rounded-full h-12 w-12"></div>
        </div>
      </Layout>
    );
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Restaurant not found</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{restaurant.restaurantname} Details</h1>
          <button
            onClick={() => router.push("/restaurant-details")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Restaurant Info</h2>
            <p className="text-gray-600">
              Location: ({restaurant.restaurant_location_latitude}, {restaurant.restaurant_location_longitude})
            </p>
            <p className="text-gray-600">Hours: {restaurant.starttiming || "N/A"} - {restaurant.endtiming || "N/A"}</p>
            <p className="text-gray-600">Owner: {ownerName}</p>
            <p className="text-gray-600">Rating: {restaurant.rating || "N/A"}</p>
            <p className="text-gray-500 mt-1">Created: {new Date(restaurant.createdat).toLocaleDateString()}</p>
            <p className="text-gray-500">Updated: {new Date(restaurant.updatedat).toLocaleDateString()}</p>
            {restaurant.business_type && <p className="text-gray-600">Business Type: {restaurant.business_type}</p>}
            {restaurant.business_category && <p className="text-gray-600">Business Category: {restaurant.business_category}</p>}
            {restaurant.cuisine && <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Statistics</h2>
            <p className="text-gray-600">Total Orders: {totalOrders}</p>
            <p className="text-gray-600">Total Revenue: ${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Menu Items</h2>
          {restaurant.restaurantitems && restaurant.restaurantitems.length > 0 ? (
            <div className="space-y-4">
              {restaurant.restaurantitems.map((item) => (
                <div key={item.itemid} className="p-3 bg-gray-50 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700">{item.itemname}</h3>
                  {item.itemdescription && <p className="text-gray-600 mt-1">Description: {item.itemdescription}</p>}
                  <p className="text-gray-600">Base Price: ${item.baseprice.toFixed(2)}</p>
                  {item.discount && <p className="text-gray-600">Discount: {item.discount}%</p>}
                  <p className="text-gray-600">
                    Price: ${(item.baseprice - (item.discount || 0) * item.baseprice / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-600">Availability: {item.availablestatus ? "Available" : "Unavailable"}</p>
                  {item.rating && <p className="text-gray-600">Rating: {item.rating}</p>}
                  <p className="text-gray-500 mt-1">Created: {new Date(item.createdat).toLocaleDateString()}</p>
                  <p className="text-gray-500">Updated: {new Date(item.updatedat).toLocaleDateString()}</p>
                  {item.itemImages && (
                    <p className="text-gray-600">Images: {Array.isArray(item.itemImages) ? item.itemImages.join(", ") : item.itemImages || "N/A"}</p>
                  )}
                  {item.category && <p className="text-gray-600">Category: {item.category}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No menu items available.</p>
          )}
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
            <button
              onClick={() => setShowRecent(!showRecent)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {showRecent ? "Show All" : "Show Recent"}
            </button>
          </div>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderid} className="p-3 bg-gray-50 rounded-md shadow-sm">
                  <p className="text-gray-700">Order ID: {order.orderid}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Payment: {order.paymentmethod}</p>
                  <p className="text-gray-600">Total: ${order.totalamount.toFixed(2)}</p>
                  <p className="text-gray-500 mt-1">Date: {new Date(order.createdat).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No orders available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetail;