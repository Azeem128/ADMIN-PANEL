// "use client";

// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import OrderDetailsModal from "../components/OrderDetailsModal";
// import { useReadAllOrders } from "../api/OrderRelatedApi/orders";
// import { supabase } from "@/lib/supabaseClient";

// type Order = {
//   orderid: string;
//   customers: { name: string };
//   restaurants: { restaurantname: string };
//   status: string;
//   totalamount: number;
//   paymentmethod: string;
//   createdat: string;
//   riderid?: string;
// };

// const OrdersListPage = () => {
//   const { data, isLoading, isError, error } = useReadAllOrders();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editOrder, setEditOrder] = useState<Order | null>(null);
//   const [newStatus, setNewStatus] = useState<string>("");
//   const [showAddOrder, setShowAddOrder] = useState(false);
//   const [newOrder, setNewOrder] = useState<Omit<Order, "orderid" | "createdat">>({
//     customers: { name: "" },
//     restaurants: { restaurantname: "" },
//     status: "Pending",
//     totalamount: 0,
//     paymentmethod: "Cash",
//     riderid: "",
//   });

//   // const [sortField, setSortField] = useState<keyof Order | "customers.name" | "restaurants.restaurantname">("orderid");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 5;

//   useEffect(() => {
//     if (data) {
//       setOrders(data);
//     }

//     const subscription = supabase
//       .channel("orders-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "Orders" },
//         async (payload) => {
//           const newOrder = payload.new as Order;
//           const { data: customerData } = await supabase
//             .from("Customers")
//             .select("name")
//             .eq("CustomerId", newOrder.customerid)
//             .single();
//           const { data: restaurantData } = await supabase
//             .from("Restaurants")
//             .select("restaurantname")
//             .eq("RestaurantId", newOrder.restaurantid)
//             .single();
//           setOrders((prev) => [
//             {
//               ...newOrder,
//               customers: { name: customerData?.name || "Unknown" },
//               restaurants: { restaurantname: restaurantData?.restaurantname || "Unknown" },
//             },
//             ...prev,
//           ]);
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "Orders" },
//         (payload) => {
//           const updatedOrder = payload.new as Order;
//           setOrders((prev) =>
//             prev.map((order) =>
//               order.orderid === updatedOrder.orderid ? { ...order, ...updatedOrder } : order
//             )
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "Orders" },
//         (payload) => {
//           const deletedOrderId = payload.old.orderid as string;
//           setOrders((prev) => prev.filter((order) => order.orderid !== deletedOrderId));
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   const handleSort = (field: keyof Order | "customers.name" | "restaurants.restaurantname") => {
//     const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
//     const sortedOrders = [...orders].sort((a, b) => {
//       let aValue: string | number = a[field];
//       let bValue: string | number = b[field];

//       if (field === "customers.name") {
//         aValue = a.customers.name;
//         bValue = b.customers.name;
//       } else if (field === "restaurants.restaurantname") {
//         aValue = a.restaurants.restaurantname;
//         bValue = b.restaurants.restaurantname;
//       }

//       return newSortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
//     });
//     setOrders(sortedOrders);
//     // setSortField(field);
//     setSortOrder(newSortOrder);
//   };

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   const nextPage = () => setCurrentPage(currentPage + 1);
//   const prevPage = () => setCurrentPage(currentPage - 1);

//   const handleViewDetails = (order: Order) => {
//     setCurrentOrder(order);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setCurrentOrder(null);
//   };

//   const handleEditOrder = (order: Order) => {
//     setEditOrder(order);
//     setNewStatus(order.status);
//   };

//   const handleSaveEdit = async () => {
//     if (!editOrder) return;

//     const { error } = await supabase
//       .from("Orders")
//       .update({ status: newStatus, updatedat: new Date().toISOString() })
//       .eq("orderid", editOrder.orderid);

//     if (error) {
//       alert(`Failed to update order status: ${error.message}`);
//       console.error(error);
//     } else {
//       await supabase.from("OrderStatus").insert({
//         OrderStatusId: crypto.randomUUID(),
//         OrderId: editOrder.orderid,
//         Status: newStatus,
//         TimeStamp: new Date().toISOString(),
//       });
//       setEditOrder(null);
//       setNewStatus("");
//     }
//   };

//   const handleAddOrder = async () => {
//     const orderId = crypto.randomUUID();
//     const createdAt = new Date().toISOString();

//     const { data: customerData } = await supabase
//       .from("Customers")
//       .select("CustomerId")
//       .eq("name", newOrder.customers.name)
//       .single();
//     const { data: restaurantData } = await supabase
//       .from("Restaurants")
//       .select("RestaurantId")
//       .eq("restaurantname", newOrder.restaurants.restaurantname)
//       .single();

//     const { error } = await supabase.from("Orders").insert({
//       orderid: orderId,
//       customerid: customerData?.CustomerId || null,
//       restaurantid: restaurantData?.RestaurantId || null,
//       status: newOrder.status,
//       totalamount: newOrder.totalamount,
//       paymentmethod: newOrder.paymentmethod,
//       createdat: createdAt,
//       riderid: newOrder.riderid || null,
//     });

//     if (error) {
//       alert(`Failed to add order: ${error.message}`);
//       console.error(error);
//     } else {
//       setShowAddOrder(false);
//       setNewOrder({
//         customers: { name: "" },
//         restaurants: { restaurantname: "" },
//         status: "Pending",
//         totalamount: 0,
//         paymentmethod: "Cash",
//         riderid: "",
//       });
//     }
//   };

//   const handleDeleteOrder = async (orderId: string) => {
//     const { error } = await supabase
//       .from("Orders")
//       .delete()
//       .eq("orderid", orderId);

//     if (error) {
//       alert(`Failed to delete order: ${error.message}`);
//       console.error(error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">Loading orders...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-red-600">Error: {error.message}</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!data || orders.length === 0) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">No orders available.</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-4">
//         <h2 className="text-2xl font-bold mb-4 text-blue-900">Orders</h2>

//         <div className="mb-4 flex justify-between">
//           <div>
//             <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
//             <select
//               id="sort"
//               onChange={(e) => handleSort(e.target.value as keyof Order | "customers.name" | "restaurants.restaurantname")}
//               className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="orderid">Order ID</option>
//               <option value="customers.name">Customer Name</option>
//               <option value="restaurants.restaurantname">Restaurant Name</option>
//               <option value="status">Status</option>
//               <option value="totalamount">Amount</option>
//               <option value="createdat">Order Date</option>
//             </select>
//           </div>
//           <button
//             onClick={() => setShowAddOrder(true)}
//             className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//           >
//             Add Order
//           </button>
//         </div>

//         <div className="overflow-x-auto overflow-visible scroll-smooth scroll-m-0 w-full">
//           <table className="min-w-full table-auto bg-white rounded-md shadow-lg mb-6">
//             <thead className="sticky top-0 bg-gray-100 z-10">
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("orderid")}>Order ID</th>
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("customers.name")}>Customer Name</th>
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("restaurants.restaurantname")}>Restaurant Name</th>
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("status")}>Status</th>
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("totalamount")}>Amount</th>
//                 <th className="px-4 py-2">Payment Method</th>
//                 <th className="px-4 py-2">Delivery Status</th>
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("createdat")}>Order Date</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentOrders.map((order) => (
//                 <tr key={order.orderid} className="border-b">
//                   <td className="border px-4 py-2">{order.orderid}</td>
//                   <td className="border px-4 py-2">{order.customers.name}</td>
//                   <td className="border px-4 py-2">{order.restaurants.restaurantname}</td>
//                   <td className="border px-4 py-2">{order.status}</td>
//                   <td className="border px-4 py-2">${order.totalamount.toFixed(2)}</td>
//                   <td className="border px-4 py-2">{order.paymentmethod}</td>
//                   <td className="border px-4 py-2">
//                     {order.status.toLowerCase() === "delivered" ? "Delivered" : "Not Delivered"}
//                   </td>
//                   <td className="border px-4 py-2">{new Date(order.createdat).toLocaleString()}</td>
//                   <td className="border px-4 py-2 flex space-x-2">
//                     <button
//                       onClick={() => handleViewDetails(order)}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => handleEditOrder(order)}
//                       className="text-green-500 hover:text-green-700"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteOrder(order.orderid)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-between">
//           <button
//             onClick={prevPage}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
//           >
//             Previous
//           </button>
//           <span className="self-center">Page {currentPage}</span>
//           <button
//             onClick={nextPage}
//             disabled={currentPage * ordersPerPage >= orders.length}
//             className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
//           >
//             Next
//           </button>
//         </div>

//         {showModal && <OrderDetailsModal order={currentOrder} closeModal={closeModal} />}

//         {editOrder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
//               <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Order Status</h2>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={newStatus}
//                   onChange={(e) => setNewStatus(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Ready for Delivery">Ready for Delivery</option>
//                   <option value="On Process">On Process</option>
//                   <option value="Cancelled By Owner">Cancelled By Owner</option>
//                   <option value="Picked Up">Picked Up</option>
//                   <option value="Accepted by Owner">Accepted by Owner</option>
//                   <option value="Accepted by Rider">Accepted by Rider</option>
//                   <option value="Cancelled by Rider">Cancelled by Rider</option>
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => setEditOrder(null)}
//                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveEdit}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showAddOrder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
//               <h2 className="text-xl font-bold text-blue-900 mb-4">Add New Order</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Customer Name</label>
//                   <input
//                     type="text"
//                     value={newOrder.customers.name}
//                     onChange={(e) => setNewOrder({ ...newOrder, customers: { name: e.target.value } })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
//                   <input
//                     type="text"
//                     value={newOrder.restaurants.restaurantname}
//                     onChange={(e) => setNewOrder({ ...newOrder, restaurants: { restaurantname: e.target.value } })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Status</label>
//                   <select
//                     value={newOrder.status}
//                     onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Ready for Delivery">Ready for Delivery</option>
//                     <option value="On Process">On Process</option>
//                     <option value="Cancelled By Owner">Cancelled By Owner</option>
//                     <option value="Picked Up">Picked Up</option>
//                     <option value="Accepted by Owner">Accepted by Owner</option>
//                     <option value="Accepted by Rider">Accepted by Rider</option>
//                     <option value="Cancelled by Rider">Cancelled by Rider</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                   <input
//                     type="number"
//                     value={newOrder.totalamount}
//                     onChange={(e) => setNewOrder({ ...newOrder, totalamount: parseFloat(e.target.value) || 0 })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                   <select
//                     value={newOrder.paymentmethod}
//                     onChange={(e) => setNewOrder({ ...newOrder, paymentmethod: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Stripe">Stripe</option>
                  
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Rider ID (optional)</label>
//                   <input
//                     type="text"
//                     value={newOrder.riderid || ""}
//                     onChange={(e) => setNewOrder({ ...newOrder, riderid: e.target.value || undefined })}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end space-x-2">
//                 <button
//                   onClick={() => setShowAddOrder(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddOrder}
//                   className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                 >
//                   Add Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default OrdersListPage;








"use client";

import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { useReadAllOrders } from "../api/OrderRelatedApi/orders";
import { format } from "date-fns";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // Ensure this is correctly imported

const OrdersListPage = () => {
  // Define all Hooks at the top level in a consistent order
  const [filters, setFilters] = useState({
    status: "",
    orderid: "",
    restaurantname: "",
    startDate: "",
    endDate: "",
  });
  const { data, isLoading, isError, error } = useReadAllOrders(filters);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Use useCallback consistently
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.preventDefault(); // Prevent form submission or page refresh
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [] // Empty dependency array since it only depends on setFilters, which is stable
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
      alert("Order status updated successfully!"); // Toast message
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
          <div className="flex space-x-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission */}
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
              type="text"
              name="orderid"
              value={filters.orderid}
              onChange={handleFilterChange}
              placeholder="Filter by Order ID (exact match)"
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="restaurantname"
              value={filters.restaurantname}
              onChange={handleFilterChange}
              placeholder="Filter by Restaurant"
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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