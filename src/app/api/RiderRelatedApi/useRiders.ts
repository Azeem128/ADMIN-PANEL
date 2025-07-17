import { useState, useEffect } from "react";
import { getAllRiders } from "./Rider";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface Rider {
  riderid: string;
  name: string;
  vehicletype: string | null;
  createdat: string;
  isonline: boolean;
}

interface UseReadRidersResult {
  data: Rider[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useReadRiders = (): UseReadRidersResult => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }: UseQueryResult<Rider[], Error> = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const response = await getAllRiders();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    refetchOnWindowFocus: false, // Prevent refetch on focus
    enabled: true, // Can be toggled based on a condition
  });

  return { data, isLoading, isError, error, refetch };
};