
// "use client";

// import { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/supabaseClient";
// import { useReadRestaurantOwners } from "../api/RestaurantRelatedApi/useRestaurantOwners";
// import { addRestaurantOwner, updateRestaurantOwner, deleteRestaurantOwner } from "../api/RestaurantRelatedApi/owner";
// import Layout from "../components/Layout";

// interface RestaurantOwner {
//   restaurantownerid: string;
//   name: string;
//   phone: string | null;
//   email: string;
//   createdat: string;
// }

// const RestaurantOwner = () => {
//   const { data, isLoading, isError, error } = useReadRestaurantOwners();
//   const [restaurantOwners, setRestaurantOwners] = useState<RestaurantOwner[]>([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentOwner, setCurrentOwner] = useState<RestaurantOwner | null>(null);
//   const [loadingAction, setLoadingAction] = useState(false);

//   useEffect(() => {
//     if (data) {
//       setRestaurantOwners(data);
//     }

//     const subscription = supabase
//       .channel("restaurantowners-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "restaurantowners" },
//         (payload) => {
//           const newOwner = payload.new as RestaurantOwner;
//           setRestaurantOwners((prev) => [
//             {
//               restaurantownerid: newOwner.restaurantownerid,
//               name: newOwner.name,
//               phone: newOwner.phone,
//               email: newOwner.email,
//               createdat: newOwner.createdat,
//             },
//             ...prev,
//           ]);
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "restaurantowners" },
//         (payload) => {
//           const updatedOwner = payload.new as RestaurantOwner;
//           setRestaurantOwners((prev) =>
//             prev.map((owner) =>
//               owner.restaurantownerid === updatedOwner.restaurantownerid
//                 ? {
//                     restaurantownerid: updatedOwner.restaurantownerid,
//                     name: updatedOwner.name,
//                     phone: updatedOwner.phone,
//                     email: updatedOwner.email,
//                     createdat: updatedOwner.createdat,
//                   }
//                 : owner
//             )
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "restaurantowners" },
//         (payload) => {
//           const deletedOwnerId = payload.old.restaurantownerid;
//           setRestaurantOwners((prev) => prev.filter((owner) => owner.restaurantownerid !== deletedOwnerId));
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   const handleAddOwner = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingAction(true);
//     toast.info("Adding restaurant owner...");

//     const form = e.target as HTMLFormElement;
//     const ownerData = {
//       name: form.name.value,
//       phone: form.phone.value || null,
//       email: form.email.value,
//     };

//     const { error } = await addRestaurantOwner(ownerData);

//     if (error) {
//       toast.error("Failed to add owner: " + error);
//     } else {
//       toast.success("Restaurant owner added successfully!");
//       setIsAddModalOpen(false);
//       form.reset();
//     }

//     setLoadingAction(false);
//   };

//   const handleEditOwner = (owner: RestaurantOwner) => {
//     setCurrentOwner(owner);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateOwner = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentOwner) return;

//     setLoadingAction(true);
//     toast.info("Updating restaurant owner...");

//     const form = e.target as HTMLFormElement;
//     const ownerData = {
//       name: form.name.value,
//       phone: form.phone.value || null,
//       email: form.email.value,
//     };

//     const { error } = await updateRestaurantOwner(currentOwner.restaurantownerid, ownerData);

//     if (error) {
//       toast.error("Failed to update owner: " + error);
//     } else {
//       toast.success("Restaurant owner updated successfully!");
//       setIsEditModalOpen(false);
//       setCurrentOwner(null);
//     }

//     setLoadingAction(false);
//   };

//   const handleDeleteOwner = async (ownerId: string) => {
//     if (!confirm("Are you sure you want to delete this restaurant owner?")) return;

//     setLoadingAction(true);
//     toast.info("Deleting restaurant owner...");

//     const { error } = await deleteRestaurantOwner(ownerId);

//     if (error) {
//       toast.error("Failed to delete owner: " + error);
//     } else {
//       toast.success("Restaurant owner deleted successfully!");
//     }

//     setLoadingAction(false);
//   };

//   const handleViewDetails = (owner: RestaurantOwner) => {
//     setCurrentOwner(owner);
//     setIsViewModalOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-base text-gray-600">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-base text-red-600">Error: {error?.message}</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!data || restaurantOwners.length === 0) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-base text-gray-600">No restaurant owners available.</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-blue-900">Restaurant Owners</h1>
//             {/* <p className="text-xs text-gray-500">Admin Panel > Restaurant Owners</p> */}
//           </div>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="p-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
//             disabled={loadingAction}
//           >
//             <FaPlus className="mr-1 w-4 h-4" /> Add
//           </button>
//         </div>

//         {/* Add Owner Modal */}
//         {isAddModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-4 rounded-lg w-80">
//               <h2 className="text-lg font-bold mb-3 text-blue-900">Add Restaurant Owner</h2>
//               <form onSubmit={handleAddOwner}>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsAddModalOpen(false)}
//                     className="p-1 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//                     disabled={loadingAction}
//                   >
//                     {loadingAction ? "Adding..." : "Add"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Owner Modal */}
//         {isEditModalOpen && currentOwner && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-4 rounded-lg w-80">
//               <h2 className="text-lg font-bold mb-3 text-green-900">Edit Restaurant Owner</h2>
//               <form onSubmit={handleUpdateOwner}>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     defaultValue={currentOwner.name}
//                     required
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     defaultValue={currentOwner.email}
//                     required
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="block text-xs font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     defaultValue={currentOwner.phone || ""}
//                     className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditModalOpen(false)}
//                     className="p-1 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
//                     disabled={loadingAction}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
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
//         {isViewModalOpen && currentOwner && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-4 rounded-lg w-80">
//               <h2 className="text-lg font-bold mb-3 text-blue-900">Owner Details</h2>
//               <div className="space-y-2 text-sm">
//                 <p><strong>ID:</strong> {currentOwner.restaurantownerid}</p>
//                 <p><strong>Name:</strong> {currentOwner.name}</p>
//                 <p><strong>Email:</strong> {currentOwner.email}</p>
//                 <p><strong>Phone:</strong> {currentOwner.phone || "N/A"}</p>
//                 <p><strong>Joined:</strong> {new Date(currentOwner.createdat).toLocaleDateString()}</p>
//               </div>
//               <div className="flex justify-end mt-3">
//                 <button
//                   onClick={() => setIsViewModalOpen(false)}
//                   className="p-1 bg-gray-300Hq rounded-lg hover:bg-gray-400 text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Restaurant Owners Table */}
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-base font-semibold text-blue-900 mb-3">Restaurant Owners List</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="p-2 text-blue-900">Owner ID</th>
//                   <th className="p-2 text-blue-900">Name</th>
//                   <th className="p-2 text-blue-900">Email</th>
//                   <th className="p-2 text-blue-900">Phone</th>
//                   <th className="p-2 text-blue-900">Joined</th>
//                   <th className="p-2 text-blue-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {restaurantOwners.map((owner) => (
//                   <tr key={owner.restaurantownerid} className="border-b">
//                     <td className="p-2">{owner.restaurantownerid.slice(0, 8)}...</td>
//                     <td className="p-2">{owner.name}</td>
//                     <td className="p-2">{owner.email}</td>
//                     <td className="p-2">{owner.phone || "N/A"}</td>
//                     <td className="p-2">{new Date(owner.createdat).toLocaleDateString()}</td>
//                     <td className="p-2 flex space-x-1">
//                       <button
//                         onClick={() => handleEditOwner(owner)}
//                         className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
//                         disabled={loadingAction}
//                       >
//                         <FaEdit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteOwner(owner.restaurantownerid)}
//                         className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
//                         disabled={loadingAction}
//                       >
//                         <FaTrash className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleViewDetails(owner)}
//                         className="p-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
//                       >
//                         <FaEye className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default RestaurantOwner;



"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { useReadRestaurantOwners } from "../api/RestaurantRelatedApi/useRestaurantOwners";
import { updateRestaurantOwner, deleteRestaurantOwner } from "../api/RestaurantRelatedApi/owner";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
  phone: string | null;
  email: string;
  createdat: string;
  VerifiedOwner: boolean; // Ensure this is included
}

const RestaurantOwner = () => {
  const { data, isLoading, isError, error } = useReadRestaurantOwners();
  const [restaurantOwners, setRestaurantOwners] = useState<RestaurantOwner[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<RestaurantOwner | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      console.log("Fetched Data:", data); // Log to debug
      setRestaurantOwners(data);
    }

    const subscription = supabase
      .channel("restaurantowners-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "restaurantowners" },
        (payload) => {
          const newOwner = payload.new as RestaurantOwner;
          setRestaurantOwners((prev) => [
            {
              restaurantownerid: newOwner.restaurantownerid,
              name: newOwner.name,
              phone: newOwner.phone,
              email: newOwner.email,
              createdat: newOwner.createdat,
              VerifiedOwner: newOwner.VerifiedOwner,
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "restaurantowners" },
        (payload) => {
          const updatedOwner = payload.new as RestaurantOwner;
          setRestaurantOwners((prev) =>
            prev.map((owner) =>
              owner.restaurantownerid === updatedOwner.restaurantownerid
                ? {
                    restaurantownerid: updatedOwner.restaurantownerid,
                    name: updatedOwner.name,
                    phone: updatedOwner.phone,
                    email: updatedOwner.email,
                    createdat: updatedOwner.createdat,
                    VerifiedOwner: updatedOwner.VerifiedOwner,
                  }
                : owner
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "restaurantowners" },
        (payload) => {
          const deletedOwnerId = payload.old.restaurantownerid;
          setRestaurantOwners((prev) => prev.filter((owner) => owner.restaurantownerid !== deletedOwnerId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [data]);

  const handleEditOwner = (owner: RestaurantOwner) => {
    setCurrentOwner(owner);
    setIsEditModalOpen(true);
  };

  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOwner) return;

    setLoadingAction(true);
    toast.info("Updating restaurant owner...");

    const form = e.target as HTMLFormElement;
    const ownerData = {
      name: form.name.value,
      phone: form.phone.value || null,
      email: form.email.value,
    };

    const { error } = await updateRestaurantOwner(currentOwner.restaurantownerid, ownerData);

    if (error) {
      toast.error("Failed to update owner: " + error.message);
    } else {
      toast.success("Restaurant owner updated successfully!");
      setIsEditModalOpen(false);
      setCurrentOwner(null);
    }

    setLoadingAction(false);
  };

  const handleDeleteOwner = async (ownerId: string) => {
    if (!confirm("Are you sure you want to delete this restaurant owner?")) return;

    setLoadingAction(true);
    toast.info("Deleting restaurant owner...");

    const { error } = await deleteRestaurantOwner(ownerId);

    if (error) {
      toast.error("Failed to delete owner: " + error.message);
    } else {
      toast.success("Restaurant owner deleted successfully!");
    }

    setLoadingAction(false);
  };

  const handleViewDetails = (ownerId: string) => {
    router.push(`/restaurant-owner-detail/${ownerId}`);
  };

  const handleToggleVerified = async (ownerId: string, currentVerified: boolean) => {
    setLoadingAction(true);
    toast.info("Updating verification status...");
    const newVerified = !currentVerified;
    const { error } = await supabase
      .from("restaurantowners")
      .update({ VerifiedOwner: newVerified, updatedat: new Date().toISOString() })
      .eq("restaurantownerid", ownerId);

    if (error) {
      toast.error("Failed to update verification: " + error.message);
    } else {
      setRestaurantOwners((prev) =>
        prev.map((owner) =>
          owner.restaurantownerid === ownerId ? { ...owner, VerifiedOwner: newVerified } : owner
        )
      );
      toast.success(`Owner ${newVerified ? "verified" : "unverified"} successfully!`);
    }
    setLoadingAction(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-red-600">Error: {error?.message}</p>
        </div>
      </Layout>
    );
  }

  if (!data || restaurantOwners.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-gray-600">No restaurant owners available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-900">Restaurant Owners</h1>
        </div>

        {isEditModalOpen && currentOwner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-80">
              <h2 className="text-lg font-bold mb-3 text-green-900">Edit Restaurant Owner</h2>
              <form onSubmit={handleUpdateOwner}>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={currentOwner.name}
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={currentOwner.email}
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={currentOwner.phone || ""}
                    className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-base font-semibold text-blue-900 mb-3">Restaurant Owners List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-blue-900">Owner ID</th>
                  <th className="p-2 text-blue-900">Name</th>
                  <th className="p-2 text-blue-900">Email</th>
                  <th className="p-2 text-blue-900">Phone</th>
                  <th className="p-2 text-blue-900">Joined</th>
                  <th className="p-2 text-blue-900">Verified</th>
                  <th className="p-2 text-blue-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurantOwners.map((owner) => (
                  <tr key={owner.restaurantownerid} className="border-b">
                    <td className="p-2">{owner.restaurantownerid.slice(0, 8)}...</td>
                    <td className="p-2">{owner.name}</td>
                    <td className="p-2">{owner.email}</td>
                    <td className="p-2">{owner.phone || "N/A"}</td>
                    <td className="p-2">{new Date(owner.createdat).toLocaleDateString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleToggleVerified(owner.restaurantownerid, owner.VerifiedOwner)}
                        className={`p-1 rounded-lg text-white ${
                          owner.VerifiedOwner ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={loadingAction}
                      >
                        {owner.VerifiedOwner ? <FaCheck className="w-4 h-4" /> : <FaTimes className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-2 flex space-x-1">
                      <button
                        onClick={() => handleEditOwner(owner)}
                        className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        disabled={loadingAction}
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOwner(owner.restaurantownerid)}
                        className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                        disabled={loadingAction}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(owner.restaurantownerid)}
                        className="p-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantOwner;