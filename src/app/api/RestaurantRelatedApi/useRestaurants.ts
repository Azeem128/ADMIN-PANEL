import { useState, useEffect } from "react";
import { fetchRestaurants } from "./restaurant";

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

export const useReadRestaurants = () => {
  const [data, setData] = useState<Restaurant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { restaurants } = await fetchRestaurants(1); // Initial fetch with page 1
        setData(restaurants);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, isError, error };
};