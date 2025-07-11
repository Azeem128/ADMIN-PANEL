// // app/customer-detail/[id]/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { getCustomerById } from "@/app/api/customers";
// import Layout from "../../components/Layout";
// import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer"; // Adjust path as needed

// interface OrderItem {
//   image: string;
//   name: string;
//   basePrice: number;
//   discountAmount: number;
//   discountPercent: number;
//   addOns: string[];
//   addOnsPrice: number;
//   total: number;
//   description: string;
// }

// interface Order {
//   id: string;
//   restaurantName: string;
//   orderDateTime: string;
//   riderName: string;
//   orderStatus: string;
//   totalAmount: number;
//   customerLocation: string;
//   restaurantLocation: string;
//   deals: number;
//   pickupTime: string;
//   deliveryTime: string;
//   duration: string;
//   items: OrderItem[];
// }

// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   createdat: string;
//   location: string;
//   profile_image: string | null;
//   noOfOrders: number;
//   totalSpent: number;
//   orderHistory?: Order[];
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const router = useRouter();
//   const params = useParams();
//   const customerId = params?.id as string;

//   useEffect(() => {
//     async function fetchCustomer(): Promise<void> {
//       if (!customerId || customerId === "undefined") {
//         setError("Customer ID not provided");
//         router.push("/customers");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await getCustomerById(customerId);
//         const { data, error } = response;
//         if (error) {
//           setError(error);
//         } else if (data) {
//           const realOrders = data.orderHistory?.length || 0;
//           const realSpent = data.orderHistory?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
//           setCustomer({
//             ...data,
//             noOfOrders: realOrders,
//             totalSpent: realSpent,
//           });
//         } else {
//           setError("Customer not found");
//         }
//       } catch (err) {
//         console.error("Error fetching customer:", err);
//         setError("Failed to fetch customer data");
//       }
//       setLoading(false);
//     }

//     fetchCustomer();
//   }, [customerId, router]);

//   const handleReorder = (order: Order) => {
//     alert(`Reordering items from ${order.restaurantName}: ${order.items.map(item => item.name).join(", ")}`);
//   };

//   const handleCancelOrder = (order: Order) => {
//     alert(`Order #${order.id} has been canceled.`);
//     setCustomer(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         orderHistory: prev.orderHistory?.map(o =>
//           o.id === order.id ? { ...o, orderStatus: "Canceled" } : o
//         ),
//       };
//     });
//     setSelectedOrder(null);
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-gray-600 text-lg">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (error || !customer) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-red-500 text-lg">{error || "Customer not found"}</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-indigo-800">Customer Details</h1>
//           <button
//             onClick={() => router.push("/customers")}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Back to Customers
//           </button>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center mb-4">
//             <RemoteImage
//               path={customer.profile_image || ""}
//               fallback="/null-icon.png"
//               alt={`Profile of ${customer.name}`}
//               width={80}
//               height={80}
//               className="rounded-full mr-4 border-4 border-indigo-200"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-indigo-900">{customer.name}</h2>
//               <p className="text-gray-600">{customer.email}</p>
//               <p className="text-gray-600">{customer.location}</p>
//               <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
//             </div>
//           </div>
//           <p className="text-gray-600">Customer ID: {customer.customerid}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-indigo-800 mb-4">Order Summary</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold text-indigo-700">Total Orders:</span> {customer.noOfOrders}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold text-indigo-700">Total Spent:</span> ${customer.totalSpent.toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200 rounded-lg">
//               <thead>
//                 <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
//                   <th className="p-3 border border-gray-200">Order #</th>
//                   <th className="p-3 border border-gray-200">Restaurant Name</th>
//                   <th className="p-3 border border-gray-200">Order Date/Time</th>
//                   <th className="p-3 border border-gray-200">Rider Name</th>
//                   <th className="p-3 border border-gray-200">Order Status</th>
//                   <th className="p-3 border border-gray-200">Total Amount</th>
//                   <th className="p-3 border border-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customer.orderHistory && customer.orderHistory.map((order) => ( // Added null check
//                   <tr
//                     key={`order-${order.id}`}
//                     className="border border-gray-200 hover:bg-indigo-50 transition-colors"
//                   >
//                     <td className="p-3 border border-gray-200 text-xs">{order.id}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{order.restaurantName}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{order.orderDateTime}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{order.riderName}</td>
//                     <td className="p-3 border border-gray-200 text-xs">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           order.orderStatus === "Completed"
//                             ? "bg-green-100 text-green-800"
//                             : order.orderStatus === "Pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {order.orderStatus}
//                       </span>
//                     </td>
//                     <td className="p-3 border border-gray-200 text-xs">${order.totalAmount.toFixed(2)}</td>
//                     <td className="p-3 border border-gray-200 text-xs">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs transition-colors"
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {selectedOrder && (
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold text-indigo-800 mb-4">
//               Order #{selectedOrder.id} ({selectedOrder.orderStatus})
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Customer Name: </span>
//                   {customer.name}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Restaurant Name: </span>
//                   {selectedOrder.restaurantName}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Rider Name: </span>
//                   {selectedOrder.riderName}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Order Date: </span>
//                   {selectedOrder.orderDateTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Restaurant Location: </span>
//                   {selectedOrder.restaurantLocation}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Pickup Time: </span>
//                   {selectedOrder.pickupTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Delivery Time: </span>
//                   {selectedOrder.deliveryTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Duration of Order: </span>
//                   {selectedOrder.duration}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Ordered Items: </span>
//                   {selectedOrder.items.length}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Deals: </span>
//                   {selectedOrder.deals}
//                 </p>
//               </div>
//             </div>
//             <div className="overflow-x-auto mb-4">
//               <table className="w-full border-collapse border border-gray-200 rounded-lg">
//                 <thead>
//                   <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
//                     <th className="p-3 border border-gray-200">Item Image</th>
//                     <th className="p-3 border border-gray-200">Item Name</th>
//                     <th className="p-3 border border-gray-200">Base Price</th>
//                     <th className="p-3 border border-gray-200">Discount Amount</th>
//                     <th className="p-3 border border-gray-200">Discount %</th>
//                     <th className="p-3 border border-gray-200">Add-ons (order)</th>
//                     <th className="p-3 border border-gray-200">Add-ons Price</th>
//                     <th className="p-3 border border-gray-200">Total</th>
//                     <th className="p-3 border border-gray-200">Description</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedOrder.items.map((item, index) => (
//                     <tr
//                       key={`order-item-${index}`}
//                       className="border border-gray-200 hover:bg-indigo-50 transition-colors"
//                     >
//                       <td className="p-3 border border-gray-200 text-xs">
//                         <RemoteImage
//                           path={item.image}
//                           fallback="/null-icon.png"
//                           alt={item.name}
//                           width={40}
//                           height={40}
//                           className="rounded-lg object-cover"
//                         />
//                       </td>
//                       <td className="p-3 border border-gray-200 text-xs">{item.name}</td>
//                       <td className="p-3 border border-gray-200 text-xs">${item.basePrice.toFixed(2)}</td>
//                       <td className="p-3 border border-gray-200 text-xs">${item.discountAmount.toFixed(2)}</td>
//                       <td className="p-3 border border-gray-200 text-xs">{item.discountPercent}%</td>
//                       <td className="p-3 border border-gray-200 text-xs">{item.addOns.join(", ")}</td>
//                       <td className="p-3 border border-gray-200 text-xs">${item.addOnsPrice.toFixed(2)}</td>
//                       <td className="p-3 border border-gray-200 text-xs">${item.total.toFixed(2)}</td>
//                       <td className="p-3 border border-gray-200 text-xs">{item.description}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => handleReorder(selectedOrder)}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Reorder
//               </button>
//               {selectedOrder.orderStatus === "Pending" && (
//                 <button
//                   onClick={() => handleCancelOrder(selectedOrder)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Cancel Order
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default CustomerDetail;



// app/customer-detail/[id]/page.tsx



// app/customer-detail/[id]/page.tsx


// app/customer-detail/[id]/page.tsx


// app/customer-detail/[id]/page.tsx









// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import Layout from "../../components/Layout";
// import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer"; // Adjust path as needed

// interface OrderItem {
//   // Removed since items are not fetched
// }

// interface Order {
//   orderid: string;
//   customerid: string;
//   restaurantid: string;
//   status: string;
//   totalamount: number;
//   riderid: string;
//   updatedat: string;
//   ridername: string;
//   restaurantname: string;
// }

// interface Rider {
//   riderid: string;
//   name: string;
// }

// interface Restaurant {
//   restaurantid: string;
//   restaurantname: string;
// }

// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   phone: string | null;
//   createdat: string;
//   profile_image: string | null;
//   orderHistory: Order[];
//   riders: Rider[];
//   restaurants: Restaurant[];
//   ordercount: number;
//   totalSpent: number;
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const router = useRouter();
//   const params = useParams();
//   const customerId = params?.id as string;

//   useEffect(() => {
//     async function fetchCustomer(): Promise<void> {
//       if (!customerId || customerId === "undefined") {
//         setError("Customer ID not provided");
//         router.push("/customers");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         // Fetch customer basic info
//         const { data: customerData, error: customerError } = await supabase
//           .from("customers")
//           .select("customerid, name, email, phone, createdat, image")
//           .eq("customerid", customerId)
//           .single();

//         if (customerError) {
//           console.error("Customer fetch error:", customerError.message, customerError.details);
//           throw customerError;
//         }

//         // Fetch orders with riderid and restaurantid
//         const { data: orderData, error: orderError } = await supabase
//           .from("orders")
//           .select("orderid, customerid, restaurantid, status, totalamount, riderid, updatedat")
//           .eq("customerid", customerId);

//         if (orderError) {
//           console.error("Order fetch error:", orderError.message, orderError.details);
//           throw orderError;
//         }

//         // Fetch rider names with error handling
//         const { data: riderData, error: riderError } = await supabase
//           .from("riders")
//           .select("riderid, name");
//         if (riderError) {
//           console.error("Rider fetch error:", riderError.message, riderError.details);
//           throw riderError;
//         }

//         // Fetch restaurant names with error handling
//         const { data: restaurantData, error: restaurantError } = await supabase
//           .from("restaurants")
//           .select("restaurantid, restaurantname");
//         if (restaurantError) {
//           console.error("Restaurant fetch error:", restaurantError.message, restaurantError.details);
//           throw restaurantError;
//         }

//         // Map orders with rider and restaurant names
//         const ordersWithDetails = orderData.map(order => ({
//           ...order,
//           ridername: riderData.find(r => r.riderid === order.riderid)?.name || "Not Assigned",
//           restaurantname: restaurantData.find(r => r.restaurantid === order.restaurantid)?.restaurantname || "Unknown",
//         }));

//         const ordercount = ordersWithDetails.length;
//         const totalSpent = ordersWithDetails
//           .filter(order => order.status === "Completed")
//           .reduce((sum, order) => sum + order.totalamount, 0) || 0;

//         setCustomer({
//           ...customerData,
//           orderHistory: ordersWithDetails,
//           riders: riderData || [],
//           restaurants: restaurantData || [],
//           ordercount,
//           totalSpent,
//         });
//       } catch (err: any) {
//         console.error("Error fetching customer:", err.message || "Unknown error", err.details || {});
//         setError("Failed to fetch customer data: " + (err.message || "Unknown error"));
//       }
//       setLoading(false);
//     }

//     fetchCustomer();
//   }, [customerId, router]);

//   const handleReorder = (order: Order) => {
//     alert(`Reordering from ${order.restaurantname}`);
//   };

//   const handleCancelOrder = (order: Order) => {
//     alert(`Order #${order.orderid} has been canceled.`);
//     setCustomer(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         orderHistory: prev.orderHistory.map(o =>
//           o.orderid === order.orderid ? { ...o, status: "Canceled" } : o
//         ),
//       };
//     });
//     setSelectedOrder(null);
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-gray-600 text-lg">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (error || !customer) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-red-500 text-lg">{error || "Customer not found"}</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-indigo-800">Customer Details</h1>
//           <button
//             onClick={() => router.push("/customers")}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Back to Customers
//           </button>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center mb-4">
//             <RemoteImage
//               path={customer.profile_image || ""}
//               fallback="/null-icon.png"
//               alt={`Profile of ${customer.name}`}
//               width={80}
//               height={80}
//               className="rounded-full mr-4 border-4 border-indigo-200"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-indigo-900">{customer.name}</h2>
//               <p className="text-gray-600">Email: {customer.email}</p>
//               <p className="text-gray-600">Phone: {customer.phone || "N/A"}</p>
//               <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
//             </div>
//           </div>
//           <p className="text-gray-600">Customer ID: {customer.customerid}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-indigo-800 mb-4">Order Summary</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold text-indigo-700">Total Orders:</span> {customer.ordercount}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold text-indigo-700">Total Spent (Completed):</span> ${customer.totalSpent.toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200 rounded-lg">
//               <thead>
//                 <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
//                   <th className="p-3 border border-gray-200">Order ID</th>
//                   <th className="p-3 border border-gray-200">Restaurant</th>
//                   <th className="p-3 border border-gray-200">Date/Time</th>
//                   <th className="p-3 border border-gray-200">Rider</th>
//                   <th className="p-3 border border-gray-200">Status</th>
//                   <th className="p-3 border border-gray-200">Total Amount</th>
//                   <th className="p-3 border border-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customer.orderHistory.map((order) => (
//                   <tr
//                     key={order.orderid}
//                     className="border border-gray-200 hover:bg-indigo-50 transition-colors"
//                   >
//                     <td className="p-3 border border-gray-200 text-xs">{order.orderid}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{order.restaurantname}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{new Date(order.updatedat).toLocaleString()}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{order.ridername}</td>
//                     <td className="p-3 border border-gray-200 text-xs">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           order.status === "Completed"
//                             ? "bg-green-100 text-green-800"
//                             : order.status === "Pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {order.status}
//                       </span>
//                     </td>
//                     <td className="p-3 border border-gray-200 text-xs">${order.totalamount.toFixed(2)}</td>
//                     <td className="p-3 border border-gray-200 text-xs">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs transition-colors"
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {selectedOrder && (
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold text-indigo-800 mb-4">
//               Order #{selectedOrder.orderid} ({selectedOrder.status})
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Customer Name:</span> {customer.name}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Restaurant:</span> {selectedOrder.restaurantname}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Rider:</span> {selectedOrder.ridername}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Order Date:</span> {new Date(selectedOrder.updatedat).toLocaleString()}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold text-indigo-700">Total Amount:</span> ${selectedOrder.totalamount.toFixed(2)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Close
//               </button>
//               {selectedOrder.status === "Pending" && (
//                 <button
//                   onClick={() => handleCancelOrder(selectedOrder)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Cancel Order
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default CustomerDetail;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer"; // Adjust path as needed

interface OrderItem {
  itemname: string;
}

interface Order {
  orderid: string;
  customerid: string;
  restaurantid: string;
  status: string;
  totalamount: number;
  riderid: string;
  updatedat: string;
  cartid: string; // Added for item fetching
  ridername: string;
  restaurantname: string;
  items: OrderItem[]; // Added to store item names
}

interface Rider {
  riderid: string;
  name: string;
}

interface Restaurant {
  restaurantid: string;
  restaurantname: string;
}

interface Customer {
  customerid: string;
  name: string;
  email: string;
  phone: string | null;
  createdat: string;
  profile_image: string | null;
  orderHistory: Order[];
  riders: Rider[];
  restaurants: Restaurant[];
  ordercount: number;
  totalSpent: number;
}

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        // Fetch customer basic info
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("customerid, name, email, phone, createdat, image")
          .eq("customerid", customerId)
          .single();

        if (customerError) {
          console.error("Customer fetch error:", customerError.message, customerError.details);
          throw customerError;
        }

        // Fetch orders with necessary fields
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("orderid, customerid, restaurantid, status, totalamount, riderid, updatedat, cartid")
          .eq("customerid", customerId);

        if (orderError) {
          console.error("Order fetch error:", orderError.message, orderError.details);
          throw orderError;
        }

        // Fetch rider names
        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select("riderid, name");
        if (riderError) {
          console.error("Rider fetch error:", riderError.message, riderError.details);
          throw riderError;
        }

        // Fetch restaurant names
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("restaurantid, restaurantname");
        if (restaurantError) {
          console.error("Restaurant fetch error:", restaurantError.message, restaurantError.details);
          throw restaurantError;
        }

        // Fetch item names for each order
        const ordersWithDetails = await Promise.all(orderData.map(async (order) => {
          const { data: cartItemsData, error: cartItemsError } = await supabase
            .from("cartitems")
            .select("itemid")
            .eq("cartid", order.cartid);

          if (cartItemsError) {
            console.error("CartItems fetch error:", cartItemsError.message);
            return { ...order, ridername: "Not Assigned", restaurantname: "Unknown", items: [] };
          }

          const itemIds = cartItemsData.map(item => item.itemid);
          const { data: itemData, error: itemError } = await supabase
            .from("restaurantitems")
            .select("itemname")
            .in("itemid", itemIds);

          if (itemError) {
            console.error("RestaurantItems fetch error:", itemError.message);
            return { ...order, ridername: "Not Assigned", restaurantname: "Unknown", items: [] };
          }

          return {
            ...order,
            ridername: riderData.find(r => r.riderid === order.riderid)?.name || "Not Assigned",
            restaurantname: restaurantData.find(r => r.restaurantid === order.restaurantid)?.restaurantname || "Unknown",
            items: itemData.map(item => ({ itemname: item.itemname })),
          };
        }));

        const ordercount = ordersWithDetails.length;
        const totalSpent = ordersWithDetails
          .filter(order => order.status === "Completed")
          .reduce((sum, order) => sum + order.totalamount, 0) || 0;

        setCustomer({
          ...customerData,
          orderHistory: ordersWithDetails,
          riders: riderData || [],
          restaurants: restaurantData || [],
          ordercount,
          totalSpent,
        });
      } catch (err: any) {
        console.error("Error fetching customer:", err.message || "Unknown error", err.details || {});
        setError("Failed to fetch customer data: " + (err.message || "Unknown error"));
      }
      setLoading(false);
    }

    fetchCustomer();
  }, [customerId, router]);

  const handleReorder = (order: Order) => {
    alert(`Reordering from ${order.restaurantname}`);
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
    setSelectedOrder(null);
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
            <RemoteImage
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
              <p className="text-gray-600">Phone: {customer.phone || "N/A"}</p>
              <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-gray-600">Customer ID: {customer.customerid}</p>
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
                  <tr
                    key={order.orderid}
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
                        onClick={() => setSelectedOrder(order)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-xs transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">
              Order #{selectedOrder.orderid} ({selectedOrder.status})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Customer Name:</span> {customer.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Restaurant:</span> {selectedOrder.restaurantname}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Rider:</span> {selectedOrder.ridername}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Order Date:</span> {new Date(selectedOrder.updatedat).toLocaleString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Total Amount:</span> ${selectedOrder.totalamount.toFixed(2)}
                </p>
              </div>
            </div>
            {selectedOrder.items.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">Items:</h3>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-gray-600">{item.itemname}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {selectedOrder.status === "Pending" && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerDetail;