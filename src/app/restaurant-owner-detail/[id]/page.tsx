"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer"; // Adjust path as needed
import { toast } from "react-toastify";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
  phone: string | null;
  email: string;
  createdat: string;
  updatedat: string;
  VerifiedOwner: boolean;
  owner_image: string | null;
}

interface Restaurant {
  restaurantname: string;
}

interface OwnerFile {
  id: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
}

const RestaurantOwnerDetail: React.FC = () => {
  const [owner, setOwner] = useState<RestaurantOwner | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [files, setFiles] = useState<OwnerFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const router = useRouter();
  const params = useParams();
  const ownerId = params?.id as string;

  useEffect(() => {
    async function fetchOwnerDetails() {
      if (!ownerId || ownerId === "undefined") {
        setError("Owner ID not provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch owner details
        const { data, error: ownerError } = await supabase
          .from("restaurantowners")
          .select("restaurantownerid, name, phone, email, createdat, updatedat, VerifiedOwner, owner_image")
          .eq("restaurantownerid", ownerId)
          .single();

        if (ownerError) throw ownerError;

        // Fetch associated restaurants
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("restaurantname")
          .eq("restaurantownerid", ownerId);

        if (restaurantError) throw restaurantError;

        // Fetch associated files
        const { data: fileData, error: fileError } = await supabase
          .from("restaurantowner_files")
          .select("id, file_type, file_path, uploaded_at")
          .eq("restaurantownerid", ownerId);

        if (fileError) throw fileError;

        // Generate public URLs with 'public/' prefix
        const ownerImageUrl = data.owner_image
          ? supabase.storage.from("owner-images").getPublicUrl(`public/${data.owner_image}`).data.publicUrl
          : "/null-icon.png";
        console.log("Generated Owner Image URL:", ownerImageUrl);

        const fileUrls = fileData.map(file =>
          file.file_path
            ? supabase.storage.from("restaurant-owner-cnic").getPublicUrl(`public/${file.file_path}`).data.publicUrl
            : "/null-icon.png"
        );
        console.log("Generated File URLs:", fileUrls);

        setOwner({ ...data, owner_image: ownerImageUrl });
        setRestaurants(restaurantData || []);
        setFiles(fileData.map((file, index) => ({ ...file, file_path: fileUrls[index] })) || []);
      } catch (err: any) {
        console.error("Error fetching owner details:", err.message);
        setError("Failed to fetch owner details: " + err.message);
      }
      setLoading(false);
    }

    fetchOwnerDetails();

    const subscription = supabase
      .channel("restaurantowner-detail-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "restaurantowners" },
        (payload) => {
          const updatedOwner = payload.new as RestaurantOwner;
          if (updatedOwner.restaurantownerid === ownerId) {
            const ownerImageUrl = updatedOwner.owner_image
              ? supabase.storage.from("owner-images").getPublicUrl(`public/${updatedOwner.owner_image}`).data.publicUrl
              : "/null-icon.png";
            setOwner({ ...updatedOwner, owner_image: ownerImageUrl });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [ownerId]);

  const handleVerifyToggle = async () => {
    if (!owner) return;
    setLoadingAction(true);
    toast.info("Updating verification status...");

    const newVerified = !owner.VerifiedOwner;
    const { error } = await supabase
      .from("restaurantowners")
      .update({ VerifiedOwner: newVerified, updatedat: new Date().toISOString() })
      .eq("restaurantownerid", ownerId);

    if (error) {
      toast.error("Failed to update verification: " + error.message);
    } else {
      setOwner(prev => prev ? { ...prev, VerifiedOwner: newVerified } : null);
      toast.success(`Owner ${newVerified ? "verified" : "unverified"} successfully!`);
    }
    setLoadingAction(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !owner) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-red-600">{error || "Owner not found"}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Restaurant Owner Details</h1>
          <button
            onClick={() => router.push("/restaurant-owners")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Owners
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <RemoteImage
              path={owner.owner_image}
              fallback="/null-icon.png"
              alt={`Profile of ${owner.name}`}
              width={80}
              height={80}
              className="rounded-full mr-4 border-4 border-blue-200"
              onError={() => console.log("Failed to load owner image:", owner.owner_image)}
            />
            <div>
              <h2 className="text-2xl font-bold text-blue-900">{owner.name}</h2>
              <p className="text-gray-600">Email: {owner.email}</p>
              <p className="text-gray-600">Phone: {owner.phone || "N/A"}</p>
              <p className="text-gray-600">Joined: {new Date(owner.createdat).toLocaleString()}</p>
              <p className="text-gray-600">Last Updated: {new Date(owner.updatedat).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-gray-600">Owner ID: {owner.restaurantownerid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Associated Restaurants</h2>
          {restaurants.length > 0 ? (
            <ul className="list-disc pl-5">
              {restaurants.map((restaurant, index) => (
                <li key={index} className="text-gray-600">{restaurant.restaurantname}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No restaurants associated.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Documents</h2>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div key={file.id} className="p-2 border rounded-lg">
                  <p className="text-gray-600">Type: {file.file_type}</p>
                  <p className="text-gray-600">Uploaded: {new Date(file.uploaded_at).toLocaleString()}</p>
                  <RemoteImage
                    path={file.file_path}
                    fallback="/null-icon.png"
                    alt={`Document ${file.id}`}
                    width={150}
                    height={150}
                    className="mt-2"
                    onError={() => console.log("Failed to load document:", file.file_path)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No documents uploaded.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-700">
              {owner.VerifiedOwner ? "Account Verified" : "Not Verified"}
            </span>
            <button
              onClick={handleVerifyToggle}
              className={`px-4 py-2 rounded-lg text-white ${
                loadingAction
                  ? "bg-gray-400"
                  : owner.VerifiedOwner
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loadingAction}
            >
              {loadingAction ? "Updating..." : owner.VerifiedOwner ? "Unverify" : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantOwnerDetail;