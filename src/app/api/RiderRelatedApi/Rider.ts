import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Rider {
  riderid: string;
  name: string;
  vehicletype: string | null;
  createdat: string;
  isonline: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Fetch all riders
export const getAllRiders = async (): Promise<ApiResponse<Rider[]>> => {
  try {
    const { data, error } = await supabase
      .from("riders")
      .select("riderid, name, vehicletype, createdat, isonline")
      .order("createdat", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.code, error.message, error.details);
      return { data: null, error: error.message };
    }

    const formattedData: Rider[] = data.map((rider) => ({
      riderid: rider.riderid,
      name: rider.name,
      vehicletype: rider.vehicletype,
      createdat: rider.createdat,
      isonline: rider.isonline ?? false, // Use nullish coalescing for clarity
    }));

    return { data: formattedData, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: (err as Error).message };
  }
};

// Add a new rider
export const addRider = async (riderData: {
  name: string;
  vehicletype: string | null;
  isonline?: boolean;
}): Promise<ApiResponse<Rider>> => {
  if (!riderData.name.trim()) {
    return { data: null, error: "Name is required" };
  }

  try {
    const { data, error } = await supabase
      .from("riders")
      .insert({
        name: riderData.name,
        vehicletype: riderData.vehicletype || null,
        createdat: new Date().toISOString(),
        isonline: riderData.isonline ?? false,
      })
      .select("riderid, name, vehicletype, createdat, isonline")
      .single();

    if (error) {
      console.error("Supabase error:", error.code, error.message, error.details);
      return { data: null, error: error.message };
    }

    return { data: data as Rider, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: (err as Error).message };
  }
};

// Update a rider
export const updateRider = async (
  riderId: string,
  riderData: { name: string; vehicletype: string | null; isonline?: boolean }
): Promise<ApiResponse<Rider>> => {
  if (!riderData.name.trim()) {
    return { data: null, error: "Name is required" };
  }

  try {
    const { data, error } = await supabase
      .from("riders")
      .update({
        name: riderData.name,
        vehicletype: riderData.vehicletype || null,
        isonline: riderData.isonline ?? false,
      })
      .eq("riderid", riderId)
      .select("riderid, name, vehicletype, createdat, isonline")
      .single();

    if (error) {
      console.error("Supabase error:", error.code, error.message, error.details);
      return { data: null, error: error.message };
    }

    return { data: data as Rider, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: (err as Error).message };
  }
};

// Delete a rider
export const deleteRider = async (riderId: string): Promise<ApiResponse<{ riderid: string }>> => {
  try {
    const { error } = await supabase.from("riders").delete().eq("riderid", riderId);

    if (error) {
      console.error("Supabase error:", error.code, error.message, error.details);
      return { data: null, error: error.message };
    }

    return { data: { riderid: riderId }, error: null }; // Return deleted rider ID
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: (err as Error).message };
  }
};