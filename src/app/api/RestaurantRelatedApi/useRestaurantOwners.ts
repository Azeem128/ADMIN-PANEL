

import { useState, useEffect } from "react";
import { getAllRestaurantOwners } from "./owner";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
 
  email: string;
  createdat: string;
  VerifiedOwner: boolean; // Added VerifiedOwner field
}

interface UseReadRestaurantOwnersResult {
  data: RestaurantOwner[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useReadRestaurantOwners = (): UseReadRestaurantOwnersResult => {
  const [data, setData] = useState<RestaurantOwner[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setIsLoading(true);
        const response = await getAllRestaurantOwners();
        if (response.error) {
          throw new Error(response.error);
        }
        // Log the response to debug
        console.log("API Response:", response.data);
        // Ensure data conforms to the updated interface
        const formattedData = response.data.map((owner: any) => ({
          restaurantownerid: owner.restaurantownerid,
          name: owner.name,
        
          email: owner.email,
          createdat: owner.createdat,
          VerifiedOwner: owner.VerifiedOwner || false, // Default to false if undefined
        }));
        setData(formattedData);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, []);

  return { data, isLoading, isError, error };
};