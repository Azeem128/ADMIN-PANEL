// import { supabase } from "@/lib/supabaseClient";
// import { useQuery } from "@tanstack/react-query";


// export const useReadAllOrders = () => {

//   return useQuery({
//     queryKey: ["AllOrders"],
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from("orders")
//           .select('*, customers(*), restaurants(*)') // Fetch all columns from orders and related tables
//           .order("createdat", { ascending: false });

//         if (error) {
//           throw new Error(error.message);
//         }

//         console.log("orders hain ye ", data);

//         return data;
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         return null; // or handle the error as needed
//       }
//     }
//   });
// };


// interface Orders {
//   id: string;
//   createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
//   customers: any;
//   restaurants: any;
// }

// interface ChartData {
//   name: string; // Time period (e.g., "2024-01-27", "Week 1", "January 2024")
//   orderCount: number; // Order count for that period
// }

// export const useReadAllOrdersRange = (startDate?: string, endDate?: string, granularity: 'daily' | 'weekly' | 'monthly' = 'daily') => {
//   return useQuery({
//     queryKey: ['OrdersByRange', startDate, endDate, granularity],
//     queryFn: async () => {
//       try {
//         // Build Supabase query
//         let query = supabase
//           .from('orders')
//           .select('*, customers(*), restaurants(*)')
//           .order('createdat', { ascending: true });

//         // Apply date range filter
//         if (startDate) {
//           query = query.gte('createdat', startDate);
//         }
//         if (endDate) {
//           query = query.lte('createdat', endDate);
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         // Process data based on granularity
//         const chartData: ChartData[] = [];
//         const ordersByPeriod: { [key: string]: number } = {};

//         data.forEach((order: Orders) => {
//           const date = new Date(order.createdat);
//           let periodKey: string;

//           if (granularity === 'daily') {
//             // Group by date (YYYY-MM-DD)
//             periodKey = date.toISOString().split('T')[0];
//           } else if (granularity === 'weekly') {
//             // Group by week (Week number within the year)
//             const year = date.getFullYear();
//             const firstDayOfYear = new Date(year, 0, 1);
//             const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//             const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//             periodKey = `${year}-W${weekNumber}`;
//           } else {
//             // Group by month (e.g., "January 2024")
//             periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           }

//           ordersByPeriod[periodKey] = (ordersByPeriod[periodKey] || 0) + 1;
//         });

//         // Generate chart data for all periods in the range
//         if (startDate && endDate) {
//           const start = new Date(startDate);
//           const end = new Date(endDate);
//           start.setHours(0, 0, 0, 0);
//           end.setHours(23, 59, 59, 999);

//           var current = new Date(start);
//           while (current <= end) {
//             let periodKey: string;
//             if (granularity === 'daily') {
//               periodKey = current.toISOString().split('T')[0];
//             } else if (granularity === 'weekly') {
//               const year = current.getFullYear();
//               const firstDayOfYear = new Date(year, 0, 1);
//               const daysOffset = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//               const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//               periodKey = `${year}-W${weekNumber}`;
//             } else {
//               periodKey = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//             }

//             if (!chartData.some(item => item.name === periodKey)) {
//               chartData.push({ name: periodKey, orderCount: ordersByPeriod[periodKey] || 0 });
//             }

//             // Increment based on granularity
//             if (granularity === 'daily') {
//               current.setDate(current.getDate() + 1);
//             } else if (granularity === 'weekly') {
//               current.setDate(current.getDate() + 7);
//             } else {
//               current.setMonth(current.getMonth() + 1);
//             }
//           }
//         } else {
//           // If no date range, just use the periods from the data
//           Object.keys(ordersByPeriod).forEach(period => {
//             chartData.push({ name: period, orderCount: ordersByPeriod[period] });
//           });
//         }

//         // Sort chart data by period
//         chartData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

//         return { rawData: data, chartData, totalOrders: data.length };
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//         return { rawData: [], chartData: [], totalOrders: 0 };
//       }
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//   });
// };



// interface Order {
//   id: string;
//   createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
//   customer_id: string; // Assuming this links to the customers table
//   total_amount: number; // Assuming this is the order amount
//   customers: any; // Joined customer data
// }

// interface PieChartData {
//   name: string;
//   value: number;
// }

// export const useFetchOrderMetrics = (
//   startDate?: string,
//   endDate?: string,
//   granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
// ) => {
//   return useQuery({
//     queryKey: ['OrderMetrics', startDate, endDate, granularity],
//     queryFn: async () => {
//       try {
//         // Build Supabase query
//         let query = supabase
//           .from('orders')
//           .select('*, customers(*)')
//           .order('createdat', { ascending: true });

//         // Apply date range filter
//         if (startDate) {
//           query = query.gte('createdat', startDate);
//         }
//         if (endDate) {
//           query = query.lte('createdat', endDate);
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         // Process data based on granularity
//         const periods: { [key: string]: Order[] } = {};
//         data.forEach((order: Order) => {
//           const date = new Date(order.createdat);
//           let periodKey: string;

//           if (granularity === 'daily') {
//             periodKey = date.toISOString().split('T')[0];
//           } else if (granularity === 'weekly') {
//             const year = date.getFullYear();
//             const firstDayOfYear = new Date(year, 0, 1);
//             const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//             const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//             periodKey = `${year}-W${weekNumber}`;
//           } else {
//             periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           }

//           if (!periods[periodKey]) {
//             periods[periodKey] = [];
//           }
//           periods[periodKey].push(order);
//         });

//         // Calculate metrics for each period and aggregate
//         let totalOrders = 0;
//         let totalRevenue = 0;
//         const uniqueCustomers = new Set<string>();

//         Object.values(periods).forEach((ordersInPeriod) => {
//           totalOrders += ordersInPeriod.length;
//           ordersInPeriod.forEach((order) => {
//             totalRevenue += order.total_amount || 0;
//             uniqueCustomers.add(order.customer_id);
//           });
//         });

//         const customerGrowth = uniqueCustomers.size;

//         // Format data for pie chart
//         const chartData: PieChartData[] = [
//           { name: 'Total Orders', value: totalOrders },
//           { name: 'Customer Growth', value: customerGrowth },
//           { name: 'Total Revenue', value: Math.round(totalRevenue) },
//         ];

//         return { chartData, totalOrders, customerGrowth, totalRevenue };
//       } catch (error) {
//         console.error('Error fetching order metrics:', error);
//         return {
//           chartData: [
//             { name: 'Total Orders', value: 0 },
//             { name: 'Customer Growth', value: 0 },
//             { name: 'Total Revenue', value: 0 },
//           ],
//           totalOrders: 0,
//           customerGrowth: 0,
//           totalRevenue: 0,
//         };
//       }
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//   });
// };



// import { supabase } from "@/lib/supabaseClient";
// import { useQuery } from "@tanstack/react-query";

// // Interface for Customer data
// interface Customer {
//   id: string;
//   name?: string;
//   email?: string;
//   [key: string]: unknown; // Allow additional fields
// }

// // Interface for Restaurant data
// interface Restaurant {
//   id: string;
//   name?: string;
//   [key: string]: unknown; // Allow additional fields
// }

// export const useReadAllOrders = () => {
//   return useQuery({
//     queryKey: ["AllOrders"],
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from("orders")
//           .select('*, customers(*), restaurants(*)') // Fetch all columns from orders and related tables
//           .order("createdat", { ascending: false });

//         if (error) {
//           throw new Error(error.message);
//         }

//         console.log("orders hain ye ", data);

//         return data;
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         return null; // or handle the error as needed
//       }
//     }
//   });
// };

// interface Orders {
//   id: string;
//   createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
//   customers: Customer;
//   restaurants: Restaurant;
// }

// interface ChartData {
//   name: string; // Time period (e.g., "2024-01-27", "Week 1", "January 2024")
//   orderCount: number; // Order count for that period
// }

// export const useReadAllOrdersRange = (startDate?: string, endDate?: string, granularity: 'daily' | 'weekly' | 'monthly' = 'daily') => {
//   return useQuery({
//     queryKey: ['OrdersByRange', startDate, endDate, granularity],
//     queryFn: async () => {
//       try {
//         // Build Supabase query
//         let query = supabase
//           .from('orders')
//           .select('*, customers(*), restaurants(*)')
//           .order('createdat', { ascending: true });

//         // Apply date range filter
//         if (startDate) {
//           query = query.gte('createdat', startDate);
//         }
//         if (endDate) {
//           query = query.lte('createdat', endDate);
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         // Process data based on granularity
//         const chartData: ChartData[] = [];
//         const ordersByPeriod: { [key: string]: number } = {};

//         data.forEach((order: Orders) => {
//           const date = new Date(order.createdat);
//           let periodKey: string;

//           if (granularity === 'daily') {
//             // Group by date (YYYY-MM-DD)
//             periodKey = date.toISOString().split('T')[0];
//           } else if (granularity === 'weekly') {
//             // Group by week (Week number within the year)
//             const year = date.getFullYear();
//             const firstDayOfYear = new Date(year, 0, 1);
//             const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//             const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//             periodKey = `${year}-W${weekNumber}`;
//           } else {
//             // Group by month (e.g., "January 2024")
//             periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           }

//           ordersByPeriod[periodKey] = (ordersByPeriod[periodKey] || 0) + 1;
//         });

//         // Generate chart data for all periods in the range
//         if (startDate && endDate) {
//           const start = new Date(startDate);
//           const end = new Date(endDate);
//           start.setHours(0, 0, 0, 0);
//           end.setHours(23, 59, 59, 999);

//           const current = new Date(start);
//           while (current <= end) {
//             let periodKey: string;
//             if (granularity === 'daily') {
//               periodKey = current.toISOString().split('T')[0];
//             } else if (granularity === 'weekly') {
//               const year = current.getFullYear();
//               const firstDayOfYear = new Date(year, 0, 1);
//               const daysOffset = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//               const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//               periodKey = `${year}-W${weekNumber}`;
//             } else {
//               periodKey = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//             }

//             if (!chartData.some(item => item.name === periodKey)) {
//               chartData.push({ name: periodKey, orderCount: ordersByPeriod[periodKey] || 0 });
//             }

//             // Increment based on granularity
//             if (granularity === 'daily') {
//               current.setDate(current.getDate() + 1);
//             } else if (granularity === 'weekly') {
//               current.setDate(current.getDate() + 7);
//             } else {
//               current.setMonth(current.getMonth() + 1);
//             }
//           }
//         } else {
//           // If no date range, just use the periods from the data
//           Object.keys(ordersByPeriod).forEach(period => {
//             chartData.push({ name: period, orderCount: ordersByPeriod[period] });
//           });
//         }

//         // Sort chart data by period
//         chartData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

//         return { rawData: data, chartData, totalOrders: data.length };
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//         return { rawData: [], chartData: [], totalOrders: 0 };
//       }
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//   });
// };

// interface Order {
//   id: string;
//   createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
//   customer_id: string; // Assuming this links to the customers table
//   total_amount: number; // Assuming this is the order amount
//   customers: Customer; // Joined customer data
// }

// interface PieChartData {
//   name: string;
//   value: number;
// }

// export const useFetchOrderMetrics = (
//   startDate?: string,
//   endDate?: string,
//   granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
// ) => {
//   return useQuery({
//     queryKey: ['OrderMetrics', startDate, endDate, granularity],
//     queryFn: async () => {
//       try {
//         // Build Supabase query
//         let query = supabase
//           .from('orders')
//           .select('*, customers(*)')
//           .order('createdat', { ascending: true });

//         // Apply date range filter
//         if (startDate) {
//           query = query.gte('createdat', startDate);
//         }
//         if (endDate) {
//           query = query.lte('createdat', endDate);
//         }

//         const { data, error } = await query;

//         if (error) {
//           throw new Error(error.message);
//         }

//         // Process data based on granularity
//         const periods: { [key: string]: Order[] } = {};
//         data.forEach((order: Order) => {
//           const date = new Date(order.createdat);
//           let periodKey: string;

//           if (granularity === 'daily') {
//             periodKey = date.toISOString().split('T')[0];
//           } else if (granularity === 'weekly') {
//             const year = date.getFullYear();
//             const firstDayOfYear = new Date(year, 0, 1);
//             const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
//             const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
//             periodKey = `${year}-W${weekNumber}`;
//           } else {
//             periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//           }

//           if (!periods[periodKey]) {
//             periods[periodKey] = [];
//           }
//           periods[periodKey].push(order);
//         });

//         // Calculate metrics for each period and aggregate
//         let totalOrders = 0;
//         let totalRevenue = 0;
//         const uniqueCustomers = new Set<string>();

//         Object.values(periods).forEach((ordersInPeriod) => {
//           totalOrders += ordersInPeriod.length;
//           ordersInPeriod.forEach((order) => {
//             totalRevenue += order.total_amount || 0;
//             uniqueCustomers.add(order.customer_id);
//           });
//         });

//         const customerGrowth = uniqueCustomers.size;

//         // Format data for pie chart
//         const chartData: PieChartData[] = [
//           { name: 'Total Orders', value: totalOrders },
//           { name: 'Customer Growth', value: customerGrowth },
//           { name: 'Total Revenue', value: Math.round(totalRevenue) },
//         ];

//         return { chartData, totalOrders, customerGrowth, totalRevenue };
//       } catch (error) {
//         console.error('Error fetching order metrics:', error);
//         return {
//           chartData: [
//             { name: 'Total Orders', value: 0 },
//             { name: 'Customer Growth', value: 0 },
//             { name: 'Total Revenue', value: 0 },
//           ],
//           totalOrders: 0,
//           customerGrowth: 0,
//           totalRevenue: 0,
//         };
//       }
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//   });
// };


import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// Interface for Customer data
interface Customer {
  id: string;
  name?: string;
  [key: string]: unknown; // Allow additional fields
}

// Interface for Restaurant data
interface Restaurant {
  id: string;
  restaurantname?: string;
  [key: string]: unknown; // Allow additional fields
}

// Interface for Rider data
interface Rider {
  rider_id: string; // Matches schema
  name?: string;    // Matches schema
  phone?: string;   // Matches schema
  [key: string]: unknown; // Allow additional fields
}

// Interface for Cart data
interface Cart {
  cartid: string;
  totalamount: number;
  createdat: string;
  updatedat: string;
  cartitems: CartItem[];
}

// Interface for CartItem data
interface CartItem {
  cartitemid: string;
  itemid: string;
  quantity: number;
  subtotal: number;
  restaurantitems: {
    itemname: string;
  };
}

export interface Order {
  orderid: string;  // Matches schema (assumed UUID)
  createdat: string;
  customerid: string;
  restaurantid: string;
  status: string;
  paymentmethod: string;
  totalamount: number;
  riderid?: string;
  customers: Customer;
  restaurants: Restaurant | null; // Allow null to handle missing data
  riders?: Rider;
  carts: Cart;
}

// Fetch all orders with filters
export const useReadAllOrders = (filters: {
  status?: string;
  orderid?: string;
  restaurantname?: string;
  startDate?: string;
  endDate?: string;
} = {}) => {
  return useQuery({
    queryKey: ["AllOrders", filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("orders")
          .select(`
            orderid,
            createdat,
            customerid,
            restaurantid,
            status,
            paymentmethod,
            totalamount,
            riderid,
            customers(*),
            restaurants(restaurantname),
            riders(rider_id, name, phone),
            carts(
              cartid,
              totalamount,
              createdat,
              updatedat,
              cartitems(
                cartitemid,
                itemid,
                quantity,
                subtotal,
                restaurantitems(itemname)
              )
            )
          `)
          .order("createdat", { ascending: false })
          .limit(100);

        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.orderid) {
          query = query.eq("orderid", filters.orderid); // Exact match for UUID
        }
        if (filters.restaurantname) {
          query = query.ilike("restaurants.restaurantname", `%${filters.restaurantname}%`);
        }
        if (filters.startDate) {
          query = query.gte("createdat", filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte("createdat", filters.endDate);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        console.log("Fetched orders:", data);
        return data as Order[];
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Fetch orders within a date range with granularity and filters for charting
interface ChartData {
  name: string; // Time period (e.g., "2024-01-27", "Week 1", "January 2024")
  orderCount: number; // Order count for that period
}

export const useReadAllOrdersRange = (
  startDate?: string,
  endDate?: string,
  granularity: "daily" | "weekly" | "monthly" = "daily",
  filters: { status?: string; orderid?: string; restaurantname?: string } = {}
) => {
  return useQuery({
    queryKey: ["OrdersByRange", startDate, endDate, granularity, filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("orders")
          .select(`
            orderid,
            createdat,
            customerid,
            restaurantid,
            status,
            paymentmethod,
            totalamount,
            riderid,
            customers(*),
            restaurants(restaurantname),
            riders(rider_id, name, phone),
            carts(
              cartid,
              totalamount,
              createdat,
              updatedat,
              cartitems(
                cartitemid,
                itemid,
                quantity,
                subtotal,
                restaurantitems(itemname)
              )
            )
          `)
          .order("createdat", { ascending: true })
          .limit(100);

        if (startDate) {
          query = query.gte("createdat", startDate);
        }
        if (endDate) {
          query = query.lte("createdat", endDate);
        }
        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.orderid) {
          query = query.eq("orderid", filters.orderid); // Exact match for UUID
        }
        if (filters.restaurantname) {
          query = query.ilike("restaurants.restaurantname", `%${filters.restaurantname}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const chartData: ChartData[] = [];
        const ordersByPeriod: { [key: string]: number } = {};

        data.forEach((order: Order) => {
          const date = new Date(order.createdat);
          let periodKey: string;

          if (granularity === "daily") {
            periodKey = date.toISOString().split("T")[0];
          } else if (granularity === "weekly") {
            const year = date.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
            const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
            periodKey = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
          } else {
            periodKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          }

          ordersByPeriod[periodKey] = (ordersByPeriod[periodKey] || 0) + 1;
        });

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          let current = new Date(start);
          while (current <= end) {
            let periodKey: string;
            if (granularity === "daily") {
              periodKey = current.toISOString().split("T")[0];
            } else if (granularity === "weekly") {
              const year = current.getFullYear();
              const firstDayOfYear = new Date(year, 0, 1);
              const daysOffset = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
              const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
              periodKey = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
            } else {
              periodKey = current.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            }

            if (!chartData.some((item) => item.name === periodKey)) {
              chartData.push({ name: periodKey, orderCount: ordersByPeriod[periodKey] || 0 });
            }

            if (granularity === "daily") {
              current.setDate(current.getDate() + 1);
            } else if (granularity === "weekly") {
              current.setDate(current.getDate() + 7);
            } else {
              current.setMonth(current.getMonth() + 1);
            }
          }
        } else {
          Object.keys(ordersByPeriod).forEach((period) => {
            chartData.push({ name: period, orderCount: ordersByPeriod[period] });
          });
        }

        chartData.sort((a, b) => {
          const aDate = new Date(a.name);
          const bDate = new Date(b.name);
          return aDate.getTime() - bDate.getTime();
        });

        return { rawData: data, chartData, totalOrders: data.length };
      } catch (error) {
        console.error("Error fetching orders by range:", error);
        return { rawData: [], chartData: [], totalOrders: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Fetch order metrics with filters
interface PieChartData {
  name: string;
  value: number;
}

export const useFetchOrderMetrics = (
  startDate?: string,
  endDate?: string,
  granularity: "daily" | "weekly" | "monthly" = "daily",
  filters: { status?: string; orderid?: string; restaurantname?: string } = {}
) => {
  return useQuery({
    queryKey: ["OrderMetrics", startDate, endDate, granularity, filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("orders")
          .select(`
            orderid,
            createdat,
            customerid,
            restaurantid,
            status,
            paymentmethod,
            totalamount,
            riderid,
            customers(*),
            restaurants(restaurantname),
            riders(rider_id, name, phone),
            carts(
              cartid,
              totalamount,
              createdat,
              updatedat,
              cartitems(
                cartitemid,
                itemid,
                quantity,
                subtotal,
                restaurantitems(itemname)
              )
            )
          `)
          .order("createdat", { ascending: true })
          .limit(100);

        if (startDate) {
          query = query.gte("createdat", startDate);
        }
        if (endDate) {
          query = query.lte("createdat", endDate);
        }
        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.orderid) {
          query = query.eq("orderid", filters.orderid); // Exact match for UUID
        }
        if (filters.restaurantname) {
          query = query.ilike("restaurants.restaurantname", `%${filters.restaurantname}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const periods: { [key: string]: Order[] } = {};
        data.forEach((order: Order) => {
          const date = new Date(order.createdat);
          let periodKey: string;

          if (granularity === "daily") {
            periodKey = date.toISOString().split("T")[0];
          } else if (granularity === "weekly") {
            const year = date.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
            const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
            periodKey = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
          } else {
            periodKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          }

          if (!periods[periodKey]) {
            periods[periodKey] = [];
          }
          periods[periodKey].push(order);
        });

        let totalOrders = 0;
        let totalRevenue = 0;
        const uniqueCustomers = new Set<string>();

        Object.values(periods).forEach((ordersInPeriod) => {
          totalOrders += ordersInPeriod.length;
          ordersInPeriod.forEach((order) => {
            totalRevenue += order.totalamount || 0;
            uniqueCustomers.add(order.customerid);
          });
        });

        const customerGrowth = uniqueCustomers.size;

        const chartData: PieChartData[] = [
          { name: "Total Orders", value: totalOrders },
          { name: "Customer Growth", value: customerGrowth },
          { name: "Total Revenue", value: Math.round(totalRevenue) },
        ];

        return { chartData, totalOrders, customerGrowth, totalRevenue };
      } catch (error) {
        console.error("Error fetching order metrics:", error);
        return {
          chartData: [
            { name: "Total Orders", value: 0 },
            { name: "Customer Growth", value: 0 },
            { name: "Total Revenue", value: 0 },
          ],
          totalOrders: 0,
          customerGrowth: 0,
          totalRevenue: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}