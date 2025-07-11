import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Restaurant } from './restaurantTypes';

export const useFetchRestaurantById = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
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
          restaurantImage
        `)
        .eq('restaurantid', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Restaurant;
    },
    enabled: !!id && !isNaN(parseInt(id)),
    staleTime: 5 * 60 * 1000,
  });
};