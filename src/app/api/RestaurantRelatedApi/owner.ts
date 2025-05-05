// import { supabase } from "@/lib/supabaseClient";
// import { useQuery } from "@tanstack/react-query";

// export const useReadRestaurantItems = () => {
  
//     return useQuery({
//       queryKey: ["itemsRestaurant"],
//       queryFn: async () => {
//         const { data, error } = await supabase
//           .from("restaurantitems")
//           .select('*')
//           .order("createdat", { ascending: false });
  
//         if (error) {
//           throw new Error(error.message);
//         }
  
//         console.log("restaurant items hain ye ", data);
  
//         return data;
//       },
//     });
//   };


//   export const useReadRestaurant = () => {
  
//     return useQuery({
//       queryKey: ["Restaurant"],
//       queryFn: async () => {
//         const { data, error } = await supabase
//           .from("restaurants")
//           .select('*')
//           .order("createdat", { ascending: false });
  
//         if (error) {
//           throw new Error(error.message);
//         }
  
//         console.log("restaurant hain ye ", data);
  
//         return data;
//       },
//     });
//   };

import { supabase } from "@/lib/supabaseClient";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
  phone: string | null;
  email: string;
  createdat: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Fetch all restaurant owners
export const getAllRestaurantOwners = async (): Promise<ApiResponse<RestaurantOwner[]>> => {
  try {
    const { data, error } = await supabase
      .from("restaurantowners")
      .select("restaurantownerid, name, phone, email, createdat")
      .order("createdat", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: RestaurantOwner[] = data.map((owner: RestaurantOwner) => ({
      restaurantownerid: owner.restaurantownerid,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      createdat: owner.createdat,
    }));

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Add a new restaurant owner
export const addRestaurantOwner = async (ownerData: {
  name: string;
  phone: string | null;
  email: string;
}): Promise<ApiResponse<RestaurantOwner>> => {
  try {
    const { data, error } = await supabase
      .from("restaurantowners")
      .insert({
        name: ownerData.name,
        phone: ownerData.phone || null,
        email: ownerData.email,
        createdat: new Date().toISOString(),
      })
      .select("restaurantownerid, name, phone, email, createdat")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: RestaurantOwner = {
      restaurantownerid: data.restaurantownerid,
      name: data.name,
      phone: data.phone,
      email: data.email,
      createdat: data.createdat,
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Update a restaurant owner
export const updateRestaurantOwner = async (
  ownerId: string,
  ownerData: { name: string; phone: string | null; email: string }
): Promise<ApiResponse<RestaurantOwner>> => {
  try {
    const { data, error } = await supabase
      .from("restaurantowners")
      .update({
        name: ownerData.name,
        phone: ownerData.phone || null,
        email: ownerData.email,
      })
      .eq("restaurantownerid", ownerId)
      .select("restaurantownerid, name, phone, email, createdat")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: RestaurantOwner = {
      restaurantownerid: data.restaurantownerid,
      name: data.name,
      phone: data.phone,
      email: data.email,
      createdat: data.createdat,
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Delete a restaurant owner
export const deleteRestaurantOwner = async (ownerId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.from("restaurantowners").delete().eq("restaurantownerid", ownerId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};