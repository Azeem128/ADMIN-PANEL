"use client";
import React from "react";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import RemoteImageRestaurant from "../components/RemoteImages/RemoteImageRestaurant";
import { FaEye, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Assuming Heroicons or similar

export default function RestaurantOwners() {
  const [owners, setOwners] = useState([]);
  const [editOwner, setEditOwner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const { data, error } = await supabase.from("restaurantowners").select("*");
    if (error) {
      console.error("Fetch Error:", error);
      toast.error(`Error fetching owners: ${error.message}`);
    } else {
      setOwners(data || []);
    }
  };

  const handleView = (id: string) => {
    router.push(`/restaurant-owner-detail/${id}`);
  };

  const handleEdit = (id: string) => {
    const owner = owners.find((o) => o.restaurantownerid === id);
    setEditOwner({ ...owner });
  };

  const handleSaveEdit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const { error } = await supabase
      .from("restaurantowners")
      .update({ name, email, updatedat: new Date().toISOString() })
      .eq("restaurantownerid", id);
    if (error) {
      toast.error(`Error updating owner: ${error.message}`);
    } else {
      toast.success("Owner updated successfully!");
      setEditOwner(null);
      fetchOwners();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this owner?")) {
      const { error } = await supabase
        .from("restaurantowners")
        .delete()
        .eq("restaurantownerid", id);
      if (error) {
        toast.error(`Error deleting owner: ${error.message}`);
      } else {
        toast.success("Owner deleted successfully!");
        fetchOwners();
      }
    }
  };

  const handleVerifyToggle = async (id: string, currentVerified: boolean) => {
    const newVerified = !currentVerified;
    const { error } = await supabase
      .from("restaurantowners")
      .update({ VerifiedOwner: newVerified, updatedat: new Date().toISOString() })
      .eq("restaurantownerid", id);
    if (error) {
      toast.error(`Error updating verification: ${error.message}`);
    } else {
      toast.success(newVerified ? "Owner Verified ✅" : "Owner Unverified ❌");
      fetchOwners();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <h3 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-green-600 pb-2">
          Restaurant Owners Management
        </h3>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-600 to-teal-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Owner ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {owners.map((owner: any) => (
                <tr key={owner.restaurantownerid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{owner.restaurantownerid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editOwner?.restaurantownerid === owner.restaurantownerid ? (
                      <form onSubmit={(e) => handleSaveEdit(e, owner.restaurantownerid)} className="space-y-2">
                        <input
                          type="text"
                          name="name"
                          defaultValue={owner.name}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          defaultValue={owner.email}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                          >
                            <FaSave />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditOwner(null)}
                            className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </form>
                    ) : (
                      owner.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editOwner?.restaurantownerid === owner.restaurantownerid ? null : owner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVerifyToggle(owner.restaurantownerid, owner.VerifiedOwner)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ${
                        owner.VerifiedOwner ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      } transition-transform hover:scale-105`}
                    >
                      {owner.VerifiedOwner ? "✓" : "✗"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleView(owner.restaurantownerid)}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-transform hover:scale-105 shadow-sm"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(owner.restaurantownerid)}
                      className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700 transition-transform hover:scale-105 shadow-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(owner.restaurantownerid)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-transform hover:scale-105 shadow-sm"
                    >
                      <FaTrash />
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
}