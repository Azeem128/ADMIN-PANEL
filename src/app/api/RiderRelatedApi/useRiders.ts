// import { useState, useEffect } from "react";
// import { getAllRiders } from "./Rider";

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// interface UseReadRidersResult {
//   data: Rider[] | null;
//   isLoading: boolean;
//   isError: boolean;
//   error: Error | null;
// }

// export const useReadRiders = (): UseReadRidersResult => {
//   const [data, setData] = useState<Rider[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchRiders = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getAllRiders();
//         if (response.error) {
//           throw new Error(response.error);
//         }
//         setData(response.data);
//       } catch (err) {
//         setIsError(true);
//         setError(err as Error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRiders();
//   }, []);

//   return { data, isLoading, isError, error };
// };

import { useState, useEffect } from "react";
import { getAllRiders } from "./Rider";
import { useQuery } from "@tanstack/react-query";

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
}

interface UseReadRidersResult {
  data: Rider[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useReadRiders = (): UseReadRidersResult => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const response = await getAllRiders();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });

  return { data, isLoading, isError, error };
};
