import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useReadCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_with_orders_view")
        .select("*")
        .order("createdat", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Customers with orders:", data);
      return data;
    },
  });
};
