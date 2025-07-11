
import { supabase } from "@/lib/supabaseClient";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
  phone: string | null;
  email: string;
  createdat: string;
  VerifiedOwner: boolean; // Added VerifiedOwner field
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
      .select("restaurantownerid, name, phone, email, createdat, VerifiedOwner") // Added VerifiedOwner
      .order("createdat", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: RestaurantOwner[] = data.map((owner: any) => ({
      restaurantownerid: owner.restaurantownerid,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      createdat: owner.createdat,
      VerifiedOwner: owner.VerifiedOwner || false, // Default to false if undefined
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
        VerifiedOwner: false, // Default to false on creation
      })
      .select("restaurantownerid, name, phone, email, createdat, VerifiedOwner") // Added VerifiedOwner
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
      VerifiedOwner: data.VerifiedOwner,
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
      .select("restaurantownerid, name, phone, email, createdat, VerifiedOwner") // Added VerifiedOwner
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
      VerifiedOwner: data.VerifiedOwner,
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