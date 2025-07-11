// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabaseClient'; // Adjust path if supabaseClient.ts is elsewhere

// export const useFetchRestaurantItemById = (id: string) => {
//   return useQuery({
//     queryKey: ['restaurantItem', id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('restaurantitems')
//         .select('*')
//         .eq('itemid', id)
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (!data) {
//         return null;
//       }

//       const finalPrice = data.discount
//         ? data.baseprice - (data.baseprice * data.discount) / 100
//         : data.baseprice;

//       let category = 'Food / Other';
//       if (data.itemname.toLowerCase().includes('noodle')) category = 'Food / Noodle';
//       else if (data.itemname.toLowerCase().includes('burger')) category = 'Food / Burger';
//       else if (data.itemname.toLowerCase().includes('pizza')) category = 'Food / Pizza';
//       else if (data.itemname.toLowerCase().includes('juice') || data.itemname.toLowerCase().includes('sprite'))
//         category = 'Drink / Juice';

//       return {
//         id: data.itemid,
//         name: data.itemname,
//         category,
//         price: `$${finalPrice.toFixed(2)}`,
//         available: data.available,
//         imgSrc: data.itemsImage || 'https://via.placeholder.com/300',
//         ingredients: data.itemdescription || 'No description available.',
//         nutrition: data.itemdescription || 'No nutrition info available.',
//       };
//     },
//     enabled: !!id && !isNaN(parseInt(id)),
//     staleTime: 5 * 60 * 1000,
//   });
// };


// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabaseClient';
// import { RestaurantItem } from './restaurantTypes';

// export const useFetchRestaurantItemById = (id: string) => {
//   return useQuery({
//     queryKey: ['restaurantItem', id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('restaurantitems')
//         .select(`
//           itemid,
//           restaurantid,
//           itemname,
//           itemdescription,
//           baseprice,
//           availablestatus,
//           discount,
//           rating,
//           createdat,
//           updatedat,
//           itemImages,
//           category
//         `)
//         .eq('itemid', id)
//         .single();

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (!data) {
//         return null;
//       }

//       return data as RestaurantItem;
//     },
//     enabled: !!id && !isNaN(parseInt(id)),
//     staleTime: 5 * 60 * 1000,
//   });
// };

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