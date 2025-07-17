"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { updateRider } from "../api/RiderRelatedApi/Rider";
import RiderModal from "../components/RiderModal";

interface Rider {
  riderid: string;
  name: string;
  vehicletype: string | null;
  createdat: string;
  isonline: boolean | null;
}

interface UpdateRiderProps {
  isOpen: boolean;
  onClose: () => void;
  currentRider: Rider | null;
  setCurrentRider: (rider: Rider | null) => void;
  setLoadingAction: (loading: boolean) => void;
}

const UpdateRider = ({ isOpen, onClose, currentRider, setCurrentRider, setLoadingAction }: UpdateRiderProps) => {
  const handleUpdateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRider) return;

    setLoadingAction(true);
    toast.info("Updating rider...");

    const form = e.target as HTMLFormElement;
    const riderData = {
      name: form.name.value,
      vehicletype: form.vehicletype.value || null,
      isonline: form.isonline.value === "true", // Convert to boolean
    };

    const { error } = await updateRider(currentRider.riderid, riderData);

    if (error) {
      toast.error("Failed to update rider: " + error.message);
    } else {
      toast.success("Rider updated successfully!");
      onClose();
      setCurrentRider(null);
    }

    setLoadingAction(false);
  };

  return (
    <RiderModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Rider"
      onSubmit={handleUpdateRider}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "vehicletype", label: "Vehicle Type", type: "select", options: ["", "Bike", "Car", "Scooter"] },
        { name: "isonline", label: "Online Status", type: "select", options: ["true", "false"], required: true },
      ]}
      rider={currentRider}
    />
  );
};

export default UpdateRider;