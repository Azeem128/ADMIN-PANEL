// import { createClient } from "@supabase/supabase-js";
// import { log } from "console";
// import { toast } from "react-toastify";


// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface RestaurantItem {
//   itemid: string;
//   restaurantid: string;
//   itemname: string;
//   itemdescription: string | null;
//   baseprice: number;
//   discount: number | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   // itemsImage: string | null; // Commented out as per request
//   // itemImages: string | null; // Commented out as per request
// }

// interface RestaurantDeal {
//   dealid: string;
//   restaurantid: string;
//   dealname: string;
//   dealdescription: string | null;
//   baseprice: number;
//   discountpercentage: number | null;
//   startdate: string | null;
//   enddate: string | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   dealitems: { dealitemid: string; itemid: string }[];
// }

// interface Restaurant {
//   restaurantid: string;
//   restaurantownerid: string;
//   restaurantname: string;
//   restaurantlocation: string;
//   starttiming: string | null;
//   endtiming: string | null;
//   rating: number;
//   createdat: string;
//   updatedat: string;
//   restaurantdeals: RestaurantDeal[];
// }

// interface ApiResponse<T> {
//   data: T | null;
//   error: string | null;
// }

// // Fetch all restaurants with their deals and items
// export const getAllRestaurants = async (): Promise<ApiResponse<Restaurant[]>> => {
//   try {
//     const { data, error } = await supabase
//       .from("restaurants")
//       .select(`
//         restaurantid,
//         restaurantownerid,
//         restaurantname,
//         restaurantlocation,
//         starttiming,
//         endtiming,
//         rating,
//         createdat,
//         updatedat
//         `)
//         .order("createdat", { ascending: false });
        
//         // restaurantdeals (
//         //   dealid,
//         //   restaurantid,
//         //   dealname,
//         //   dealdescription,
//         //   baseprice,
//         //   discountpercentage,
//         //   startdate,
//         //   enddate,
//         //   rating,
//         //   createdat,
//         //   updatedat,
//         //   dealitems (
//         //     dealitemid,
//         //     dealid,
//         //     itemid
//         //   )
//         // )
//     if (error) {
//       return { data: null, error: error.message };
//     }

//     console.log("restaurants hain ye ", data);

//     const restaurantsWithItems = await Promise.all(
//       (data as any[]).map(async (restaurant) => {
//         const { data: items, error: itemsError } = await supabase
//           .from("restaurantitems")
//           .select(`
//             itemid,
//             restaurantid,
//             itemname,
//             itemdescription,
//             baseprice,
//             discount,
//             rating,
//             createdat,
//             updatedat
//             `)
//             .eq("restaurantid", restaurant.restaurantid);
            
//             // itemsImage, // Commented out as per request
//             // itemImages // Commented out as per request

//         if (itemsError) {
//           console.error("Error fetching items:", itemsError.message);
//           return { ...restaurant, restaurantitems: [] };
//         }

//         console.log("items hain ye ", items);
//         // Link dealitems to restaurantitems by itemid
//         // const dealsWithItems = restaurant.restaurantdeals.map((deal) => ({
//         //   ...deal,
//         //   dealitems: deal.dealitems.map((di) => {
//         //     const item = items.find((i) => i.itemid === di.itemid);
//         //     return { ...di, item };
//         //   }),
//         // }));

//         //   restaurantdeals: dealsWithItems,
//         return {
//           ...restaurant,
//           restaurantitems: items || [],
//         };
//       })
//     );

//     return { data: restaurantsWithItems, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Add a new restaurant
// export const addRestaurant = async (restaurantData: {
//   restaurantownerid: string;
//   restaurantname: string;
//   restaurantlocation: string;
//   starttiming: string | null;
//   endtiming: string | null;
// }): Promise<ApiResponse<Restaurant>> => {
//   try {
//     const { data, error } = await supabase
//       .from("restaurants")
//       .insert({
//         restaurantownerid: restaurantData.restaurantownerid,
//         restaurantname: restaurantData.restaurantname,
//         restaurantlocation: restaurantData.restaurantlocation,
//         starttiming: restaurantData.starttiming || null,
//         endtiming: restaurantData.endtiming || null,
//         createdat: new Date().toISOString(),
//         updatedat: new Date().toISOString(),
//       })
//       .select(`
//         restaurantid,
//         restaurantownerid,
//         restaurantname,
//         restaurantlocation,
//         starttiming,
//         endtiming,
//         rating,
//         createdat,
//         updatedat,
//         restaurantdeals (
//           dealid,
//           restaurantid,
//           dealname,
//           dealdescription,
//           baseprice,
//           discountpercentage,
//           startdate,
//           enddate,
//           rating,
//           createdat,
//           updatedat,
//           dealitems (
//             dealitemid,
//             dealid,
//             itemid
//           )
//         )
//       `)
//       .single();

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     const { data: items } = await supabase
//       .from("restaurantitems")
//       .select(`
//         itemid,
//         restaurantid,
//         itemname,
//         itemdescription,
//         baseprice,
//         discount,
//         rating,
//         createdat,
//         updatedat
//         // itemsImage, // Commented out as per request
//         // itemImages // Commented out as per request
//       `)
//       .eq("restaurantid", data.restaurantid);

//     const formattedData: Restaurant = {
//       ...data,
//       restaurantitems: items || [],
//     };

//     return { data: formattedData, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Update a restaurant
// export const updateRestaurant = async (
//   restaurantId: string,
//   restaurantData: {
//     restaurantownerid: string;
//     restaurantname: string;
//     restaurantlocation: string;
//     starttiming: string | null;
//     endtiming: string | null;
//   }
// ): Promise<ApiResponse<Restaurant>> => {
//   try {
//     const { data, error } = await supabase
//       .from("restaurants")
//       .update({
//         restaurantownerid: restaurantData.restaurantownerid,
//         restaurantname: restaurantData.restaurantname,
//         restaurantlocation: restaurantData.restaurantlocation,
//         starttiming: restaurantData.starttiming || null,
//         endtiming: restaurantData.endtiming || null,
//         updatedat: new Date().toISOString(),
//       })
//       .eq("restaurantid", restaurantId)
//       .select(`
//         restaurantid,
//         restaurantownerid,
//         restaurantname,
//         restaurantlocation,
//         starttiming,
//         endtiming,
//         rating,
//         createdat,
//         updatedat,
//         restaurantdeals (
//           dealid,
//           restaurantid,
//           dealname,
//           dealdescription,
//           baseprice,
//           discountpercentage,
//           startdate,
//           enddate,
//           rating,
//           createdat,
//           updatedat,
//           dealitems (
//             dealitemid,
//             dealid,
//             itemid
//           )
//         )
//       `)
//       .single();

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     const { data: items } = await supabase
//       .from("restaurantitems")
//       .select(`
//         itemid,
//         restaurantid,
//         itemname,
//         itemdescription,
//         baseprice,
//         discount,
//         rating,
//         createdat,
//         updatedat
//         // itemsImage, // Commented out as per request
//         // itemImages // Commented out as per request
//       `)
//       .eq("restaurantid", restaurantId);

//     const formattedData: Restaurant = {
//       ...data,
//       restaurantitems: items || [],
//     };

//     return { data: formattedData, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Delete a restaurant
// export const deleteRestaurant = async (restaurantId: string): Promise<ApiResponse<null>> => {
//   try {
//     const { error } = await supabase.from("restaurants").delete().eq("restaurantid", restaurantId);

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     return { data: null, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

import { supabase } from "@/lib/supabaseClient";

interface RestaurantItem {
  itemid: string;
  restaurantid: string;
  itemname: string;
  itemdescription: string | null;
  baseprice: number;
  discount: number | null;
  rating: number;
  createdat: string;
  updatedat: string;
  // itemsImage: string | null; // Commented out as per request
  // itemImages: string | null; // Commented out as per request
}

interface RestaurantDeal {
  dealid: string;
  restaurantid: string;
  dealname: string;
  dealdescription: string | null;
  baseprice: number;
  discountpercentage: number | null;
  startdate: string | null;
  enddate: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  dealitems: { dealitemid: string; itemid: string }[];
}

interface Restaurant {
  restaurantid: string;
  restaurantownerid: string;
  restaurantname: string;
  restaurantlocation: string;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantdeals: RestaurantDeal[];
  restaurantitems?: RestaurantItem[]; // Added to match the return type
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Fetch all restaurants with their deals and items
export const getAllRestaurants = async (): Promise<ApiResponse<Restaurant[]>> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        restaurantid,
        restaurantownerid,
        restaurantname,
        restaurantlocation,
        starttiming,
        endtiming,
        rating,
        createdat,
        updatedat
        `)
        .order("createdat", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    console.log("restaurants hain ye ", data);

    const restaurantsWithItems = await Promise.all(
      (data as Restaurant[]).map(async (restaurant) => {
        const { data: items, error: itemsError } = await supabase
          .from("restaurantitems")
          .select(`
            itemid,
            restaurantid,
            itemname,
            itemdescription,
            baseprice,
            discount,
            rating,
            createdat,
            updatedat
            `)
            .eq("restaurantid", restaurant.restaurantid);

        if (itemsError) {
          console.error("Error fetching items:", itemsError.message);
          return { ...restaurant, restaurantitems: [] };
        }

        console.log("items hain ye ", items);
        return {
          ...restaurant,
          restaurantitems: items || [],
        };
      })
    );

    return { data: restaurantsWithItems, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Add a new restaurant
export const addRestaurant = async (restaurantData: {
  restaurantownerid: string;
  restaurantname: string;
  restaurantlocation: string;
  starttiming: string | null;
  endtiming: string | null;
}): Promise<ApiResponse<Restaurant>> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        restaurantownerid: restaurantData.restaurantownerid,
        restaurantname: restaurantData.restaurantname,
        restaurantlocation: restaurantData.restaurantlocation,
        starttiming: restaurantData.starttiming || null,
        endtiming: restaurantData.endtiming || null,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
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
        restaurantdeals (
          dealid,
          restaurantid,
          dealname,
          dealdescription,
          baseprice,
          discountpercentage,
          startdate,
          enddate,
          rating,
          createdat,
          updatedat,
          dealitems (
            dealitemid,
            dealid,
            itemid
          )
        )
      `)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const { data: items } = await supabase
      .from("restaurantitems")
      .select(`
        itemid,
        restaurantid,
        itemname,
        itemdescription,
        baseprice,
        discount,
        rating,
        createdat,
        updatedat
      `)
      .eq("restaurantid", data.restaurantid);

    const formattedData: Restaurant = {
      ...data,
      restaurantitems: items || [],
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Update a restaurant
export const updateRestaurant = async (
  restaurantId: string,
  restaurantData: {
    restaurantownerid: string;
    restaurantname: string;
    restaurantlocation: string;
    starttiming: string | null;
    endtiming: string | null;
  }
): Promise<ApiResponse<Restaurant>> => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .update({
        restaurantownerid: restaurantData.restaurantownerid,
        restaurantname: restaurantData.restaurantname,
        restaurantlocation: restaurantData.restaurantlocation,
        starttiming: restaurantData.starttiming || null,
        endtiming: restaurantData.endtiming || null,
        updatedat: new Date().toISOString(),
      })
      .eq("restaurantid", restaurantId)
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
        restaurantdeals (
          dealid,
          restaurantid,
          dealname,
          dealdescription,
          baseprice,
          discountpercentage,
          startdate,
          enddate,
          rating,
          createdat,
          updatedat,
          dealitems (
            dealitemid,
            dealid,
            itemid
          )
        )
      `)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const { data: items } = await supabase
      .from("restaurantitems")
      .select(`
        itemid,
        restaurantid,
        itemname,
        itemdescription,
        baseprice,
        discount,
        rating,
        createdat,
        updatedat
      `)
      .eq("restaurantid", restaurantId);

    const formattedData: Restaurant = {
      ...data,
      restaurantitems: items || [],
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Delete a restaurant
export const deleteRestaurant = async (restaurantId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.from("restaurants").delete().eq("restaurantid", restaurantId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};