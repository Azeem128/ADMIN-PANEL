// File: /pages/api/DashboardRelatedApi/dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";



export const useReadAllOrderStatuses = () => {
    // const restaurantId = "c0513403-640a-4a83-9acb-6063e5cb9f7c"; // Hardcoded restaurant ID

    // const { user, profile } = useAuth();
    // console.log("User ID:", profile);

    return useQuery({
        queryKey: ["allOrderStatuses"],
        queryFn: async () => {
            
            const { data, error } = await supabase.rpc('count_totalorder_by_status');
            if (error) {
                console.error("Error fetching order status data:", error);
            } else {
                console.log("Order status data:", data);
            }


            // if (error) {
            //   throw new Error(error.message);
            // }

            // if (data && data.length > 0) {
            //   console.log("First status count:", data[0].count);
            // } else {
            //   console.log("No order statuses found.");
            // }

            console.log("Order counts by status: ", data);
            return data;
        },
    });
};

