// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";
// import { updateRider } from "../api/RiderRelatedApi/Rider";
// import RiderModal from "../components/RiderModal";

// interface UpdateRiderProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentRider: Rider | null;
//   setCurrentRider: (rider: Rider | null) => void;
//   setLoadingAction: (loading: boolean) => void;
// }

// const UpdateRider = ({ isOpen, onClose, currentRider, setCurrentRider, setLoadingAction }: UpdateRiderProps) => {
//   const handleUpdateRider = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentRider) return;

//     setLoadingAction(true);
//     toast.info("Updating rider...");

//     const form = e.target as HTMLFormElement;
//     const riderData = {
//       name: form.name.value,
//       phone: form.phone.value || null,
//       vehicletype: form.vehicletype.value || null,
//       password: form.password.value || null,
//       cnicfrontimage: form.cnicfrontimage.value || null,
//       cnicbackimage: form.cnicbackimage.value || null,
//       vehilefrontimage: form.vehilefrontimage.value || null,
//       vehilebackimage: form.vehilebackimage.value || null,
//       ridinglicenseimage: form.ridinglicenseimage.value || null,
//       currentlocation: form.currentlocation.value || null,
//       profile_image: form.profile_image.value || null,
//       "Account Verified": form.accountverified.value === "true",
//     };

//     const { error } = await updateRider(currentRider.riderid, riderData);

//     if (error) {
//       toast.error("Failed to update rider: " + error.message);
//     } else {
//       toast.success("Rider updated successfully!");
//       onClose();
//       setCurrentRider(null);
//     }

//     setLoadingAction(false);
//   };

//   return (
//     <RiderModal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Edit Rider"
//       onSubmit={handleUpdateRider}
//       fields={[
//         { name: "name", label: "Name", type: "text", required: true },
//         { name: "phone", label: "Phone", type: "text" },
//         { name: "vehicletype", label: "Vehicle Type", type: "select", options: ["", "Bike", "Car", "Scooter"] },
//         { name: "password", label: "Password", type: "password" },
//         { name: "cnicfrontimage", label: "CNIC Front Image", type: "text" },
//         { name: "cnicbackimage", label: "CNIC Back Image", type: "text" },
//         { name: "vehilefrontimage", label: "Vehicle Front Image", type: "text" },
//         { name: "vehilebackimage", label: "Vehicle Back Image", type: "text" },
//         { name: "ridinglicenseimage", label: "Riding License Image", type: "text" },
//         { name: "currentlocation", label: "Current Location", type: "text" },
//         { name: "profile_image", label: "Profile Image", type: "text" },
//         { name: "accountverified", label: "Account Verified", type: "select", options: ["false", "true"] },
//       ]}
//       rider={currentRider}
//     />
//   );
// };

// export default UpdateRider;

// app/riders/UpdateRider.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { updateRider } from "../api/RiderRelatedApi/Rider";
import RiderModal from "../components/RiderModal";

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
  "Account Verified": boolean;
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
      phone: form.phone.value || null,
      vehicletype: form.vehicletype.value || null,
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
        { name: "phone", label: "Phone", type: "text" },
        { name: "vehicletype", label: "Vehicle Type", type: "select", options: ["", "Bike", "Car", "Scooter"] },
      ]}
      rider={currentRider}
    />
  );
};

export default UpdateRider;