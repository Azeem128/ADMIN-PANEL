import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
export const useReadAllOrderStatuses = () => {
  return useQuery({
    queryKey: ["allOrderStatuses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("count_totalorder_by_status");
      if (error) {
        console.error("Error fetching order status data:", error);
        throw new Error(error.message);
      }
      // Map the data to match DashboardData interface
      const formattedData = data.map((item: any) => ({
        status: item.status,
        total: item.total,
        revenue: item.revenue,
      }));
      console.log("Formatted order status data:", formattedData);
      return formattedData;
    },
  });
};