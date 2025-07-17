"use client";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { deleteRider } from "../api/RiderRelatedApi/Rider";

interface Rider {
  riderid: string;
  name: string;
  vehicletype: string | null;
  createdat: string;
}

interface DeleteRiderProps {
  setLoadingAction: (loading: boolean) => void;
  currentRider: Rider | null;
  setCurrentRider: (riderId: string | null) => void;
}

const DeleteRider = ({ setLoadingAction, currentRider, setCurrentRider }: DeleteRiderProps) => {
  const hasHandledDelete = useRef(false); // Flag to prevent multiple triggers

  const handleDeleteRider = async (riderId: string) => {
    if (hasHandledDelete.current) return; // Prevent re-execution
    if (!confirm("Are you sure you want to delete this rider?")) {
      setCurrentRider(null); // Reset if canceled
      hasHandledDelete.current = false;
      return;
    }

    setLoadingAction(true);
    toast.info("Deleting rider...");

    const { error } = await deleteRider(riderId);

    if (error) {
      toast.error("Failed to delete rider: " + error.message);
    } else {
      toast.success("Rider deleted successfully!");
      setCurrentRider(null); // Reset after success
    }

    setLoadingAction(false);
    hasHandledDelete.current = false; // Reset flag
  };

  useEffect(() => {
    if (currentRider?.riderid && !hasHandledDelete.current) {
      hasHandledDelete.current = true;
      handleDeleteRider(currentRider.riderid);
    }
  }, [currentRider]);

  return null;
};

export default DeleteRider;