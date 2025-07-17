"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer";

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
}

const OrderDetail: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderid as string;

  useEffect(() => {
    console.log("Received orderId:", orderId); // Debugging log
    async function fetchOrder(): Promise<void> {
      if (!orderId || orderId === "undefined") {
        setError("Order ID not provided");
        router.push("/ordersList"); // Redirect to orders list
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(`
            orderid, customerid, restaurantid, status, totalamount, riderid, updatedat, cartid, locationid
          `)
          .eq("orderid", orderId)
          .single();

        if (orderError) throw orderError;

        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select("riderid, name")
          .eq("riderid", orderData.riderid)
          .single();
        if (riderError) throw riderError;

        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("restaurantid, restaurantname, restaurant_location_latitude, restaurant_location_longitude")
          .eq("restaurantid", orderData.restaurantid)
          .single();
        if (restaurantError) throw restaurantError;

        const { data: riderLocationData, error: riderLocationError } = await supabase
          .from("riderlocations")
          .select("riderid, rider_location_latitude, rider_location_longitude")
          .eq("riderid", orderData.riderid)
          .order("updatedat", { ascending: false })
          .limit(1);
        if (riderLocationError) throw riderLocationError;

        const { data: cartItemsData, error: cartItemsError } = await supabase
          .from("cartitems")
          .select("itemid, quantity, subtotal")
          .eq("cartid", orderData.cartid);

        if (cartItemsError) throw cartItemsError;

        const itemIds = cartItemsData.map(item => item.itemid);
        const { data: itemData, error: itemError } = await supabase
          .from("restaurantitems")
          .select("itemid, itemname, baseprice, discount, itemImages")
          .in("itemid", itemIds);

        if (itemError) throw itemError;

        setOrder({
          ...orderData,
          ridername: riderData.name || "Not Assigned",
          restaurantname: restaurantData.restaurantname || "Unknown",
          restaurantLocation: `${restaurantData.restaurant_location_latitude}, ${restaurantData.restaurant_location_longitude}`,
          riderLocation: riderLocationData.length > 0
            ? `${riderLocationData[0].rider_location_latitude}, ${riderLocationData[0].rider_location_longitude}`
            : null,
          items: itemData.map(item => ({
            itemname: item.itemname,
            basePrice: item.baseprice,
            discountAmount: item.discount || 0,
            discountPercent: item.discount ? (item.discount / item.baseprice) * 100 : 0,
            image: item.itemImages || "/null-icon.png",
          })),
        });
      } catch (err: any) {
        console.error("Error fetching order:", err.message || "Unknown error", err.details || {});
        setError("Failed to fetch order data: " + (err.message || "Unknown error"));
      }
      setLoading(false);
    }

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-lg">{error || "Order not found"}</p>
          <button
            onClick={() => router.push("/ordersList")}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Orders
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Order Details</h1>
          <button
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Order #{order.orderid} ({order.status})
          </h2>
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
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Items:</h3>
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
                        key={`order-item-${index}`}
                        className="border border-gray-200 hover:bg-indigo-50 transition-colors"
                      >
                        <td className="p-3 border border-gray-200 text-xs">
                          <RemoteImage
                            path={item.image}
                            fallback="/null-icon.png"
                            alt={item.itemname}
                            width={40}
                            height={40}
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
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;