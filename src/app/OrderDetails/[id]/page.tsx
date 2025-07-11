"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useReadAllOrders } from "../../api/OrderRelatedApi/orders";
import Layout from "../../components/Layout";
import { format } from "date-fns";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data: orders, isLoading, isError, error } = useReadAllOrders();
  const order = orders?.find((o) => o.orderid === orderId);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !order) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-red-600">Error: {error?.message || "Order not found"}</p>
        </div>
      </Layout>
    );
  }

  const createdDate = new Date(order.createdat);
  const updatedDate = order.carts.updatedat ? new Date(order.carts.updatedat) : null;
  const items = order.carts.cartitems.map((item) => item.restaurantitems.itemname).join(", ");

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Order ID</h3>
                <p className="text-gray-800">{order.orderid}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Customer ID</h3>
                <p className="text-gray-800">{order.customerid}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Restaurant ID</h3>
                <p className="text-gray-800">{order.restaurantid}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Rider ID</h3>
                <p className="text-gray-800">{order.riderid || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Restaurant Name</h3>
                <p className="text-gray-800">{order.restaurants.restaurantname}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Status</h3>
                <p className="text-gray-800">{order.status}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Date & Time</h3>
                <p className="text-gray-800">{format(createdDate, "yyyy-MM-dd HH:mm")}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Last Updated</h3>
                <p className="text-gray-800">{updatedDate ? format(updatedDate, "yyyy-MM-dd HH:mm") : "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Amount</h3>
              <p className="text-gray-800">${order.totalamount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Payment Method</h3>
              <p className="text-gray-800">{order.paymentmethod}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Cart ID</h3>
              <p className="text-gray-800">{order.carts.cartid}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Items</h3>
              <p className="text-gray-800">{items || "No items"}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/ordersList">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}