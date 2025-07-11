// "use client";

// import { useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { addRider } from "../api/RiderRelatedApi/Rider";
// import RiderModal from "../components/RiderModal";

// interface CreateRiderProps {
//   isOpen: boolean;
//   onClose: () => void;
//   setLoadingAction: (loading: boolean) => void;
// }

// const CreateRider = ({ isOpen, onClose, setLoadingAction }: CreateRiderProps) => {
//   const handleAddRider = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingAction(true);
//     toast.info("Adding rider...");

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

//     const { error } = await addRider(riderData);

//     if (error) {
//       toast.error("Failed to add rider: " + error.message);
//     } else {
//       toast.success("Rider added successfully!");
//       onClose();
//       form.reset();
//     }

//     setLoadingAction(false);
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsAddModalOpen(true)}
//         className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mb-6"
//         disabled={loadingAction}
//       >
//         <FaPlus className="mr-2" /> Add Rider
//       </button>
//       <RiderModal
//         isOpen={isOpen}
//         onClose={onClose}
//         title="Add Rider"
//         onSubmit={handleAddRider}
//         fields={[
//           { name: "name", label: "Name", type: "text", required: true },
//           { name: "phone", label: "Phone", type: "text" },
//           { name: "vehicletype", label: "Vehicle Type", type: "select", options: ["", "Bike", "Car", "Scooter"] },
//           { name: "password", label: "Password", type: "password" },
//           { name: "cnicfrontimage", label: "CNIC Front Image", type: "text" },
//           { name: "cnicbackimage", label: "CNIC Back Image", type: "text" },
//           { name: "vehilefrontimage", label: "Vehicle Front Image", type: "text" },
//           { name: "vehilebackimage", label: "Vehicle Back Image", type: "text" },
//           { name: "ridinglicenseimage", label: "Riding License Image", type: "text" },
//           { name: "currentlocation", label: "Current Location", type: "text" },
//           { name: "profile_image", label: "Profile Image", type: "text" },
//           { name: "accountverified", label: "Account Verified", type: "select", options: ["false", "true"] },
//         ]}
//       />
//     </>
//   );
// };

// export default CreateRider;



















"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { addRider } from "../api/RiderRelatedApi/Rider";
import RiderModal from "../components/RiderModal";

interface CreateRiderProps {
  isOpen: boolean;
  onClose: () => void;
  setLoadingAction: (loading: boolean) => void;
  loadingAction: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const CreateRider = ({ isOpen, onClose, setLoadingAction, loadingAction, setIsAddModalOpen }: CreateRiderProps) => {
  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    toast.info("Adding rider...");

    const form = e.target as HTMLFormElement;
    const riderData = {
      name: form.name.value,
      phone: form.phone.value || null,
      vehicletype: form.vehicletype.value || null,
      password: form.password.value || null,
      cnicfrontimage: form.cnicfrontimage.value || null,
      cnicbackimage: form.cnicbackimage.value || null,
      vehilefrontimage: form.vehilefrontimage.value || null,
      vehilebackimage: form.vehilebackimage.value || null,
      ridinglicenseimage: form.ridinglicenseimage.value || null,
      currentlocation: form.currentlocation.value || null,
      profile_image: form.profile_image.value || null,
      "Account Verified": form.accountverified.value === "true",
    };

    const { error } = await addRider(riderData);

    if (error) {
      toast.error("Failed to add rider: " + error.message);
    } else {
      toast.success("Rider added successfully!");
      onClose();
      form.reset();
      setIsAddModalOpen(false); // Use the prop to close
    }

    setLoadingAction(false);
  };

  return (
    <>
      <button
        onClick={() => setIsAddModalOpen(true)} // Use the prop
        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mb-6"
        disabled={loadingAction}
      >
        <FaPlus className="mr-2" /> Add Rider
      </button>
      <RiderModal
        isOpen={isOpen}
        onClose={onClose}
        title="Add Rider"
        onSubmit={handleAddRider}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "phone", label: "Phone", type: "text" },
          { name: "vehicletype", label: "Vehicle Type", type: "select", options: ["", "Bike", "Car", "Scooter"] },
          { name: "password", label: "Password", type: "password" },
          { name: "cnicfrontimage", label: "CNIC Front Image", type: "text" },
          { name: "cnicbackimage", label: "CNIC Back Image", type: "text" },
          { name: "vehilefrontimage", label: "Vehicle Front Image", type: "text" },
          { name: "vehilebackimage", label: "Vehicle Back Image", type: "text" },
          { name: "ridinglicenseimage", label: "Riding License Image", type: "text" },
          { name: "currentlocation", label: "Current Location", type: "text" },
          { name: "profile_image", label: "Profile Image", type: "text" },
          { name: "accountverified", label: "Account Verified", type: "select", options: ["false", "true"] },
        ]}
      />
    </>
  );
};

export default CreateRider;