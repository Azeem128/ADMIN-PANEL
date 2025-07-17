
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";
import RemoteImageCustomer from "../../components/RemoteImages/RemoteImageCustomer"; // Assume this exists
import RemoteImageRestaurantItems from "../../components/RemoteImages/RemoteImageRestaurantItems";

interface OrderItem {
  itemname: string;
  basePrice: number;
  discountAmount: number;
  discountPercent: number;
  image: string;
}

interface Order {
  orderid: string;
  customerid: string;
  restaurantid: string;
  status: string;
  totalamount: number;
  riderid: string;
  updatedat: string;
  cartid: string;
  ridername: string;
  restaurantname: string;
  restaurantLocation: string;
  riderLocation: string | null;
  items: OrderItem[];
  isExpanded: boolean;
}

interface Rider {
  riderid: string;
  name: string;
  profile_image: string | null;
}

interface Restaurant {
  restaurantid: string;
  restaurantname: string;
  restaurant_location_latitude: number;
  restaurant_location_longitude: number;
}

interface Customer {
  customerid: string;
  name: string;
  email: string;
  createdat: string;
  profile_image: string | null;
  orderHistory: Order[];
  riders: Rider[];
  restaurants: Restaurant[];
  ordercount: number;
  totalSpent: number;
  mostOrderedFoods?: { [key: string]: { name: string; price: number; image: string }[] };
}

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  useEffect(() => {
    async function fetchCustomer(): Promise<void> {
      if (!customerId || customerId === "undefined") {
        setError("Customer ID not provided");
        router.push("/customers");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("customerid, name, email, createdat, image")
          .eq("customerid", customerId)
          .single();

        if (customerError) throw customerError;

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(`
            orderid, customerid, restaurantid, status, totalamount, riderid, updatedat, cartid, locationid
          `)
          .eq("customerid", customerId);

        if (orderError) throw orderError;

        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select("riderid, name, profile_image");
        if (riderError) throw riderError;

        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("restaurantid, restaurantname, restaurant_location_latitude, restaurant_location_longitude");
        if (restaurantError) throw restaurantError;

        const { data: riderLocationData, error: riderLocationError } = await supabase
          .from("riderlocations")
          .select("locationid, riderid, rider_location_latitude, rider_location_longitude")
          .order("updatedat", { ascending: false });
        if (riderLocationError) throw riderLocationError;

        const ordersWithDetails = await Promise.all(orderData.map(async (order) => {
          const { data: cartItemsData, error: cartItemsError } = await supabase
            .from("cartitems")
            .select("itemid, quantity, subtotal")
            .eq("cartid", order.cartid);

          if (cartItemsError) return { ...order, ridername: "Not Assigned", restaurantname: "Unknown", items: [], riderLocation: null, isExpanded: false };

          const itemIds = cartItemsData.map(item => item.itemid);
          const { data: itemData, error: itemError } = await supabase
            .from("restaurantitems")
            .select("itemid, itemname, baseprice, discount, itemImages")
            .in("itemid", itemIds);

          if (itemError) return { ...order, ridername: "Not Assigned", restaurantname: "Unknown", items: [], riderLocation: null, isExpanded: false };

          const riderLocation = riderLocationData.find(loc => loc.riderid === order.riderid);
          return {
            ...order,
            ridername: riderData.find(r => r.riderid === order.riderid)?.name || "Not Assigned",
            restaurantname: restaurantData.find(r => r.restaurantid === order.restaurantid)?.restaurantname || "Unknown",
            restaurantLocation: restaurantData.find(r => r.restaurantid === order.restaurantid)
              ? `${restaurantData.find(r => r.restaurantid === order.restaurantid)?.restaurant_location_latitude}, ${restaurantData.find(r => r.restaurantid === order.restaurantid)?.restaurant_location_longitude}`
              : "Unknown",
            riderLocation: riderLocation
              ? `${riderLocation.rider_location_latitude}, ${riderLocation.rider_location_longitude}`
              : null,
            items: itemData.map(item => ({
              itemname: item.itemname,
              basePrice: item.baseprice,
              discountAmount: item.discount || 0,
              discountPercent: item.discount ? (item.discount / item.baseprice) * 100 : 0,
              image: item.itemImages ? item.itemImages.split(",")[0] || "/null-icon.png" : "/null-icon.png",
            })),
            isExpanded: false,
          };
        }));

        const ordercount = ordersWithDetails.length;
        const totalSpent = ordersWithDetails
          .filter(order => order.status === "Completed")
          .reduce((sum, order) => sum + order.totalamount, 0) || 0;

        const allItems = ordersWithDetails.flatMap(order => order.items);
        const itemCounts = allItems.reduce((acc, item) => {
          acc[item.itemname] = (acc[item.itemname] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        const mostOrderedFoods = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => {
            const item = allItems.find(i => i.itemname === name);
            return {
              name,
              price: item ? item.basePrice : 0,
              image: item ? item.image : "/null-icon.png",
            };
          });

        setCustomer({
          ...customerData,
          profile_image: customerData.image,
          orderHistory: ordersWithDetails,
          riders: riderData || [],
          restaurants: restaurantData || [],
          ordercount,
          totalSpent,
          mostOrderedFoods: { Monthly: mostOrderedFoods },
        });
      } catch (err: any) {
        console.error("Error fetching customer:", err.message || "Unknown error", err.details || {});
        setError("Failed to fetch customer data: " + (err.message || "Unknown error"));
      }
      setLoading(false);
    }

    fetchCustomer();
  }, [customerId, router]);

  const toggleOrderDetails = (orderId: string) => {
    setCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        orderHistory: prev.orderHistory.map(order =>
          order.orderid === orderId ? { ...order, isExpanded: !order.isExpanded } : order
        ),
      };
    });
  };

  const handleCancelOrder = (order: Order) => {
    alert(`Order #${order.orderid} has been canceled.`);
    setCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        orderHistory: prev.orderHistory.map(o =>
          o.orderid === order.orderid ? { ...o, status: "Canceled" } : o
        ),
      };
    });
  };

  const handleReorder = (order: Order) => {
    alert(`Reordering from ${order.restaurantname}: ${order.items.map(item => item.itemname).join(", ")}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !customer) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-lg">{error || "Customer not found"}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Customer Details</h1>
          <button
            onClick={() => router.push("/customers")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Customers
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <RemoteImageCustomer
              path={customer.profile_image || ""}
              fallback="/null-icon.png"
              alt={`Profile of ${customer.name}`}
              width={80}
              height={80}
              className="rounded-full mr-4 border-4 border-indigo-200"
            />
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">{customer.name}</h2>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-gray-600">Customer ID: {customer.customerid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Most Ordered Foods</h2>
          {customer.mostOrderedFoods?.Monthly?.length > 0 ? (
            customer.mostOrderedFoods.Monthly.map((food, index) => (
              <div
                key={`ordered-food-${index}`}
                className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RemoteImageRestaurantItems
                  path={food.image}
                  fallback="/null-icon.png"
                  alt={food.name}
                  width={128}
                  height={128}
                  className="rounded-lg mr-4 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{food.name}</p>
                </div>
                <p className="font-semibold text-indigo-600">${food.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No most ordered foods data.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-indigo-700">Total Orders:</span> {customer.ordercount}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-indigo-700">Total Spent (Completed):</span> ${customer.totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                  <th className="p-3 border border-gray-200">Order ID</th>
                  <th className="p-3 border border-gray-200">Date/Time</th>
                  <th className="p-3 border border-gray-200">Status</th>
                  <th className="p-3 border border-gray-200">Total Amount</th>
                  <th className="p-3 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customer.orderHistory.map((order) => (
                  <React.Fragment key={order.orderid}>
                    <tr
                      className="border border-gray-200 hover:bg-indigo-50 transition-colors"
                    >
                      <td className="p-3 border border-gray-200 text-xs">{order.orderid}</td>
                      <td className="p-3 border border-gray-200 text-xs">{new Date(order.updatedat).toLocaleString()}</td>
                      <td className="p-3 border border-gray-200 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-200 text-xs">${order.totalamount.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-xs">
                        <button
                          onClick={() => toggleOrderDetails(order.orderid)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs transition-colors"
                        >
                          {order.isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {order.isExpanded && (
                      <tr className="border border-gray-200 bg-gray-50">
                        <td colSpan={5} className="p-4">
                          <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold text-indigo-700 mb-2">Order Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-gray-600 mb-2">
                                  <span className="font-semibold text-indigo-700">Restaurant:</span> {order.restaurantname}
                                </p>
                                <p className="text-gray-600 mb-2">
                                  <span className="font-semibold text-indigo-700">Rider:</span> {order.ridername}
                                </p>
                                <p className="text-gray-600 mb-2">
                                  <span className="font-semibold text-indigo-700">Restaurant Location:</span> {order.restaurantLocation}
                                </p>
                                {order.riderLocation && (
                                  <p className="text-gray-600 mb-2">
                                    <span className="font-semibold text-indigo-700">Rider Location:</span> {order.riderLocation}
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="text-gray-600 mb-2">
                                  <span className="font-semibold text-indigo-700">Order Date:</span> {new Date(order.updatedat).toLocaleString()}
                                </p>
                                <p className="text-gray-600 mb-2">
                                  <span className="font-semibold text-indigo-700">Total Amount:</span> ${order.totalamount.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {order.items.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-md font-semibold text-indigo-600 mb-2">Items:</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-gray-200 rounded-lg">
                                    <thead>
                                      <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                                        <th className="p-3 border border-gray-200">Item Image</th>
                                        <th className="p-3 border border-gray-200">Item Name</th>
                                        <th className="p-3 border border-gray-200">Base Price</th>
                                        <th className="p-3 border border-gray-200">Discount Amount</th>
                                        <th className="p-3 border border-gray-200">Discount %</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, index) => (
                                        <tr
                                          key={`item-${index}`}
                                          className="border border-gray-200 hover:bg-indigo-100 transition-colors"
                                        >
                                          <td className="p-3 border border-gray-200 text-xs">
                                            <RemoteImageRestaurantItems
                                              path={item.image}
                                              fallback="/null-icon.png"
                                              alt={item.itemname}
                                              width={128}
                                              height={128}
                                              className="rounded-lg object-cover"
                                            />
                                          </td>
                                          <td className="p-3 border border-gray-200 text-xs">{item.itemname}</td>
                                          <td className="p-3 border border-gray-200 text-xs">${item.basePrice.toFixed(2)}</td>
                                          <td className="p-3 border border-gray-200 text-xs">${item.discountAmount.toFixed(2)}</td>
                                          <td className="p-3 border border-gray-200 text-xs">{item.discountPercent}%</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            <div className="flex space-x-3">
                              <button
                                onClick={() => toggleOrderDetails(order.orderid)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Close Details
                              </button>
                              {order.status === "Pending" && (
                                <button
                                  onClick={() => handleCancelOrder(order)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Reorder
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetail;