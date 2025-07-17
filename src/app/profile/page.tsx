
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    adminid: "",
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("No authenticated user found");

        setAdmin({
          adminid: user.id,
          name: user.user_metadata?.name || "",
          email: user.email || "",
        });
      } catch (error: any) {
        toast.error(`Failed to fetch admin data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updates: {
        email?: string;
        password?: string;
        data?: { name?: string };
      } = {
        data: { name: admin.name },
      };

      if (newEmail && newEmail !== admin.email) {
        updates.email = newEmail;
      }

      if (newPassword) {
        updates.password = newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setNewEmail("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !admin.adminid) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            <FaSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Image Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <FaUserCircle className="text-gray-400 text-5xl" />
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="font-medium text-gray-700">Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleInputChange}
              className="col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          ) : (
            <span className="col-span-2 p-3">{admin.name || "Not specified"}</span>
          )}
        </div>

        {/* Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="font-medium text-gray-700">Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={newEmail || admin.email}
              onChange={(e) => setNewEmail(e.target.value)}
              className="col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          ) : (
            <span className="col-span-2 p-3">{admin.email}</span>
          )}
        </div>

        {/* Password */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="font-medium text-gray-700">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Leave blank to keep current"
            />
          </div>
        )}

        {/* Cancel Button */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
