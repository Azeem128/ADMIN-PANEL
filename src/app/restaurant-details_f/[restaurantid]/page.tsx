// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import Layout from "../../components/Layout";

// interface RestaurantItem {
//   itemid: string;
//   restaurantid: string;
//   itemname: string;
//   itemdescription: string | null;
//   baseprice: number;
//   discount: number | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   availablestatus: boolean;
//   itemImages: string[];
//   category: string;
// }

// interface Order {
//   orderid: string;
//   cartid: string;
//   customerid: string;
//   restaurantid: string;
//   status: string;
//   paymentmethod: string;
//   totalamount: number;
//   createdat: string;
//   updatedat: string;
//   riderid: string | null;
// }

// interface Restaurant {
//   restaurantid: string;
//   restaurantownerid: string;
//   restaurantname: string;
//   restaurantlocation: string;
//   starttiming: string | null;
//   endtiming: string | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   restaurantImage: string | null;
//   restaurantitems: RestaurantItem[];
// }

// const RestaurantDetail = () => {
//   const { restaurantid } = useParams();
//   console.log("Route hit with params:", useParams());
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   const [ownerName, setOwnerName] = useState<string | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching restaurant with ID:", restaurantid);
//         const { data, error } = await supabase
//           .from("restaurants")
//           .select(`
//             restaurantid,
//             restaurantownerid,
//             restaurantname,
//             restaurantlocation,
//             starttiming,
//             endtiming,
//             rating,
//             createdat,
//             updatedat,
//             restaurantImage,
//             restaurantitems (
//               itemid,
//               restaurantid,
//               itemname,
//               itemdescription,
//               baseprice,
//               discount,
//               rating,
//               createdat,
//               updatedat,
//               availablestatus,
//               itemImages,
//               category
//             )
//           `)
//           .eq("restaurantid", restaurantid)
//           .single();

//         if (error) {
//           console.error("Supabase error:", error);
//           throw error;
//         }

//         const { data: ownerData } = await supabase
//           .from("restaurantowners")
//           .select("name")
//           .eq("restaurantownerid", data.restaurantownerid)
//           .single();
//         setOwnerName(ownerData?.name || "N/A");

//         const { data: orderData } = await supabase
//           .from("orders")
//           .select("*")
//           .eq("restaurantid", restaurantid)
//           .order("createdat", { ascending: false })
//           .limit(10);
//         setOrders(orderData || []);

//         setRestaurant(data as Restaurant);
//       } catch (err) {
//         console.error("Error fetching restaurant details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (restaurantid) fetchRestaurantDetails();
//   }, [restaurantid]);

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!restaurant) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-red-600">Restaurant not found</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-gray-800">{restaurant.restaurantname} Details</h1>
//           <button
//             onClick={() => router.push("/restaurant-details")}
//             className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back
//           </button>
//         </div>

//         <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-4">
//           <p className="text-sm text-gray-700">Location: {restaurant.restaurantlocation}</p>
//           <p className="text-sm text-gray-700">Hours: {restaurant.starttiming || "N/A"} - {restaurant.endtiming || "N/A"}</p>
//           <p className="text-sm text-gray-700">Owner: {ownerName}</p>
//           <p className="text-sm text-gray-700">Rating: {restaurant.rating || "N/A"}</p>
//           <p className="text-sm text-gray-500">Created: {new Date(restaurant.createdat).toLocaleDateString()}</p>
//           <p className="text-sm text-gray-500">Updated: {new Date(restaurant.updatedat).toLocaleDateString()}</p>
//         </div>

//         <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-4">
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Menu Items</h2>
//           {restaurant.restaurantitems.length > 0 ? (
//             <div className="space-y-2">
//               {restaurant.restaurantitems.map((item) => (
//                 <div key={item.itemid} className="p-2 border-b border-gray-100">
//                   <h3 className="text-md font-semibold text-gray-700">{item.itemname}</h3>
//                   <p className="text-sm text-gray-600">Price: ${(item.baseprice - (item.discount || 0) * item.baseprice / 100).toFixed(2)}</p>
//                   <p className="text-sm text-gray-600">Availability: {item.availablestatus ? "Available" : "Unavailable"}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600">No items available.</p>
//           )}
//         </div>

//         <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Recent Orders</h2>
//           {orders.length > 0 ? (
//             <div className="space-y-2">
//               {orders.map((order) => (
//                 <div key={order.orderid} className="p-2 border-b border-gray-100">
//                   <p className="text-sm text-gray-700">Order ID: {order.orderid}</p>
//                   <p className="text-sm text-gray-700">Status: {order.status}</p>
//                   <p className="text-sm text-gray-700">Total: ${order.totalamount.toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600">No orders yet.</p>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default RestaurantDetail;



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
  itemImages: string[];
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
  restaurantlocation: string;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantImage: string | null;
  business_type: string | null;
  business_category: string | null;
  cuisine: string | null;
  branches: number | null;
  restaurantitems: RestaurantItem[];
}

const RestaurantDetail = () => {
  const { restaurantid } = useParams();
  console.log("Route hit with params:", useParams());
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
        console.log("Fetching restaurant with ID:", restaurantid);
        // Basic select to test connectivity
        const { data: basicData, error: basicError } = await supabase
          .from("restaurants")
          .select("restaurantid, restaurantname, restaurantlocation")
          .eq("restaurantid", restaurantid)
          .single();

        if (basicError) {
          console.error("Basic Supabase error:", basicError, "Details:", JSON.stringify(basicError));
          throw basicError;
        }

        if (!basicData) {
          console.error("No restaurant found for ID:", restaurantid);
          throw new Error("Restaurant not found");
        }

        // Full query with restaurantitems
        const { data, error } = await supabase
          .from("restaurants")
          .select(`
            restaurantid,
            restaurantownerid,
            restaurantname,
            restaurantlocation,
            starttiming,
            endtiming,
            rating,
            createdat,
            updatedat,
            restaurantImage,
            business_type,
            business_category,
            cuisine,
            branches,
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

        if (error) {
          console.error("Full Supabase error:", error, "Details:", JSON.stringify(error));
          throw error;
        }

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
        setFilteredOrders(orderData?.slice(0,10) || []); // Default to 10 recent orders
        setTotalOrders(orderData?.length || 0);
        setTotalRevenue(orderData?.reduce((sum, order) => sum + order.totalamount, 0) || 0);

        setRestaurant(data as Restaurant);
      } catch (err) {
        console.error("Error fetching restaurant details:", err, "Details:", JSON.stringify(err), "Stack:", (err as Error)?.stack);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantid) fetchRestaurantDetails();
  }, [restaurantid]);

  useEffect(() => {
    if (showRecent) {
      setFilteredOrders(allOrders.slice(0, 10)); // Show 10 recent orders
    } else {
      setFilteredOrders(allOrders); // Show all orders
    }
  }, [showRecent, allOrders]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-red-600">Restaurant not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{restaurant.restaurantname} Details</h1>
          <button
            onClick={() => router.push("/restaurant-details")}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back
          </button>
        </div>

        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-4">
          <p className="text-sm text-gray-700">Location: {restaurant.restaurantlocation}</p>
          <p className="text-sm text-gray-700">Hours: {restaurant.starttiming || "N/A"} - {restaurant.endtiming || "N/A"}</p>
          <p className="text-sm text-gray-700">Owner: {ownerName}</p>
          <p className="text-sm text-gray-700">Rating: {restaurant.rating || "N/A"}</p>
          <p className="text-sm text-gray-500">Created: {new Date(restaurant.createdat).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Updated: {new Date(restaurant.updatedat).toLocaleDateString()}</p>
          {restaurant.business_type && <p className="text-sm text-gray-700">Business Type: {restaurant.business_type}</p>}
          {restaurant.business_category && <p className="text-sm text-gray-700">Business Category: {restaurant.business_category}</p>}
          {restaurant.cuisine && <p className="text-sm text-gray-700">Cuisine: {restaurant.cuisine}</p>}
          {restaurant.branches && <p className="text-sm text-gray-700">Branches: {restaurant.branches}</p>}
        </div>

        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Restaurant Stats</h2>
          <p className="text-sm text-gray-700">Total Orders: {totalOrders}</p>
          <p className="text-sm text-gray-700">Total Revenue: ${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Menu Items</h2>
          {restaurant.restaurantitems && restaurant.restaurantitems.length > 0 ? (
            <div className="space-y-2">
              {restaurant.restaurantitems.map((item) => (
                <div key={item.itemid} className="p-2 border-b border-gray-100">
                  <h3 className="text-md font-semibold text-gray-700">{item.itemname}</h3>
                  {item.itemdescription && <p className="text-sm text-gray-600">Description: {item.itemdescription}</p>}
                  <p className="text-sm text-gray-600">Base Price: ${item.baseprice.toFixed(2)}</p>
                  {item.discount && <p className="text-sm text-gray-600">Discount: {item.discount}%</p>}
                  <p className="text-sm text-gray-600">Price: ${(item.baseprice - (item.discount || 0) * item.baseprice / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Availability: {item.availablestatus ? "Available" : "Unavailable"}</p>
                  {item.rating && <p className="text-sm text-gray-600">Rating: {item.rating}</p>}
                  <p className="text-sm text-gray-500">Created: {new Date(item.createdat).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Updated: {new Date(item.updatedat).toLocaleDateString()}</p>
                  {item.itemImages && item.itemImages.length > 0 && (
                    <p className="text-sm text-gray-600">Images: {item.itemImages.join(", ")}</p>
                  )}
                  {item.category && <p className="text-sm text-gray-600">Category: {item.category}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No menu items available.</p>
          )}
        </div>

        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Orders</h2>
            <button
              onClick={() => setShowRecent(!showRecent)}
              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showRecent ? "Show All" : "Show Recent"}
            </button>
          </div>
          {filteredOrders.length > 0 ? (
            <div className="space-y-2">
              {filteredOrders.map((order) => (
                <div key={order.orderid} className="p-2 border-b border-gray-100">
                  <p className="text-sm text-gray-700">Order ID: {order.orderid}</p>
                  <p className="text-sm text-gray-700">Status: {order.status}</p>
                  <p className="text-sm text-gray-700">Payment: {order.paymentmethod}</p>
                  <p className="text-sm text-gray-700">Total: ${order.totalamount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdat).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No orders available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetail;