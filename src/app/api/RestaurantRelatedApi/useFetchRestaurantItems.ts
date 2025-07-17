
import { supabase } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { RestaurantItem } from './restaurantTypes';

export const useFetchRestaurantItems = () => {
  return useQuery({
    queryKey: ['restaurantItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantitems')
        .select(`
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
        `)
        .order('createdat', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as RestaurantItem[];
    },
    staleTime: 5 * 60 * 1000,
  });
};