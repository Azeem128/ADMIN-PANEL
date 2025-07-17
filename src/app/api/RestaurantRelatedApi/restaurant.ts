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
  availablestatus: boolean;
  itemImages: string[];
  category: string;
}

interface Order {
  orderid: string;
  cartid: string;
  customerid: string;
  restaurantid: string;
  status: string;
  paymentmethod: string;
  totalamount: number;
  createdat: string;
  updatedat: string;
  riderid: string | null;
}

interface Restaurant {
  restaurantid: string;
  restaurantownerid: string;
  restaurantname: string;
  restaurant_location_latitude: number;
  restaurant_location_longitude: number;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantimage: string | null;
  restaurantitems: RestaurantItem[];
}

export const fetchRestaurants = async (page: number, restaurantsPerPage: number = 10) => {
  try {
    const { data: restaurantsData, error: fetchError } = await supabase
      .from("restaurants")
      .select(`
        restaurantid,
        restaurantownerid,
        restaurantname,
        restaurant_location_latitude,
        restaurant_location_longitude,
        starttiming,
        endtiming,
        rating,
        createdat,
        updatedat,
        restaurantimage,
        restaurantitems (
          itemid,
          restaurantid,
          itemname,
          itemdescription,
          baseprice,
          discount,
          rating,
          createdat,
          updatedat,
          availablestatus,
          itemImages,
          category
        )
      `)
      .range((page - 1) * restaurantsPerPage, page * restaurantsPerPage - 1)
      .order("createdat", { ascending: false });

    if (fetchError) throw fetchError;

    if (restaurantsData) {
      const ownerIds = [...new Set(restaurantsData.map((r) => r.restaurantownerid))];
      const { data: ownersData } = await supabase
        .from("restaurantowners")
        .select("restaurantownerid, name")
        .in("restaurantownerid", ownerIds);
      const ownerMap = ownersData?.reduce((acc, owner) => {
        acc[owner.restaurantownerid] = owner.name;
        return acc;
      }, {} as { [key: string]: string }) || {};

      const ordersPromises = restaurantsData.map(async (restaurant) => {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurantid", restaurant.restaurantid)
          .order("createdat", { ascending: false })
          .limit(5);
        return { restaurantid: restaurant.restaurantid, orders: orderData || [] };
      });
      const ordersData = await Promise.all(ordersPromises);
      const ordersMap = ordersData.reduce((acc, { restaurantid, orders }) => {
        acc[restaurantid] = orders;
        return acc;
      }, {} as { [key: string]: Order[] });

      return { restaurants: restaurantsData as Restaurant[], owners: ownerMap, orders: ordersMap };
    } else {
      return { restaurants: [], owners: {}, orders: {} };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    throw new Error((err as Error)?.message || "Unknown error");
  }
};

export const addRestaurant = async (restaurantData: {
  restaurantname: string;
  restaurant_location_latitude: number;
  restaurant_location_longitude: number;
  starttiming: string | null;
  endtiming: string | null;
}) => {
  const { data, error } = await supabase
    .from("restaurants")
    .insert(restaurantData)
    .select();
  if (error) throw error;
  return data?.[0];
};

export const updateRestaurant = async (restaurantId: string, restaurantData: any) => {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .update(restaurantData)
      .eq("restaurantid", restaurantId)
      .select();
    if (error) {
      console.error("Update error details:", error);
      throw error;
    }
    return data?.[0];
  } catch (err) {
    console.error("Update failed:", err);
    throw new Error((err as Error)?.message || "Update failed");
  }
};

export const deleteRestaurant = async (restaurantId: string) => {
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("restaurantid", restaurantId);
  if (error) throw error;
};