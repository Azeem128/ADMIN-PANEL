// import { supabase } from '@/lib/supabaseClient';
// import { useQuery } from '@tanstack/react-query';
// import { FoodItem, RestaurantItem } from './restaurantTypes';

// export const useFetchRestaurantItems = () => {
//   return useQuery({
//     queryKey: ['restaurantItems'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('restaurantitems')
//         .select('*')
//         .order('createdat', { ascending: true });

//       if (error) {
//         throw new Error(error.message);
//       }

//       const mappedData: FoodItem[] = data.map((item: RestaurantItem) => {
//         const finalPrice = item.discount
//           ? item.baseprice - (item.baseprice * item.discount) / 100
//           : item.baseprice;

//         let category = 'Food / Other';
//         if (item.itemname.toLowerCase().includes('noodle')) category = 'Food / Noodle';
//         else if (item.itemname.toLowerCase().includes('burger')) category = 'Food / Burger';
//         else if (item.itemname.toLowerCase().includes('pizza')) category = 'Food / Pizza';
//         else if (item.itemname.toLowerCase().includes('juice') || item.itemname.toLowerCase().includes('sprite'))
//           category = 'Drink / Juice';

//         return {
//           id: item.itemid,
//           name: item.itemname,
//           category,
//           price: `$${finalPrice.toFixed(2)}`,
//           available: item.available,
//           imgSrc: item.itemsImage || 'https://via.placeholder.com/150',
//         };
//       });

//       return mappedData;
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };





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