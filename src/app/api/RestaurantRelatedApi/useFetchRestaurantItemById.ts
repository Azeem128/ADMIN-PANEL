
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useFetchRestaurantItemById = (id: string) => {
  return useQuery({
    queryKey: ["restaurantItem", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurantitems")
        .select(`
          itemid,
          itemname,
          itemdescription,
          baseprice,
          discount,
          rating,
          availablestatus,
          createdat,
          updatedat,
          itemImages,
          category,
          restaurants(restaurantname)
        `)
        .eq("itemid", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        restaurantname: data.restaurants?.restaurantname || null,
      };
    },
  });
};