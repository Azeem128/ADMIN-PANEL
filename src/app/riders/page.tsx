// "use client";

// import { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/supabaseClient";
// import { useReadRiders } from "../api/RiderRelatedApi/useRiders";
// import { addRider, updateRider, deleteRider } from "../api/RiderRelatedApi/Rider";
// import Layout from "../components/Layout";

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// const Riders = () => {
//   const { data, isLoading, isError, error } = useReadRiders();
//   const [riders, setRiders] = useState<Rider[]>([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentRider, setCurrentRider] = useState<Rider | null>(null);
//   const [loadingAction, setLoadingAction] = useState(false);

//   useEffect(() => {
//     if (data) {
//       setRiders(data);
//     }

//     // Real-time subscription for riders
//     const subscription = supabase
//       .channel("riders-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "riders" },
//         (payload) => {
//           const newRider = payload.new as Rider;
//           setRiders((prev) => [
//             {
//               riderid: newRider.riderid,
//               name: newRider.name,
//               phone: newRider.phone,
//               vehicletype: newRider.vehicletype,
//               createdat: newRider.createdat,
//             },
//             ...prev,
//           ]);
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "riders" },
//         (payload) => {
//           const updatedRider = payload.new as Rider;
//           setRiders((prev) =>
//             prev.map((rider) =>
//               rider.riderid === updatedRider.riderid
//                 ? {
//                     riderid: updatedRider.riderid,
//                     name: updatedRider.name,
//                     phone: updatedRider.phone,
//                     vehicletype: updatedRider.vehicletype,
//                     createdat: updatedRider.createdat,
//                   }
//                 : rider
//             )
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "riders" },
//         (payload) => {
//           const deletedRiderId = payload.old.riderid;
//           setRiders((prev) => prev.filter((rider) => rider.riderid !== deletedRiderId));
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   const handleAddRider = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingAction(true);
//     toast.info("Adding rider...");

//     const form = e.target as HTMLFormElement;
//     const riderData = {
//       name: form.name.value,
//       phone: form.phone.value || null,
//       vehicletype: form.vehicletype.value || null,
//     };

//     const { data: newRider, error } = await addRider(riderData);

//     if (error) {
//       toast.error("Failed to add rider: " + error);
//     } else {
//       toast.success("Rider added successfully!");
//       setIsAddModalOpen(false);
//       form.reset();
//     }

//     setLoadingAction(false);
//   };

//   const handleEditRider = (rider: Rider) => {
//     setCurrentRider(rider);
//     setIsEditModalOpen(true);
//   };

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
//     };

//     const { data: updatedRider, error } = await updateRider(currentRider.riderid, riderData);

//     if (error) {
//       toast.error("Failed to update rider: " + error);
//     } else {
//       toast.success("Rider updated successfully!");
//       setIsEditModalOpen(false);
//       setCurrentRider(null);
//     }

//     setLoadingAction(false);
//   };

//   const handleDeleteRider = async (riderId: string) => {
//     if (!confirm("Are you sure you want to delete this rider?")) return;

//     setLoadingAction(true);
//     toast.info("Deleting rider...");

//     const { error } = await deleteRider(riderId);

//     if (error) {
//       toast.error("Failed to delete rider: " + error);
//     } else {
//       toast.success("Rider deleted successfully!");
//     }

//     setLoadingAction(false);
//   };

//   const handleViewDetails = (rider: Rider) => {
//     setCurrentRider(rider);
//     setIsViewModalOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">Loading riders...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-red-600">Error: {error?.message}</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!data || riders.length === 0) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-lg text-gray-600">No riders available.</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-blue-900">Riders</h1>
//             {/* <p className="text-sm text-gray-500">Riders</p> */}
//           </div>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
//             disabled={loadingAction}
//           >
//             <FaPlus className="mr-2" /> Add Rider
//           </button>
//         </div>

//         {/* Add Rider Modal */}
//         {isAddModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4 text-blue-900">Add Rider</h2>
//               <form onSubmit={handleAddRider}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
//                   <select
//                     name="vehicletype"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Vehicle Type</option>
//                     <option value="Bike">Bike</option>
//                     <option value="Car">Car</option>
//                     <option value="Scooter">Scooter</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsAddModalOpen(false)}
//                     className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Adding..." : "Add"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Rider Modal */}
//         {isEditModalOpen && currentRider && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4 text-blue-900">Edit Rider</h2>
//               <form onSubmit={handleUpdateRider}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     defaultValue={currentRider.name}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     defaultValue={currentRider.phone || ""}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
//                   <select
//                     name="vehicletype"
//                     defaultValue={currentRider.vehicletype || ""}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Vehicle Type</option>
//                     <option value="Bike">Bike</option>
//                     <option value="Car">Car</option>
//                     <option value="Scooter">Scooter</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditModalOpen(false)}
//                     className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Updating..." : "Update"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Details Modal */}
//         {isViewModalOpen && currentRider && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4 text-blue-900">Rider Details</h2>
//               <div className="space-y-3">
//                 <p><strong>Rider ID:</strong> {currentRider.riderid}</p>
//                 <p><strong>Name:</strong> {currentRider.name}</p>
//                 <p><strong>Phone:</strong> {currentRider.phone || "N/A"}</p>
//                 <p><strong>Vehicle Type:</strong> {currentRider.vehicletype || "N/A"}</p>
//                 <p><strong>Joined At:</strong> {new Date(currentRider.createdat).toLocaleString()}</p>
//               </div>
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => setIsViewModalOpen(false)}
//                   className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Riders Table */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-3 text-blue-900">Rider ID</th>
//                 <th className="p-3 text-blue-900">Name</th>
//                 <th className="p-3 text-blue-900">Phone</th>
//                 <th className="p-3 text-blue-900">Vehicle Type</th>
//                 <th className="p-3 text-blue-900">Joined At</th>
//                 <th className="p-3 text-blue-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {riders.map((rider) => (
//                 <tr key={rider.riderid} className="border-b">
//                   <td className="p-3">{rider.riderid}</td>
//                   <td className="p-3">{rider.name}</td>
//                   <td className="p-3">{rider.phone || "N/A"}</td>
//                   <td className="p-3">{rider.vehicletype || "N/A"}</td>
//                   <td className="p-3">{new Date(rider.createdat).toLocaleString()}</td>
//                   <td className="p-3 flex space-x-2">
//                     <button
//                       onClick={() => handleEditRider(rider)}
//                       className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
//                       disabled={loadingAction}
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteRider(rider.riderid)}
//                       className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
//                       disabled={loadingAction}
//                     >
//                       <FaTrash />
//                     </button>
//                     <button
//                       onClick={() => handleViewDetails(rider)}
//                       className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
//                     >
//                       <FaEye />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Riders;



"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { useReadRiders } from "../api/RiderRelatedApi/useRiders";
import { addRider, updateRider, deleteRider } from "../api/RiderRelatedApi/Rider";
import Layout from "../components/Layout";

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
}

const Riders = () => {
  const { data, isLoading, isError, error } = useReadRiders();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRider, setCurrentRider] = useState<Rider | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (data) {
      setRiders(data);
    }

    // Real-time subscription for riders
    const subscription = supabase
      .channel("riders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "riders" },
        (payload) => {
          const newRider = payload.new as Rider;
          setRiders((prev) => [
            {
              riderid: newRider.riderid,
              name: newRider.name,
              phone: newRider.phone,
              vehicletype: newRider.vehicletype,
              createdat: newRider.createdat,
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "riders" },
        (payload) => {
          const updatedRider = payload.new as Rider;
          setRiders((prev) =>
            prev.map((rider) =>
              rider.riderid === updatedRider.riderid
                ? {
                    riderid: updatedRider.riderid,
                    name: updatedRider.name,
                    phone: updatedRider.phone,
                    vehicletype: updatedRider.vehicletype,
                    createdat: updatedRider.createdat,
                  }
                : rider
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "riders" },
        (payload) => {
          const deletedRiderId = payload.old.riderid;
          setRiders((prev) => prev.filter((rider) => rider.riderid !== deletedRiderId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [data]);

  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    toast.info("Adding rider...");

    const form = e.target as HTMLFormElement;
    const riderData = {
      name: form.name.value,
      phone: form.phone.value || null,
      vehicletype: form.vehicletype.value || null,
    };

    const { error } = await addRider(riderData);

    if (error) {
      toast.error("Failed to add rider: " + error);
    } else {
      toast.success("Rider added successfully!");
      setIsAddModalOpen(false);
      form.reset();
    }

    setLoadingAction(false);
  };

  const handleEditRider = (rider: Rider) => {
    setCurrentRider(rider);
    setIsEditModalOpen(true);
  };

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
      toast.error("Failed to update rider: " + error);
    } else {
      toast.success("Rider updated successfully!");
      setIsEditModalOpen(false);
      setCurrentRider(null);
    }

    setLoadingAction(false);
  };

  const handleDeleteRider = async (riderId: string) => {
    if (!confirm("Are you sure you want to delete this rider?")) return;

    setLoadingAction(true);
    toast.info("Deleting rider...");

    const { error } = await deleteRider(riderId);

    if (error) {
      toast.error("Failed to delete rider: " + error);
    } else {
      toast.success("Rider deleted successfully!");
    }

    setLoadingAction(false);
  };

  const handleViewDetails = (rider: Rider) => {
    setCurrentRider(rider);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading riders...</p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-red-600">Error: {error?.message}</p>
        </div>
      </Layout>
    );
  }

  if (!data || riders.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">No riders available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Riders</h1>
            {/* <p className="text-sm text-gray-500">Riders</p> */}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            disabled={loadingAction}
          >
            <FaPlus className="mr-2" /> Add Rider
          </button>
        </div>

        {/* Add Rider Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Add Rider</h2>
              <form onSubmit={handleAddRider}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    name="vehicletype"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Rider Modal */}
        {isEditModalOpen && currentRider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Edit Rider</h2>
              <form onSubmit={handleUpdateRider}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={currentRider.name}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={currentRider.phone || ""}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    name="vehicletype"
                    defaultValue={currentRider.vehicletype || ""}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {isViewModalOpen && currentRider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Rider Details</h2>
              <div className="space-y-3">
                <p><strong>Rider ID:</strong> {currentRider.riderid}</p>
                <p><strong>Name:</strong> {currentRider.name}</p>
                <p><strong>Phone:</strong> {currentRider.phone || "N/A"}</p>
                <p><strong>Vehicle Type:</strong> {currentRider.vehicletype || "N/A"}</p>
                <p><strong>Joined At:</strong> {new Date(currentRider.createdat).toLocaleString()}</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Riders Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-blue-900">Rider ID</th>
                <th className="p-3 text-blue-900">Name</th>
                <th className="p-3 text-blue-900">Phone</th>
                <th className="p-3 text-blue-900">Vehicle Type</th>
                <th className="p-3 text-blue-900">Joined At</th>
                <th className="p-3 text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider.riderid} className="border-b">
                  <td className="p-3">{rider.riderid}</td>
                  <td className="p-3">{rider.name}</td>
                  <td className="p-3">{rider.phone || "N/A"}</td>
                  <td className="p-3">{rider.vehicletype || "N/A"}</td>
                  <td className="p-3">{new Date(rider.createdat).toLocaleString()}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEditRider(rider)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      disabled={loadingAction}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteRider(rider.riderid)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                      disabled={loadingAction}
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleViewDetails(rider)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Riders;