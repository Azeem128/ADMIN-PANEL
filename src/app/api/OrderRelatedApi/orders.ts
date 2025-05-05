import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useReadAllOrders = () => {

  return useQuery({
    queryKey: ["AllOrders"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select('*, customers(*), restaurants(*)') // Fetch all columns from orders and related tables
          .order("createdat", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        console.log("orders hain ye ", data);

        return data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return null; // or handle the error as needed
      }
    }
  });
};


interface Order {
  id: string;
  createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
  customers: any;
  restaurants: any;
}

interface ChartData {
  name: string; // Time period (e.g., "2024-01-27", "Week 1", "January 2024")
  orderCount: number; // Order count for that period
}

export const useReadAllOrdersRange = (startDate?: string, endDate?: string, granularity: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  return useQuery({
    queryKey: ['OrdersByRange', startDate, endDate, granularity],
    queryFn: async () => {
      try {
        // Build Supabase query
        let query = supabase
          .from('orders')
          .select('*, customers(*), restaurants(*)')
          .order('createdat', { ascending: true });

        // Apply date range filter
        if (startDate) {
          query = query.gte('createdat', startDate);
        }
        if (endDate) {
          query = query.lte('createdat', endDate);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Process data based on granularity
        const chartData: ChartData[] = [];
        const ordersByPeriod: { [key: string]: number } = {};

        data.forEach((order: Order) => {
          const date = new Date(order.createdat);
          let periodKey: string;

          if (granularity === 'daily') {
            // Group by date (YYYY-MM-DD)
            periodKey = date.toISOString().split('T')[0];
          } else if (granularity === 'weekly') {
            // Group by week (Week number within the year)
            const year = date.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
            const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
            periodKey = `${year}-W${weekNumber}`;
          } else {
            // Group by month (e.g., "January 2024")
            periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          }

          ordersByPeriod[periodKey] = (ordersByPeriod[periodKey] || 0) + 1;
        });

        // Generate chart data for all periods in the range
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          let current = new Date(start);
          while (current <= end) {
            let periodKey: string;
            if (granularity === 'daily') {
              periodKey = current.toISOString().split('T')[0];
            } else if (granularity === 'weekly') {
              const year = current.getFullYear();
              const firstDayOfYear = new Date(year, 0, 1);
              const daysOffset = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
              const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
              periodKey = `${year}-W${weekNumber}`;
            } else {
              periodKey = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }

            if (!chartData.some(item => item.name === periodKey)) {
              chartData.push({ name: periodKey, orderCount: ordersByPeriod[periodKey] || 0 });
            }

            // Increment based on granularity
            if (granularity === 'daily') {
              current.setDate(current.getDate() + 1);
            } else if (granularity === 'weekly') {
              current.setDate(current.getDate() + 7);
            } else {
              current.setMonth(current.getMonth() + 1);
            }
          }
        } else {
          // If no date range, just use the periods from the data
          Object.keys(ordersByPeriod).forEach(period => {
            chartData.push({ name: period, orderCount: ordersByPeriod[period] });
          });
        }

        // Sort chart data by period
        chartData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

        return { rawData: data, chartData, totalOrders: data.length };
      } catch (error) {
        console.error('Error fetching orders:', error);
        return { rawData: [], chartData: [], totalOrders: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};



interface Order {
  id: string;
  createdat: string; // Timestamp (e.g., "2024-01-27T10:00:00Z")
  customer_id: string; // Assuming this links to the customers table
  total_amount: number; // Assuming this is the order amount
  customers: any; // Joined customer data
}

interface PieChartData {
  name: string;
  value: number;
}

export const useFetchOrderMetrics = (
  startDate?: string,
  endDate?: string,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  return useQuery({
    queryKey: ['OrderMetrics', startDate, endDate, granularity],
    queryFn: async () => {
      try {
        // Build Supabase query
        let query = supabase
          .from('orders')
          .select('*, customers(*)')
          .order('createdat', { ascending: true });

        // Apply date range filter
        if (startDate) {
          query = query.gte('createdat', startDate);
        }
        if (endDate) {
          query = query.lte('createdat', endDate);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Process data based on granularity
        const periods: { [key: string]: Order[] } = {};
        data.forEach((order: Order) => {
          const date = new Date(order.createdat);
          let periodKey: string;

          if (granularity === 'daily') {
            periodKey = date.toISOString().split('T')[0];
          } else if (granularity === 'weekly') {
            const year = date.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const daysOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
            const weekNumber = Math.ceil((daysOffset + firstDayOfYear.getDay() + 1) / 7);
            periodKey = `${year}-W${weekNumber}`;
          } else {
            periodKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          }

          if (!periods[periodKey]) {
            periods[periodKey] = [];
          }
          periods[periodKey].push(order);
        });

        // Calculate metrics for each period and aggregate
        let totalOrders = 0;
        let totalRevenue = 0;
        const uniqueCustomers = new Set<string>();

        Object.values(periods).forEach((ordersInPeriod) => {
          totalOrders += ordersInPeriod.length;
          ordersInPeriod.forEach((order) => {
            totalRevenue += order.total_amount || 0;
            uniqueCustomers.add(order.customer_id);
          });
        });

        const customerGrowth = uniqueCustomers.size;

        // Format data for pie chart
        const chartData: PieChartData[] = [
          { name: 'Total Orders', value: totalOrders },
          { name: 'Customer Growth', value: customerGrowth },
          { name: 'Total Revenue', value: Math.round(totalRevenue) },
        ];

        return { chartData, totalOrders, customerGrowth, totalRevenue };
      } catch (error) {
        console.error('Error fetching order metrics:', error);
        return {
          chartData: [
            { name: 'Total Orders', value: 0 },
            { name: 'Customer Growth', value: 0 },
            { name: 'Total Revenue', value: 0 },
          ],
          totalOrders: 0,
          customerGrowth: 0,
          totalRevenue: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};