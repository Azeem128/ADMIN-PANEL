// "use client";

// import { useState, useEffect } from "react";
// import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
// import { supabase } from "@/lib/supabaseClient";
// import { toast } from "react-toastify";
// import Image from "next/image";  // Import the next/image component

// export default function AdminProfilePage() {
//   const [admin, setAdmin] = useState({
//     id: "",
//     username: "",
//     email: "",
//     address: "",
//     profile_image: ""
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch admin data
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         setLoading(true);
//         const { data: { user } } = await supabase.auth.getUser();
        
//         if (!user) {
//           throw new Error("No authenticated user found");
//         }

//         const { data, error } = await supabase
//           .from('admin')
//           .select('*')
//           .eq('id', user.id)
//           .single();

//         if (error) throw error;
//         if (data) setAdmin(data);

//       } catch (error) {
//         toast.error(`Failed to fetch admin data: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin(prev => ({ ...prev, [name]: value }));
//   };

//   // Save updated admin data
//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const { error } = await supabase
//         .from('admin')
//         .update({
//           username: admin.username,
//           address: admin.address,
//           profile_image: admin.profile_image
//         })
//         .eq('id', admin.id);

//       if (error) throw error;
      
//       toast.success("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       toast.error(`Update failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !admin.id) {
//     return <div className="p-4 text-center">Loading profile...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
//         {!isEditing ? (
//           <button 
//             onClick={() => setIsEditing(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             <FaEdit /> Edit Profile
//           </button>
//         ) : (
//           <button 
//             onClick={handleSave}
//             className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             disabled={loading}
//           >
//             <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
//           </button>
//         )}
//       </div>

//       <div className="space-y-4">
//         {/* Profile Image */}
//         <div className="flex items-center gap-4">
//           <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//             {admin.profile_image ? (
//               <img 
//                 src={admin.profile_image} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <FaUserCircle className="text-gray-400 text-4xl" />
//             )}
//           </div>
//           {isEditing && (
//             <input
//               type="text"
//               name="profile_image"
//               value={admin.profile_image}
//               onChange={handleInputChange}
//               placeholder="Image URL"
//               className="flex-1 p-2 border rounded"
//             />
//           )}
//         </div>

//         {/* Username */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <label className="font-medium text-gray-700">Username:</label>
//           {isEditing ? (
//             <input
//               type="text"
//               name="username"
//               value={admin.username}
//               onChange={handleInputChange}
//               className="col-span-2 p-2 border rounded"
//             />
//           ) : (
//             <span className="col-span-2 p-2">{admin.username}</span>
//           )}
//         </div>

//         {/* Email (read-only) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <label className="font-medium text-gray-700">Email:</label>
//           <span className="col-span-2 p-2">{admin.email}</span>
//         </div>

//         {/* Address */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <label className="font-medium text-gray-700">Address:</label>
//           {isEditing ? (
//             <input
//               type="text"
//               name="address"
//               value={admin.address}
//               onChange={handleInputChange}
//               className="col-span-2 p-2 border rounded"
//             />
//           ) : (
//             <span className="col-span-2 p-2">{admin.address || "Not specified"}</span>
//           )}
//         </div>

//         {isEditing && (
//           <button
//             onClick={() => setIsEditing(false)}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import Image from "next/image";  // Import the next/image component
import Error from "next/error";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    id: "",
    username: "",
    email: "",
    address: "",
    profile_image: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No authenticated user found");
        }

        const { data, error } = await supabase
          .from('admin')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setAdmin(data);

      } catch (error: Error) {
        toast.error(`Failed to fetch admin data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

  // Save updated admin data
  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('admin')
        .update({
          username: admin.username,
          address: admin.address,
          profile_image: admin.profile_image
        })
        .eq('id', admin.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: Error) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !admin.id) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {admin.profile_image ? (
              <Image 
                src={admin.profile_image} 
                alt="Profile" 
                width={80} // Set a width for the image
                height={80} // Set a height for the image
                className="object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-4xl" />
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              name="profile_image"
              value={admin.profile_image}
              onChange={handleInputChange}
              placeholder="Image URL"
              className="flex-1 p-2 border rounded"
            />
          )}
        </div>

        {/* Username */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="font-medium text-gray-700">Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={admin.username}
              onChange={handleInputChange}
              className="col-span-2 p-2 border rounded"
            />
          ) : (
            <span className="col-span-2 p-2">{admin.username}</span>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="font-medium text-gray-700">Email:</label>
          <span className="col-span-2 p-2">{admin.email}</span>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="font-medium text-gray-700">Address:</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={admin.address}
              onChange={handleInputChange}
              className="col-span-2 p-2 border rounded"
            />
          ) : (
            <span className="col-span-2 p-2">{admin.address || "Not specified"}</span>
          )}
        </div>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
