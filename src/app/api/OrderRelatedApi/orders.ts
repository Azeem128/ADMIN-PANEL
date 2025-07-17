import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
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
            riderid,
            locationid,
            status,
            paymentmethod,
            totalamount,
            updatedat,
            customers(*),
            restaurants(restaurantname),
            riders(riderid, name),
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
          .order("createdat", { ascending: false });

        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.orderid) {
          query = query.eq("orderid", filters.orderid);
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

        return data as Order[];
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch orders within a date range with granularity and filters for charting
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
        console.log("Calling aggregate_orders with:", { startDate, endDate, granularity }); // Debug
        const { data, error } = await supabase.rpc("aggregate_orders", {
          start_date: startDate,
          end_date: endDate,
          granularity: granularity,
        });

        if (error) {
          throw new Error(error.message);
        }

        console.log("Raw data from aggregate_orders:", data); // Debug
        const chartData: ChartData[] = data.map((item: any) => ({
          name: item.period,
          orderCount: item.order_count,
        }));

        return {
          rawData: [],
          chartData,
          totalOrders: chartData.reduce((sum, item) => sum + item.orderCount, 0),
        };
      } catch (error) {
        console.error("Error fetching orders by range:", error);
        return { rawData: [], chartData: [], totalOrders: 0 };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch order metrics with filters
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
            riderid,
            locationid,
            status,
            paymentmethod,
            totalamount,
            updatedat,
            customers(*),
            restaurants(restaurantname),
            riders(riderid, name),
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
          .order("createdat", { ascending: true });

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
          query = query.eq("orderid", filters.orderid);
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
    staleTime: 5 * 60 * 1000,
  });
};