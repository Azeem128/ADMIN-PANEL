"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { useReadAllOrders } from "../api/OrderRelatedApi/orders";
import { format } from "date-fns";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  orderid: string;
  customers: { name: string };
  restaurants: { restaurantname: string };
  status: string;
  totalamount: number;
  paymentmethod: string;
  createdat: string;
  riderid?: string;
};

const OrdersListPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const { data, isLoading, isError, error } = useReadAllOrders(filters);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.preventDefault();
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const handleDeleteOrder = async (orderid: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    const { error } = await supabase.from("orders").delete().eq("orderid", orderid);
    if (error) {
      alert(`Failed to delete order: ${error.message}`);
      console.error(error);
    } else {
      setOrders((prev) => prev.filter((order) => order.orderid !== orderid));
    }
  };

  const handleEditOrder = async (orderid: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updatedat: new Date().toISOString() })
      .eq("orderid", orderid);
    if (error) {
      alert(`Failed to update order status: ${error.message}`);
      console.error(error);
    } else {
      await supabase.from("orderstatus").insert({
        orderstatusid: crypto.randomUUID(),
        orderid: orderid,
        status: newStatus,
        timestamp: new Date().toISOString(),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.orderid === orderid ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated successfully!");
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading orders...</p>
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

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">No orders available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Management</h2>
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4" onSubmit={(e) => e.preventDefault()}>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="On Process">On Process</option>
              <option value="Cancelled By Owner">Cancelled By Owner</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Accepted by Owner">Accepted by Owner</option>
              <option value="Accepted by Rider">Accepted by Rider</option>
              <option value="Cancelled by Rider">Cancelled by Rider</option>
            </select>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Order ID</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Restaurant</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Date & Time</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.orderid} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{order.orderid}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {order.restaurants?.restaurantname || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    <select
                      value={order.status}
                      onChange={(e) => handleEditOrder(order.orderid, e.target.value)}
                      className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Ready for Delivery">Ready for Delivery</option>
                      <option value="On Process">On Process</option>
                      <option value="Cancelled By Owner">Cancelled By Owner</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="Accepted by Owner">Accepted by Owner</option>
                      <option value="Accepted by Rider">Accepted by Rider</option>
                      <option value="Cancelled by Rider">Cancelled by Rider</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {format(new Date(order.createdat), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <Link href={`/OrderDetails/${order.orderid}`}>
                      <button className="text-blue-500 hover:text-blue-700">View Details</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order.orderid)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastOrder >= orders.length}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersListPage;