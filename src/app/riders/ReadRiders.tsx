// "use client";

// import { useEffect, useState } from "react";
// import { useReadRiders } from "../api/RiderRelatedApi/useRiders";
// import { supabase } from "@/lib/supabaseClient";
// import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
// import RiderModal from "../components/RiderModal";


// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// interface ReadRidersProps {
//   onEdit: (rider: Rider) => void;
//   onDelete: (riderId: string) => void;
//   onView: (rider: Rider) => void;
//   isViewModalOpen: boolean;
//   setIsViewModalOpen: (open: boolean) => void;
//   loadingAction: boolean;
//   currentRider: Rider | null; // Add currentRider prop
//   setCurrentRider: (rider: Rider | null) => void; // Add setCurrentRider prop
// }

// const ReadRiders = ({ onEdit, onDelete, onView, isViewModalOpen, setIsViewModalOpen, loadingAction, currentRider, setCurrentRider }: ReadRidersProps) => {
//   const { data, isLoading, isError, error } = useReadRiders();
//   const [riders, setRiders] = useState<Rider[]>([]);

//   useEffect(() => {
//     if (data) {
//       setRiders(data);
//     }

//     const subscription = supabase
//       .channel("riders-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "riders" },
//         (payload) => {
//           const newRider = payload.new as Rider;
//           if (newRider.riderid && newRider.name && newRider.createdat) {
//             setRiders((prev) => [
//               {
//                 riderid: newRider.riderid,
//                 name: newRider.name,
//                 phone: newRider.phone,
//                 vehicletype: newRider.vehicletype,
//                 createdat: newRider.createdat,
//               },
//               ...prev,
//             ]);
//           } else {
//             console.error("Invalid INSERT payload:", payload);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "riders" },
//         (payload) => {
//           const updatedRider = payload.new as Rider;
//           if (updatedRider.riderid && updatedRider.name && updatedRider.createdat) {
//             setRiders((prev) =>
//               prev.map((rider) =>
//                 rider.riderid === updatedRider.riderid
//                   ? {
//                       riderid: updatedRider.riderid,
//                       name: updatedRider.name,
//                       phone: updatedRider.phone,
//                       vehicletype: updatedRider.vehicletype,
//                       createdat: updatedRider.createdat,
//                     }
//                   : rider
//               )
//             );
//           } else {
//             console.error("Invalid UPDATE payload:", payload);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "riders" },
//         (payload) => {
//           const deletedRiderId = payload.old.riderid;
//           if (deletedRiderId) {
//             setRiders((prev) => prev.filter((rider) => rider.riderid !== deletedRiderId));
//           } else {
//             console.error("Invalid DELETE payload:", payload);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">Loading riders...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-red-600">Error: {error?.message}</p>
//       </div>
//     );
//   }

//   if (!data || riders.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">No riders available.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="border-b">
//               <th className="p-3 text-blue-900">Rider ID</th>
//               <th className="p-3 text-blue-900">Name</th>
//               <th className="p-3 text-blue-900">Phone</th>
//               <th className="p-3 text-blue-900">Vehicle Type</th>
//               <th className="p-3 text-blue-900">Joined At</th>
//               <th className="p-3 text-blue-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {riders.map((rider) => (
//               <tr key={rider.riderid} className="border-b">
//                 <td className="p-3">{rider.riderid}</td>
//                 <td className="p-3">{rider.name}</td>
//                 <td className="p-3">{rider.phone || "N/A"}</td>
//                 <td className="p-3">{rider.vehicletype || "N/A"}</td>
//                 <td className="p-3">{new Date(rider.createdat).toLocaleString()}</td>
//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => onEdit(rider)}
//                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
//                     disabled={loadingAction}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => onDelete(rider.riderid)}
//                     className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
//                     disabled={loadingAction}
//                   >
//                     <FaTrash />
//                   </button>
//                   <button
//                     onClick={() => onView(rider)}
//                     className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <RiderModal
//         isOpen={isViewModalOpen}
//         onClose={() => setIsViewModalOpen(false)}
//         title="Rider Details"
//         onSubmit={() => {}}
//         fields={[
//           { name: "riderid", label: "Rider ID", type: "text", readonly: true },
//           { name: "name", label: "Name", type: "text", readonly: true },
//           { name: "phone", label: "Phone", type: "text", readonly: true },
//           { name: "vehicletype", label: "Vehicle Type", type: "text", readonly: true },
//           { name: "createdat", label: "Joined At", type: "text", readonly: true },
//         ]}
//         rider={currentRider} // Use the prop directly
//       />
//     </>
//   );
// };

// export default ReadRiders;




// app/riders/ReadRiders.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useReadRiders } from "../api/RiderRelatedApi/useRiders";
// import { supabase } from "@/lib/supabaseClient";
// import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   createdat: string;
// }

// interface ReadRidersProps {
//   onEdit: (rider: Rider) => void;
//   onDelete: (riderId: string) => void;
//   onView: (rider: Rider) => void;
//   isViewModalOpen: boolean;
//   setIsViewModalOpen: (open: boolean) => void;
//   loadingAction: boolean;
//   currentRider: Rider | null;
//   setCurrentRider: (rider: Rider | null) => void;
// }

// const ReadRiders = ({ onEdit, onDelete, isViewModalOpen, setIsViewModalOpen, loadingAction, currentRider, setCurrentRider }: ReadRidersProps) => {
//   const { data, isLoading, isError, error } = useReadRiders();
//   const [riders, setRiders] = useState<Rider[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     if (data) {
//       setRiders(data);
//     }

//     const subscription = supabase
//       .channel("riders-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "riders" },
//         (payload) => {
//           const newRider = payload.new as Rider;
//           if (newRider.riderid && newRider.name && newRider.createdat) {
//             setRiders((prev) => [
//               {
//                 riderid: newRider.riderid,
//                 name: newRider.name,
//                 phone: newRider.phone,
//                 vehicletype: newRider.vehicletype,
//                 createdat: newRider.createdat,
//               },
//               ...prev,
//             ]);
//           } else {
//             console.error("Invalid INSERT payload:", payload);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "riders" },
//         (payload) => {
//           const updatedRider = payload.new as Rider;
//           if (updatedRider.riderid && updatedRider.name && updatedRider.createdat) {
//             setRiders((prev) =>
//               prev.map((rider) =>
//                 rider.riderid === updatedRider.riderid
//                   ? {
//                       riderid: updatedRider.riderid,
//                       name: updatedRider.name,
//                       phone: updatedRider.phone,
//                       vehicletype: updatedRider.vehicletype,
//                       createdat: updatedRider.createdat,
//                     }
//                   : rider
//               )
//             );
//           } else {
//             console.error("Invalid UPDATE payload:", payload);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "riders" },
//         (payload) => {
//           const deletedRiderId = payload.old.riderid;
//           if (deletedRiderId) {
//             setRiders((prev) => prev.filter((rider) => rider.riderid !== deletedRiderId));
//           } else {
//             console.error("Invalid DELETE payload:", payload);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">Loading riders...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-red-600">Error: {error?.message}</p>
//       </div>
//     );
//   }

//   if (!data || riders.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">No riders available.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="border-b">
//               <th className="p-3 text-blue-900">Rider ID</th>
//               <th className="p-3 text-blue-900">Name</th>
//               <th className="p-3 text-blue-900">Phone</th>
//               <th className="p-3 text-blue-900">Vehicle Type</th>
//               <th className="p-3 text-blue-900">Joined At</th>
//               <th className="p-3 text-blue-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {riders.map((rider) => (
//               <tr key={rider.riderid} className="border-b">
//                 <td className="p-3">{rider.riderid}</td>
//                 <td className="p-3">{rider.name}</td>
//                 <td className="p-3">{rider.phone || "N/A"}</td>
//                 <td className="p-3">{rider.vehicletype || "N/A"}</td>
//                 <td className="p-3">{new Date(rider.createdat).toLocaleString()}</td>
//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => onEdit(rider)}
//                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
//                     disabled={loadingAction}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => onDelete(rider.riderid)}
//                     className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
//                     disabled={loadingAction}
//                   >
//                     <FaTrash />
//                   </button>
//                   <button
//                     onClick={() => router.push(`/rider-detail/${rider.riderid}`)}
//                     className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
//                   >
//                     <FaEye />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Removed RiderModal since redirection handles viewing */}
//     </>
//   );
// };

// export default ReadRiders;

// app/riders/ReadRiders.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  createdat: string;
  "Account Verified": boolean | string | null; // Allow flexible types for debugging
}

interface ReadRidersProps {
  onEdit: (rider: Rider) => void;
  onDelete: (riderId: string) => void;
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  loadingAction: boolean;
  currentRider: Rider | null;
  setCurrentRider: (rider: Rider | null) => void;
}

const ReadRiders = ({ onEdit, onDelete, isViewModalOpen, setIsViewModalOpen, loadingAction, currentRider, setCurrentRider }: ReadRidersProps) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRiders() {
      setIsLoading(true);
      try {
        // Direct Supabase call to bypass useReadRiders for debugging
        const { data, error: fetchError } = await supabase
          .from("riders")
          .select("*"); // Ensure all columns are fetched

        if (fetchError) throw fetchError;

        // Debug: Log the raw data
        console.log("Raw fetched data from Supabase:", data);
        setRiders(data.map(rider => ({
          riderid: rider.riderid,
          name: rider.name,
          phone: rider.phone,
          vehicletype: rider.vehicletype,
          createdat: rider.createdat,
          "Account Verified": rider["Account Verified"], // Use raw value without transformation
        })));
      } catch (err: any) {
        console.error("Error fetching riders:", err.message);
        setError("Failed to fetch riders: " + err.message);
      }
      setIsLoading(false);
    }

    fetchRiders();

    const subscription = supabase
      .channel("riders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "riders" },
        (payload) => {
          const newRider = payload.new as Rider;
          console.log("INSERT payload:", newRider);
          setRiders((prev) => [
            {
              riderid: newRider.riderid,
              name: newRider.name,
              phone: newRider.phone,
              vehicletype: newRider.vehicletype,
              createdat: newRider.createdat,
              "Account Verified": newRider["Account Verified"],
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
          console.log("UPDATE payload:", updatedRider);
          setRiders((prev) =>
            prev.map((rider) =>
              rider.riderid === updatedRider.riderid
                ? {
                    riderid: updatedRider.riderid,
                    name: updatedRider.name,
                    phone: updatedRider.phone,
                    vehicletype: updatedRider.vehicletype,
                    createdat: updatedRider.createdat,
                    "Account Verified": updatedRider["Account Verified"],
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading riders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (riders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">No riders available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-blue-900">Rider ID</th>
              <th className="p-3 text-blue-900">Name</th>
              <th className="p-3 text-blue-900">Phone</th>
              <th className="p-3 text-blue-900">Vehicle Type</th>
              <th className="p-3 text-blue-900">Joined At</th>
              <th className="p-3 text-blue-900">Verified</th>
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
                <td className="p-3">
                  {rider["Account Verified"] === true || rider["Account Verified"] === "true" ? "Yes" : "No"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => onEdit(rider)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    disabled={loadingAction}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(rider.riderid)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    disabled={loadingAction}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => router.push(`/rider-detail/${rider.riderid}`)}
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
    </>
  );
};

export default ReadRiders;