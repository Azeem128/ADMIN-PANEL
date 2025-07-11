
// "use client"; 

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { getAllCustomers } from "../api/customers";

// // Define the Customer interface
// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   createdat: string;
//   noOfOrders: number;
//   lastOrder: string;
//   completedOrders: number;
//   cancelledOrders: number;
//   location: string;
//   totalSpent: number;
// }

// // Define the API response type
// interface ApiResponse {
//   data: Customer[] | null;
//   error: string | null;
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const params = useParams();
//   const customerId = params?.customerid as string;

//   useEffect(() => {
//     async function fetchCustomer(): Promise<void> {
//       if (!customerId) {
//         setError("Customer ID not provided");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       const response: ApiResponse = await getAllCustomers();
//       const { data, error } = response;
//       if (error) {
//         setError(error);
//       } else if (data) {
//         const foundCustomer = data.find((c: Customer) => c.customerid === customerId);
//         if (foundCustomer) {
//           setCustomer(foundCustomer);
//         } else {
//           setError("Customer not found");
//         }
//       }
//       setLoading(false);
//     }

//     fetchCustomer();
//   }, [customerId]);

//   if (loading) {
//     return <p className="text-gray-600">Loading...</p>;
//   }

//   if (error || !customer) {
//     return <p className="text-red-500">{error || "Customer not found"}</p>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <h1 className="text-2xl font-bold mb-6">Customer Detail</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Section */}
//         <div className="col-span-1 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">{customer.name}</h2>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Email:</span> {customer.email}
//           </p>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Location:</span> {customer.location}
//           </p>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Joined:</span>{" "}
//             {new Date(customer.createdat).toLocaleString()}
//           </p>
//         </div>

//         {/* Details Section */}
//         <div className="col-span-2 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">Order Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Customer ID:</span> {customer.customerid}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Total Orders:</span> {customer.noOfOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Last Order:</span> {customer.lastOrder}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Completed Orders:</span>{" "}
//                 {customer.completedOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Cancelled Orders:</span>{" "}
//                 {customer.cancelledOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Total Spent:</span> ${customer.totalSpent}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Placeholder for Future Sections (like "Most Ordered Food" or "Most Liked Food") */}
//       <div className="mt-6 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Additional Information</h2>
//         <p className="text-gray-600">
//           This section can be expanded to include more details such as &quot;Most Ordered Food&quot; or
//           &quot;Most Liked Food&quot; as shown in the design.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CustomerDetail;



"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCustomerById } from "../api/customers";
import Layout from "../components/Layout";
import RemoteImage from "../components/RemoteImages/RemoteImageCustomer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define interfaces
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

interface Customer {
  customerid: string;
  name: string;
  email: string;
  createdat: string;
  location: string;
  profile_image: string | null;
  orderHistory: Order[];
  mostOrderedFoods?: { [key: string]: FoodItem[] };
  mostLikedFoods?: { [key: string]: LikedFood[] };
  noOfOrders?: number;
  totalSpent?: number;
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
          setCustomer(data); // Use real data from API
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
    // Replace with actual API call
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

  const currentLikedFoods = customer.mostLikedFoods?.[period] || [];
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
            {customer.mostOrderedFoods?.[period]?.length > 0 ? (
              customer.mostOrderedFoods[period].map((food, index) => (
                <div
                  key={`ordered-food-${index}`}
                  className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <RemoteImage
                    path={food.image}
                    fallback="/null-icon.png"
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
                    <td className="p-3 border border-gray-200 text-xs">${order.totalAmount.toFixed(2)}</td>
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
                        <RemoteImage
                          path={item.image}
                          fallback="/null-icon.png"
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