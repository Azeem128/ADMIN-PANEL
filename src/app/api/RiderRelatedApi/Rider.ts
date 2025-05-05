// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// interface ApiResponse<T> {
//   data: T | null;
//   error: string | null;
// }

// // Fetch all riders
// export const getAllRiders = async (): Promise<ApiResponse<Rider[]>> => {
//   try {
//     const { data, error } = await supabase
//       .from("riders")
//       .select("riderid, name, phone, vehicletype, createdat")
//       .order("createdat", { ascending: false });

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     const formattedData: Rider[] = data.map((rider: any) => ({
//       riderid: rider.riderid,
//       name: rider.name,
//       phone: rider.phone,
//       vehicletype: rider.vehicletype,
//       createdat: rider.createdat,
//     }));

//     return { data: formattedData, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Add a new rider
// export const addRider = async (riderData: {
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
// }): Promise<ApiResponse<Rider>> => {
//   try {
//     const { data, error } = await supabase
//       .from("riders")
//       .insert({
//         name: riderData.name,
//         phone: riderData.phone || null,
//         vehicletype: riderData.vehicletype || null,
//         createdat: new Date().toISOString(),
//       })
//       .select("riderid, name, phone, vehicletype, createdat")
//       .single();

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     const formattedData: Rider = {
//       riderid: data.riderid,
//       name: data.name,
//       phone: data.phone,
//       vehicletype: data.vehicletype,
//       createdat: data.createdat,
//     };

//     return { data: formattedData, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Update a rider
// export const updateRider = async (
//   riderId: string,
//   riderData: { name: string; phone: string | null; vehicletype: string | null }
// ): Promise<ApiResponse<Rider>> => {
//   try {
//     const { data, error } = await supabase
//       .from("riders")
//       .update({
//         name: riderData.name,
//         phone: riderData.phone || null,
//         vehicletype: riderData.vehicletype || null,
//       })
//       .eq("riderid", riderId)
//       .select("riderid, name, phone, vehicletype, createdat")
//       .single();

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     const formattedData: Rider = {
//       riderid: data.riderid,
//       name: data.name,
//       phone: data.phone,
//       vehicletype: data.vehicletype,
//       createdat: data.createdat,
//     };

//     return { data: formattedData, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };

// // Delete a rider
// export const deleteRider = async (riderId: string): Promise<ApiResponse<null>> => {
//   try {
//     const { error } = await supabase.from("riders").delete().eq("riderid", riderId);

//     if (error) {
//       return { data: null, error: error.message };
//     }

//     return { data: null, error: null };
//   } catch (err) {
//     return { data: null, error: (err as Error).message };
//   }
// };




import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
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
      .select("riderid, name, phone, vehicletype, createdat")
      .order("createdat", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: Rider[] = data.map((rider: Rider) => ({
      riderid: rider.riderid,
      name: rider.name,
      phone: rider.phone,
      vehicletype: rider.vehicletype,
      createdat: rider.createdat,
    }));

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Add a new rider
export const addRider = async (riderData: {
  name: string;
  phone: string | null;
  vehicletype: string | null;
}): Promise<ApiResponse<Rider>> => {
  try {
    const { data, error } = await supabase
      .from("riders")
      .insert({
        name: riderData.name,
        phone: riderData.phone || null,
        vehicletype: riderData.vehicletype || null,
        createdat: new Date().toISOString(),
      })
      .select("riderid, name, phone, vehicletype, createdat")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: Rider = {
      riderid: data.riderid,
      name: data.name,
      phone: data.phone,
      vehicletype: data.vehicletype,
      createdat: data.createdat,
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Update a rider
export const updateRider = async (
  riderId: string,
  riderData: { name: string; phone: string | null; vehicletype: string | null }
): Promise<ApiResponse<Rider>> => {
  try {
    const { data, error } = await supabase
      .from("riders")
      .update({
        name: riderData.name,
        phone: riderData.phone || null,
        vehicletype: riderData.vehicletype || null,
      })
      .eq("riderid", riderId)
      .select("riderid, name, phone, vehicletype, createdat")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const formattedData: Rider = {
      riderid: data.riderid,
      name: data.name,
      phone: data.phone,
      vehicletype: data.vehicletype,
      createdat: data.createdat,
    };

    return { data: formattedData, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};

// Delete a rider
export const deleteRider = async (riderId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.from("riders").delete().eq("riderid", riderId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
};