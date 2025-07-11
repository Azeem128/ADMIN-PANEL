
// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
// import Layout from "../components/Layout";
// //import CustomerMap from "../components/CustomerMap"; // Import CustomerMap

// // Dummy Data for Analytics
// const analyticsData = [
//     { month: "Jan", orders: 120, revenue: 2400 },
//     { month: "Feb", orders: 150, revenue: 2800 },
//     { month: "Mar", orders: 180, revenue: 3500 },
//     { month: "Apr", orders: 200, revenue: 4000 },
//     { month: "May", orders: 230, revenue: 4500 },
//     { month: "Jun", orders: 260, revenue: 5000 },
// ];

// const pieData = [
//     { name: "New Customers", value: 400 },
//     { name: "Returning Customers", value: 300 },
//     { name: "Guest Users", value: 200 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// // Trending and Favorite Items Data
// const trendingItems = [
//     { rank: 1, name: "Tuna Soup Spinach with Hummus", orders: 524 },
//     { rank: 2, name: "Chicken Curry Special", orders: 215 },
//     { rank: 3, name: "Italian Pizza Margherita", orders: 120 },
//     { rank: 4, name: "Watermelon Mrs Chocolate Juice with Cucumber", orders: 76 },
//     { rank: 5, name: "Chicken Curry Special with Cucumber", orders: 215 },
// ];

// const favoriteItems = [
//     { name: "Porkin Spicy Pizza with Mango Leaf", orders: 90 },
//     { name: "Chicken Curry Specials with Cucumbers", orders: 75 },
//     { name: "Watermelon Mrs-Chocolate Juice with Cucumber", orders: 60 },
//     { name: "Italian Pizza Pizza with Mozarella", orders: 85 },
//     { name: "Burger Jumbo's Pizza with Tasty Beef Barbeque", orders: 50 },
// ];

// // Analytics Page
// const AnalyticsPage = () => {
//     return (
//         <Layout>
//             <div className="p-6">
//                 <h1 className="text-2xl font-bold mb-4">📊 Analytics Overview</h1>

//                 {/* Layout for the Charts and Items */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">

//                     {/* Customer Map */}
//                     <div className="bg-white p-4 rounded-xl shadow-md">
//                         <h3 className="text-xl font-semibold mb-4">Customer Map</h3>
//                         {/* <CustomerMap /> */}
//                     </div>

//                     {/* Orders & Revenue Chart */}
//                     <div className="bg-white p-4 rounded-xl shadow-md">
//                         <h3 className="text-xl font-semibold mb-4">Orders & Revenue</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={analyticsData}>
//                                 <XAxis dataKey="month" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
//                                 <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* Revenue Growth Chart */}
//                 <div className="bg-white p-4 rounded-xl shadow-md mb-6">
//                     <h3 className="text-xl font-semibold mb-4">Revenue Growth</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={analyticsData}>
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Revenue Growth" />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Customer Distribution Pie Chart */}
//                 <div className="bg-white p-4 rounded-xl shadow-md mb-6">
//                     <h3 className="text-xl font-semibold mb-4">Customer Distribution</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                             <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
//                                 {pieData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                             <Legend />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>

//                 {/* Trending Items Section */}
//                 <div className="bg-white p-4 rounded-xl shadow-md mb-6">
//                     <h3 className="text-xl font-semibold mb-4">Trending Items</h3>
//                     {trendingItems.map((item, index) => (
//                         <div key={index} className="flex justify-between mb-3">
//                             <span className="font-medium">
//                                 #{item.rank} {item.name}
//                             </span>
//                             <span className="font-light text-gray-600">{item.orders} orders</span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Most Favourite Items Section */}
//                 <div className="bg-white p-4 rounded-xl shadow-md mb-6">
//                     <h3 className="text-xl font-semibold mb-4">Most Favourite Items</h3>
//                     {favoriteItems.map((item, index) => (
//                         <div key={index} className="flex justify-between mb-3">
//                             <span className="font-medium">{item.name}</span>
//                             <span className="font-light text-gray-600">{item.orders} orders</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default AnalyticsPage;
// app/analytics/page.tsx
// "use client";

// import { useGetSalesData } from "../api/DashboardRelatedApi/Dashboard";

// export default function AnalyticsPage() {
//   const { data: salesData, isLoading, isError, error } = useGetSalesData('month', '2025-01-01', '2025-12-31');

//   if (isError) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error?.message}</div>;
//   if (isLoading) return <div className="flex items-center justify-center h-screen text-blue-600">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//         <chartjs
//           type="bar"
//           data={{
//             labels: salesData.map((d: any) => d.label),
//             datasets: [{ label: 'Sales', data: salesData.map((d: any) => d.total), backgroundColor: '#10B981' }],
//           }}
//           options={{ scales: { y: { beginAtZero: true } } }}
//         />
//       </div>
//     </div>
//   );
// }