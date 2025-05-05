// "use client";

// import Layout from "../../components/Layout";
// import { useState } from "react";

// const dummyCustomerDetails = {
//     id: 1,
//     name: "John Doe",
//     email: "johndoe@example.com",
//     phone: "+1 123 456 7890",
//     totalOrders: 15,
//     totalSpent: "$450",
//     status: "Active",
//     address: "123 Main St, New York, NY, USA"
// };

// export default function CustomerDetailPage() {
//     const [customer] = useState(dummyCustomerDetails);

//     return (
//         <Layout>
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">👤 Customer Details</h1>

//             <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-semibold">{customer.name}</h2>
//                 <p className="text-gray-600">{customer.email}</p>

//                 <div className="mt-4">
//                     <p><strong>📞 Phone:</strong> {customer.phone}</p>
//                     <p><strong>📍 Address:</strong> {customer.address}</p>
//                     <p><strong>🛒 Total Orders:</strong> {customer.totalOrders}</p>
//                     <p><strong>💰 Total Spent:</strong> {customer.totalSpent}</p>
//                     <p className={`font-bold ${customer.status === "Active" ? "text-green-600" : "text-red-600"}`}>
//                         {customer.status}
//                     </p>
//                 </div>
//             </div>
//         </div>
//         </Layout>
//     );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getCustomerById } from "../../api/customers";
// import Layout from "@/app/components/Layout";

// const CustomerDetail = () => {
//     const { id } = useParams();
//     const router = useRouter();
//     const [customer, setCustomer] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     // if (!id) {
//     //     return (
//     //       <div className="p-6 bg-white rounded-lg shadow-lg">
//     //         <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
//     //         <p className="text-gray-500">Please select a customer from the Customers list.</p>
//     //       </div>
//     //     );
//     //   }

//     useEffect(() => {
       
//         if (!id) {
//             router.push("/customers"); // Redirect to Customers List if no ID
//             return;
//         }

//         async function fetchCustomer() {
//             const { data } = await getCustomerById(id);
//             setCustomer(data);
//             setLoading(false);
//         }

//         fetchCustomer();
//     }, [id]);

//     if (loading) return <p>Loading...</p>;
//     if (!customer) return <p>No customer found.</p>;

//     return (
//         <Layout>
//             <div className="p-6 bg-white rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

//                 <div className="grid grid-cols-3 gap-4">
//                     {/* Section 1 - Customer Info */}
//                     <div className="bg-gray-100 p-4 rounded-lg shadow">
//                         <h3 className="text-lg font-semibold">Basic Information</h3>
//                         <p><strong>Name:</strong> {customer.name}</p>
//                         <p><strong>Email:</strong> {customer.email}</p>
//                         <p><strong>Joined:</strong> {new Date(customer.createdat).toLocaleString()}</p>
//                     </div>

//                     {/* Section 2 - Order Details */}
//                     <div className="bg-gray-100 p-4 rounded-lg shadow">
//                         <h3 className="text-lg font-semibold">Order Details</h3>
//                         <p><strong>Total Orders:</strong> {customer.orders}</p>
//                         <p><strong>Completed:</strong> {customer.completed}</p>
//                         <p><strong>Canceled:</strong> {customer.canceled}</p>
//                     </div>

//                     {/* Section 3 - Address & Payment */}
//                     <div className="bg-gray-100 p-4 rounded-lg shadow">
//                         <h3 className="text-lg font-semibold">Address & Payment</h3>
//                         <p><strong>Location:</strong> {customer.location}</p>
//                         <p><strong>Card:</strong> {customer.card}</p>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default CustomerDetail;
// "use client"; // Ensures this only runs on the client-side

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { getCustomerById } from "../../api/customers"; // Correct API import
// import Layout from "@/app/components/Layout";

// // Define the Customer interface based on your previous code
// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   createdat: string;
//   orders: number;
//   completed: number;
//   canceled: number;
//   location: string;
//   card: string;
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const params = useParams();
//   const customerId = params?.id as string; // Adjusted to match your previous code (params.id)

//   useEffect(() => {
//     async function fetchCustomer(): Promise<void> {
//       if (!customerId) {
//         setError("Customer ID not provided");
//         router.push("/customers"); // Redirect to Customers List if no ID
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       const response = await getCustomerById(customerId); // Use getCustomerById
//       const { data, error } = response;
//       if (error) {
//         setError(error);
//       } else if (data) {
//         setCustomer(data);
//       } else {
//         setError("Customer not found");
//       }
//       setLoading(false);
//     }

//     fetchCustomer();
//   }, [customerId, router]);

//   if (loading) {
//     return (
//       <Layout>
//         <p className="text-gray-600">Loading...</p>
//       </Layout>
//     );
//   }

//   if (error || !customer) {
//     return (
//       <Layout>
//         <p className="text-red-500">{error || "Customer not found"}</p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h1 className="text-2xl font-bold mb-6">Customer Detail</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Profile Section */}
//           <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow">
//             <h2 className="text-xl font-bold mb-4">{customer.name}</h2>
//             <p className="text-gray-600 mb-2">
//               <span className="font-semibold">Email:</span> {customer.email}
//             </p>
//             <p className="text-gray-600 mb-2">
//               <span className="font-semibold">Location:</span> {customer.location}
//             </p>
//             <p className="text-gray-600 mb-2">
//               <span className="font-semibold">Joined:</span>{" "}
//               {new Date(customer.createdat).toLocaleString()}
//             </p>
//           </div>

//           {/* Details Section */}
//           <div className="col-span-2 bg-gray-100 p-6 rounded-lg shadow">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Customer ID:</span> {customer.id}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Total Orders:</span> {customer.orders}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Completed Orders:</span> {customer.completed}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Cancelled Orders:</span> {customer.canceled}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Card:</span> {customer.card}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Placeholder for Future Sections (like "Most Ordered Food" or "Most Liked Food") */}
//         <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">Additional Information</h2>
//           <p className="text-gray-600">
//             This section can be expanded to include more details such as "Most Ordered Food" or
//             "Most Liked Food" as shown in the design.
//           </p>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CustomerDetail;
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { getCustomerById } from "../../api/customers";
// import Layout from "../../components/Layout";

// // Define interfaces for nested data
// interface FoodItem {
//   name: string;
//   price: number;
//   image: string;
// }

// interface LikedFood {
//   name: string;
//   count: number;
//   color: string;
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

// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   createdat: string;
//   orders: number;
//   completed: number;
//   canceled: number;
//   location: string;
//   card: string;
//   balance: number;
//   mostOrderedFoods: { [key: string]: FoodItem[] };
//   mostLikedFoods: { [key: string]: LikedFood[] };
//   orderHistory: Order[];
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [period, setPeriod] = useState<"Monthly" | "Weekly" | "Daily">("Monthly");
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
//           const idNum = parseInt(customerId, 10) || 1;
//           const balance = 5000 + (idNum % 5) * 1000;

//           const enhancedData: Customer = {
//             ...data,
//             customerid: data.customerid || `CUST-${idNum}`,
//             balance,
//             mostOrderedFoods: {
//               Monthly: [
//                 { name: `Spicy Pasta ${idNum}`, price: 1200 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/FF${idNum}00` },
//                 { name: `Grilled Chicken ${idNum}`, price: 1500 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/00FF${idNum}0` },
//                 { name: `Cheese Pizza ${idNum}`, price: 1300 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/0000${idNum}FF` },
//               ],
//               Weekly: [
//                 { name: `Burger Deluxe ${idNum}`, price: 800 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/FF${idNum}FF` },
//                 { name: `Fries Combo ${idNum}`, price: 600 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/FFFF${idNum}0` },
//               ],
//               Daily: [
//                 { name: `Salad Bowl ${idNum}`, price: 500 + (idNum % 3) * 100, image: `https://via.placeholder.com/50/0FFF${idNum}0` },
//               ],
//             },
//             mostLikedFoods: {
//               Monthly: [
//                 { name: "Spaghetti", count: 200 + (idNum % 3) * 50, color: "bg-blue-500" },
//                 { name: "Pizza", count: 150 + (idNum % 3) * 30, color: "bg-red-500" },
//                 { name: "Burger", count: 180 + (idNum % 3) * 40, color: "bg-green-500" },
//                 { name: "Sprite", count: 100 + (idNum % 3) * 20, color: "bg-yellow-500" },
//               ],
//               Weekly: [
//                 { name: "Spaghetti", count: 80 + (idNum % 3) * 20, color: "bg-blue-500" },
//                 { name: "Pizza", count: 60 + (idNum % 3) * 15, color: "bg-red-500" },
//                 { name: "Burger", count: 70 + (idNum % 3) * 25, color: "bg-green-500" },
//                 { name: "Sprite", count: 40 + (idNum % 3) * 10, color: "bg-yellow-500" },
//               ],
//               Daily: [
//                 { name: "Spaghetti", count: 20 + (idNum % 3) * 5, color: "bg-blue-500" },
//                 { name: "Pizza", count: 15 + (idNum % 3) * 3, color: "bg-red-500" },
//                 { name: "Burger", count: 25 + (idNum % 3) * 4, color: "bg-green-500" },
//                 { name: "Sprite", count: 10 + (idNum % 3) * 2, color: "bg-yellow-500" },
//               ],
//             },
//             orderHistory: [
//               {
//                 id: `123${idNum}`,
//                 restaurantName: `Karachi Biryani ${idNum}`,
//                 orderDateTime: "28 Jan, 12:30 AM",
//                 riderName: `Abdullah Ashfaq ${idNum}`,
//                 orderStatus: "Completed",
//                 totalAmount: 1800 + (idNum % 3) * 200,
//                 customerLocation: "Model Town",
//                 restaurantLocation: "Town Ship",
//                 deals: 1 + (idNum % 2),
//                 pickupTime: "1:50 PM",
//                 deliveryTime: "2:00 PM",
//                 duration: "1:30 hr",
//                 items: [
//                   {
//                     image: `https://via.placeholder.com/50/FF${idNum}00`,
//                     name: `Biryani Special ${idNum}`,
//                     basePrice: 500 + (idNum % 3) * 50,
//                     discountAmount: 0,
//                     discountPercent: 0,
//                     addOns: ["Raita", "Salad", "Coke"],
//                     addOnsPrice: 250,
//                     total: 750 + (idNum % 3) * 50,
//                     description: `Delicious biryani with spices ${idNum}`,
//                   },
//                   {
//                     image: `https://via.placeholder.com/50/00FF${idNum}0`,
//                     name: `Chicken Tikka ${idNum}`,
//                     basePrice: 600 + (idNum % 3) * 50,
//                     discountAmount: 50,
//                     discountPercent: 10,
//                     addOns: ["Raita", "Coke"],
//                     addOnsPrice: 200,
//                     total: 750 + (idNum % 3) * 50,
//                     description: `Grilled chicken tikka ${idNum}`,
//                   },
//                 ],
//               },
//               {
//                 id: `123${idNum + 1}`,
//                 restaurantName: `Karachi Biryani ${idNum}`,
//                 orderDateTime: "29 Jan, 1:00 PM",
//                 riderName: `Ali Khan ${idNum}`,
//                 orderStatus: "Completed",
//                 totalAmount: 2000 + (idNum % 3) * 200,
//                 customerLocation: "Model Town",
//                 restaurantLocation: "Town Ship",
//                 deals: 2,
//                 pickupTime: "2:00 PM",
//                 deliveryTime: "2:15 PM",
//                 duration: "1:15 hr",
//                 items: [],
//               },
//             ],
//           };
//           setCustomer(enhancedData);
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

//   if (loading) {
//     return (
//       <Layout>
//         <p className="text-gray-600">Loading...</p>
//       </Layout>
//     );
//   }

//   if (error || !customer) {
//     return (
//       <Layout>
//         <p className="text-red-500">{error || "Customer not found"}</p>
//       </Layout>
//     );
//   }

//   const currentLikedFoods = customer.mostLikedFoods[period];
//   const totalLikes = currentLikedFoods.reduce((sum, food) => sum + food.count, 0);
//   const maxLikedCount = Math.max(...currentLikedFoods.map((food) => food.count));

//   return (
//     <Layout>
//       <div className="min-h-screen">
//         <h1 className="text-xl font-semibold mb-4">Customer Detail</h1>

//         {/* Profile and Balance Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           <div className="col-span-1 bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center mb-4">
//               <img
//                 src={`https://via.placeholder.com/80/FF${customer.customerid}00`}
//                 alt="Profile"
//                 className="w-16 h-16 rounded-full mr-4"
//               />
//               <div>
//                 <h2 className="text-xl font-bold">{customer.name}</h2>
//                 <p className="text-gray-600">{customer.email}</p>
//                 <p className="text-gray-600">{customer.location}</p>
//                 <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
//               </div>
//             </div>
//             <p className="text-gray-600">Customer ID: {customer.customerid}</p>
//           </div>

//           <div className="col-span-2 bg-green-500 text-white p-6 rounded-lg shadow flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-semibold">Your Balance</h3>
//               <p className="text-3xl font-bold">${customer.balance.toLocaleString()}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm">{customer.card}</p>
//               <p className="text-sm">02/21</p>
//             </div>
//           </div>
//         </div>

//         {/* Most Ordered Food and Most Liked Food */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Most Ordered Food */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Most Ordered Food</h2>
//             <div className="flex justify-between mb-2">
//               {["Monthly", "Weekly", "Daily"].map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setPeriod(p as "Monthly" | "Weekly" | "Daily")}
//                   className={`px-3 py-1 rounded-lg text-sm ${
//                     period === p ? "bg-blue-500 text-white" : "bg-gray-200"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               ))}
//             </div>
//             {customer.mostOrderedFoods[period].length > 0 ? (
//               customer.mostOrderedFoods[period].map((food, index) => (
//                 <div key={`ordered-food-${index}`} className="flex items-center mb-4">
//                   <img src={food.image} alt={food.name} className="w-12 h-12 rounded-full mr-4" />
//                   <div className="flex-1">
//                     <p className="font-medium">{food.name}</p>
//                     <p className="text-gray-600">{food.name.split(" ")[1]}</p>
//                   </div>
//                   <p className="font-semibold">${food.price.toLocaleString()}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No data for this period.</p>
//             )}
//           </div>

//           {/* Most Liked Food */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Most Liked Food</h2>
//             <div className="flex justify-between mb-2">
//               {["Monthly", "Weekly", "Daily"].map((p) => (
//                 <button
//                   key={`liked-period-${p}`}
//                   onClick={() => setPeriod(p as "Monthly" | "Weekly" | "Daily")}
//                   className={`px-3 py-1 rounded-lg text-sm ${
//                     period === p ? "bg-blue-500 text-white" : "bg-gray-200"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               ))}
//             </div>
//             <div className="mb-4">
//               <p className="text-2xl font-bold">{totalLikes} Likes</p>
//               <p className="text-gray-600">
//                 {period === "Monthly" ? "Oct 20th - Dec 20th, 2021" : period === "Weekly" ? "Dec 13th - Dec 20th, 2021" : "Dec 20th, 2021"}
//               </p>
//             </div>
//             <div className="space-y-2">
//               {currentLikedFoods.map((food, index) => (
//                 <div key={`liked-food-bar-${index}`} className="flex items-center">
//                   <div className="w-24 text-sm">{food.name}</div>
//                   <div className="flex-1 h-6 rounded-lg overflow-hidden bg-gray-200">
//                     <div
//                       className={`h-full ${food.color}`}
//                       style={{ width: `${(food.count / maxLikedCount) * 100}%` }}
//                     ></div>
//                   </div>
//                   <div className="w-12 text-right text-sm">{food.count}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between mt-4 text-sm">
//               {currentLikedFoods.map((food, index) => (
//                 <div key={`liked-food-legend-${index}`} className="flex items-center">
//                   <div className={`w-4 h-4 ${food.color} rounded-full mr-2`}></div>
//                   <span>{food.name} [{food.count}]</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Order Summary Section */}
//         <div className="bg-white p-6 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200 rounded-lg">
//               <thead>
//                 <tr className="bg-gray-100 text-left text-xs">
//                   <th className="p-2 border border-gray-200">Order #</th>
//                   <th className="p-2 border border-gray-200">Restaurant Name</th>
//                   <th className="p-2 border border-gray-200">Order Date/Time</th>
//                   <th className="p-2 border border-gray-200">Rider Name</th>
//                   <th className="p-2 border border-gray-200">Order Status</th>
//                   <th className="p-2 border border-gray-200">Total Amount</th>
//                   <th className="p-2 border border-gray-200">Customer Location</th>
//                   <th className="p-2 border border-gray-200">Restaurant Location</th>
//                   <th className="p-2 border border-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customer.orderHistory.map((order) => (
//                   <tr key={`order-${order.id}`} className="border border-gray-200">
//                     <td className="p-2 border border-gray-200 text-xs">{order.id}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.restaurantName}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.orderDateTime}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.riderName}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.orderStatus}</td>
//                     <td className="p-2 border border-gray-200 text-xs">${order.totalAmount.toLocaleString()}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.customerLocation}</td>
//                     <td className="p-2 border border-gray-200 text-xs">{order.restaurantLocation}</td>
//                     <td className="p-2 border border-gray-200 text-xs">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-xs"
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

//         {/* Detail Order Section */}
//         {selectedOrder && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">
//               Order #{selectedOrder.id} ({selectedOrder.orderStatus})
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Customer Name: </span>
//                   {customer.name}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Restaurant Name: </span>
//                   {selectedOrder.restaurantName}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Rider Name: </span>
//                   {selectedOrder.riderName}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Order Date: </span>
//                   {selectedOrder.orderDateTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Restaurant Location: </span>
//                   {selectedOrder.restaurantLocation}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Pickup Time: </span>
//                   {selectedOrder.pickupTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Delivery Time: </span>
//                   {selectedOrder.deliveryTime}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Duration of Order: </span>
//                   {selectedOrder.duration}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Ordered Items: </span>
//                   {selectedOrder.items.length}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <span className="font-semibold">Deals: </span>
//                   {selectedOrder.deals}
//                 </p>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse border border-gray-200 rounded-lg">
//                 <thead>
//                   <tr className="bg-gray-100 text-left text-xs">
//                     <th className="p-2 border border-gray-200">Item Image</th>
//                     <th className="p-2 border border-gray-200">Item Name</th>
//                     <th className="p-2 border border-gray-200">Base Price</th>
//                     <th className="p-2 border border-gray-200">Discount Amount</th>
//                     <th className="p-2 border border-gray-200">Discount %</th>
//                     <th className="p-2 border border-gray-200">Add-ons (order)</th>
//                     <th className="p-2 border border-gray-200">Add-ons Price</th>
//                     <th className="p-2 border border-gray-200">Total</th>
//                     <th className="p-2 border border-gray-200">Description</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedOrder.items.map((item, index) => (
//                     <tr key={`order-item-${index}`} className="border border-gray-200">
//                       <td className="p-2 border border-gray-200 text-xs">
//                         <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full" />
//                       </td>
//                       <td className="p-2 border border-gray-200 text-xs">{item.name}</td>
//                       <td className="p-2 border border-gray-200 text-xs">${item.basePrice}</td>
//                       <td className="p-2 border border-gray-200 text-xs">${item.discountAmount}</td>
//                       <td className="p-2 border border-gray-200 text-xs">{item.discountPercent}%</td>
//                       <td className="p-2 border border-gray-200 text-xs">{item.addOns.join(", ")}</td>
//                       <td className="p-2 border border-gray-200 text-xs">${item.addOnsPrice}</td>
//                       <td className="p-2 border border-gray-200 text-xs">${item.total}</td>
//                       <td className="p-2 border border-gray-200 text-xs">{item.description}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-sm"
//             >
//               Close
//             </button>
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
import { getCustomerById } from "../../api/customers";
import Layout from "../../components/Layout";
import Image from "next/image";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define interfaces for nested data
interface FoodItem {
  name: string;
  price: number;
  image: string;
}

interface LikedFood {
  name: string;
  count: number;
  color: string;
}

interface Order {
  id: string;
  restaurantName: string;
  orderDateTime: string;
  riderName: string;
  orderStatus: string;
  totalAmount: number;
  customerLocation: string;
  restaurantLocation: string;
  deals: number;
  pickupTime: string;
  deliveryTime: string;
  duration: string;
  items: OrderItem[];
}

interface OrderItem {
  image: string;
  name: string;
  basePrice: number;
  discountAmount: number;
  discountPercent: number;
  addOns: string[];
  addOnsPrice: number;
  total: number;
  description: string;
}

interface Customer {
  customerid: string;
  name: string;
  email: string;
  createdat: string;
  orders: number;
  completed: number;
  canceled: number;
  location: string;
  card: string;
  mostOrderedFoods: { [key: string]: FoodItem[] };
  mostLikedFoods: { [key: string]: LikedFood[] };
  orderHistory: Order[];
}

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [period, setPeriod] = useState<"Monthly" | "Weekly" | "Daily">("Monthly");
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
        const response = await getCustomerById(customerId);
        const { data, error } = response;
        if (error) {
          setError(error);
        } else if (data) {
          const idNum = parseInt(customerId.replace(/\D/g, ""), 10) || 1;

          const enhancedData: Customer = {
            ...data,
            customerid: data.customerid || `CUST-${idNum}`,
            mostOrderedFoods: {
              Monthly: [
                { name: "Margherita Pizza", price: 12.99, image: "https://images.unsplash.com/photo-1604382421031-237d9e4626db" },
                { name: "Chicken Alfredo Pasta", price: 15.49, image: "https://images.unsplash.com/photo-1622973536968-3ead4013e40c" },
                { name: "BBQ Chicken Wings", price: 9.99, image: "https://images.unsplash.com/photo-1562967916-eb82221dfb32" },
              ],
              Weekly: [
                { name: "Cheeseburger", price: 8.99, image: "https://images.unsplash.com/photo-1607013407627-6ee914ba3e6b" },
                { name: "Caesar Salad", price: 7.49, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9" },
              ],
              Daily: [
                { name: "Sushi Roll", price: 10.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c" },
              ],
            },
            mostLikedFoods: {
              Monthly: [
                { name: "Pizza", count: 250, color: "#FF6B6B" },
                { name: "Pasta", count: 180, color: "#4ECDC4" },
                { name: "Burger", count: 200, color: "#45B7D1" },
                { name: "Sushi", count: 120, color: "#96CEB4" },
              ],
              Weekly: [
                { name: "Pizza", count: 90, color: "#FF6B6B" },
                { name: "Pasta", count: 70, color: "#4ECDC4" },
                { name: "Burger", count: 80, color: "#45B7D1" },
                { name: "Sushi", count: 50, color: "#96CEB4" },
              ],
              Daily: [
                { name: "Pizza", count: 25, color: "#FF6B6B" },
                { name: "Pasta", count: 20, color: "#4ECDC4" },
                { name: "Burger", count: 30, color: "#45B7D1" },
                { name: "Sushi", count: 15, color: "#96CEB4" },
              ],
            },
            orderHistory: [
              {
                id: `123${idNum}`,
                restaurantName: "Tasty Bistro",
                orderDateTime: "2025-04-20, 12:30 PM",
                riderName: "James Carter",
                orderStatus: "Completed",
                totalAmount: 32.97,
                customerLocation: "123 Main St, NY",
                restaurantLocation: "456 Food Ave, NY",
                deals: 1,
                pickupTime: "12:45 PM",
                deliveryTime: "1:15 PM",
                duration: "45 min",
                items: [
                  {
                    image: "https://images.unsplash.com/photo-1604382421031-237d9e4626db",
                    name: "Margherita Pizza",
                    basePrice: 12.99,
                    discountAmount: 0,
                    discountPercent: 0,
                    addOns: ["Extra Cheese", "Pepperoni"],
                    addOnsPrice: 3.00,
                    total: 15.99,
                    description: "Classic Margherita pizza with fresh basil.",
                  },
                  {
                    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb32",
                    name: "BBQ Chicken Wings",
                    basePrice: 9.99,
                    discountAmount: 1.00,
                    discountPercent: 10,
                    addOns: ["Ranch Dip"],
                    addOnsPrice: 1.00,
                    total: 9.99,
                    description: "Spicy BBQ wings with a tangy sauce.",
                  },
                ],
              },
              {
                id: `123${idNum + 1}`,
                restaurantName: "Sushi Haven",
                orderDateTime: "2025-04-22, 6:00 PM",
                riderName: "Emily Stone",
                orderStatus: "Pending",
                totalAmount: 21.98,
                customerLocation: "123 Main St, NY",
                restaurantLocation: "789 Sushi Rd, NY",
                deals: 2,
                pickupTime: "6:15 PM",
                deliveryTime: "6:45 PM",
                duration: "30 min",
                items: [
                  {
                    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
                    name: "Sushi Roll",
                    basePrice: 10.99,
                    discountAmount: 0,
                    discountPercent: 0,
                    addOns: ["Soy Sauce", "Wasabi"],
                    addOnsPrice: 0,
                    total: 10.99,
                    description: "Fresh sushi roll with tuna and avocado.",
                  },
                ],
              },
            ],
          };
          setCustomer(enhancedData);
        } else {
          setError("Customer not found");
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to fetch customer data");
      }
      setLoading(false);
    }

    fetchCustomer();
  }, [customerId, router]);

  const handleReorder = (order: Order) => {
    alert(`Reordering items from ${order.restaurantName}: ${order.items.map(item => item.name).join(", ")}`);
    // In a real app, this would trigger an API call to reorder the items
  };

  const handleCancelOrder = (order: Order) => {
    alert(`Order #${order.id} has been canceled.`);
    setCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        orderHistory: prev.orderHistory.map(o =>
          o.id === order.id ? { ...o, orderStatus: "Canceled" } : o
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

  const currentLikedFoods = customer.mostLikedFoods[period];
  const totalLikes = currentLikedFoods.reduce((sum, food) => sum + food.count, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Customer Details</h1>
          <button
            onClick={() => router.push("/customers")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Customers
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full mr-4 border-4 border-indigo-200"
            />
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">{customer.name}</h2>
              <p className="text-gray-600">{customer.email}</p>
              <p className="text-gray-600">{customer.location}</p>
              <p className="text-gray-600">Joined: {new Date(customer.createdat).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-gray-600">Customer ID: {customer.customerid}</p>
        </div>

        {/* Most Ordered Food and Most Liked Food */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Most Ordered Food */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Most Ordered Food</h2>
            <div className="flex justify-between mb-4">
              {["Monthly", "Weekly", "Daily"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as "Monthly" | "Weekly" | "Daily")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {customer.mostOrderedFoods[period].length > 0 ? (
              customer.mostOrderedFoods[period].map((food, index) => (
                <div
                  key={`ordered-food-${index}`}
                  className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Image
                    src={food.image}
                    alt={food.name}
                    width={56}
                    height={56}
                    className="rounded-lg mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{food.name}</p>
                    <p className="text-sm text-gray-500">{food.name.split(" ")[1]}</p>
                  </div>
                  <p className="font-semibold text-indigo-600">${food.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No data for this period.</p>
            )}
          </div>

          {/* Most Liked Food with Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Most Liked Food</h2>
            <div className="flex justify-between mb-4">
              {["Monthly", "Weekly", "Daily"].map((p) => (
                <button
                  key={`liked-period-${p}`}
                  onClick={() => setPeriod(p as "Monthly" | "Weekly" | "Daily")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold text-indigo-700">{totalLikes} Likes</p>
              <p className="text-gray-600">
                {period === "Monthly"
                  ? "Mar 1st - Apr 25th, 2025"
                  : period === "Weekly"
                  ? "Apr 18th - Apr 25th, 2025"
                  : "Apr 25th, 2025"}
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentLikedFoods} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Order Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                  <th className="p-3 border border-gray-200">Order #</th>
                  <th className="p-3 border border-gray-200">Restaurant Name</th>
                  <th className="p-3 border border-gray-200">Order Date/Time</th>
                  <th className="p-3 border border-gray-200">Rider Name</th>
                  <th className="p-3 border border-gray-200">Order Status</th>
                  <th className="p-3 border border-gray-200">Total Amount</th>
                  <th className="p-3 border border-gray-200">Customer Location</th>
                  <th className="p-3 border border-gray-200">Restaurant Location</th>
                  <th className="p-3 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customer.orderHistory.map((order) => (
                  <tr
                    key={`order-${order.id}`}
                    className="border border-gray-200 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="p-3 border border-gray-200 text-xs">{order.id}</td>
                    <td className="p-3 border border-gray-200 text-xs">{order.restaurantName}</td>
                    <td className="p-3 border border-gray-200 text-xs">{order.orderDateTime}</td>
                    <td className="p-3 border border-gray-200 text-xs">{order.riderName}</td>
                    <td className="p-3 border border-gray-200 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.orderStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 text-xs">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-200 text-xs">{order.customerLocation}</td>
                    <td className="p-3 border border-gray-200 text-xs">{order.restaurantLocation}</td>
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

        {/* Detail Order Section */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">
              Order #{selectedOrder.id} ({selectedOrder.orderStatus})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Customer Name: </span>
                  {customer.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Restaurant Name: </span>
                  {selectedOrder.restaurantName}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Rider Name: </span>
                  {selectedOrder.riderName}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Order Date: </span>
                  {selectedOrder.orderDateTime}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Restaurant Location: </span>
                  {selectedOrder.restaurantLocation}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Pickup Time: </span>
                  {selectedOrder.pickupTime}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Delivery Time: </span>
                  {selectedOrder.deliveryTime}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Duration of Order: </span>
                  {selectedOrder.duration}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Ordered Items: </span>
                  {selectedOrder.items.length}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-700">Deals: </span>
                  {selectedOrder.deals}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                    <th className="p-3 border border-gray-200">Item Image</th>
                    <th className="p-3 border border-gray-200">Item Name</th>
                    <th className="p-3 border border-gray-200">Base Price</th>
                    <th className="p-3 border border-gray-200">Discount Amount</th>
                    <th className="p-3 border border-gray-200">Discount %</th>
                    <th className="p-3 border border-gray-200">Add-ons (order)</th>
                    <th className="p-3 border border-gray-200">Add-ons Price</th>
                    <th className="p-3 border border-gray-200">Total</th>
                    <th className="p-3 border border-gray-200">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr
                      key={`order-item-${index}`}
                      className="border border-gray-200 hover:bg-indigo-50 transition-colors"
                    >
                      <td className="p-3 border border-gray-200 text-xs">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      </td>
                      <td className="p-3 border border-gray-200 text-xs">{item.name}</td>
                      <td className="p-3 border border-gray-200 text-xs">${item.basePrice.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-xs">${item.discountAmount.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-xs">{item.discountPercent}%</td>
                      <td className="p-3 border border-gray-200 text-xs">{item.addOns.join(", ")}</td>
                      <td className="p-3 border border-gray-200 text-xs">${item.addOnsPrice.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-xs">${item.total.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-xs">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Reorder
              </button>
              {selectedOrder.orderStatus === "Pending" && (
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