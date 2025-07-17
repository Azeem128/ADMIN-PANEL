"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer";
import RemoteImageRestaurant from "../../components/RemoteImages/RemoteImageRestaurant";
import RemoteImageRestaurantItems from "../../components/RemoteImages/RemoteImageRestaurantItems";
import { toast } from "react-toastify";

interface RestaurantOwner {
  restaurantownerid: string;
  name: string;
  email: string;
  createdat: string;
  updatedat: string;
  VerifiedOwner: boolean;
  owner_image: string | null;
}

interface Restaurant {
  restaurantid: string;
  restaurantownerid: string;
  restaurantname: string;
  restaurant_location_latitude: number;
  restaurant_location_longitude: number;
  starttiming: string;
  endtiming: string;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantimage: string | null;
  business_type: string;
  business_category: string;
  cuisine: string;
}

interface RestaurantItem {
  itemid: string;
  restaurantid: string;
  itemname: string;
  itemdescription: string;
  baseprice: number;
  availablestatus: boolean;
  discount: number;
  rating: number;
  createdat: string;
  updatedat: string;
  itemImages: string | null;
  category: string;
}

const RestaurantOwnerDetail: React.FC = () => {
  const [owner, setOwner] = useState<RestaurantOwner | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantItems, setRestaurantItems] = useState<{ [key: string]: RestaurantItem[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const router = useRouter();
  const params = useParams();
  const ownerId = params?.id as string;

  useEffect(() => {
    async function fetchOwnerDetails() {
      if (!ownerId || ownerId === "undefined") {
        setError("Invalid Owner ID. Please ensure the URL includes a valid owner ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch owner details
        const { data: ownerData, error: ownerError } = await supabase
          .from("restaurantowners")
          .select("restaurantownerid, name, email, createdat, updatedat, VerifiedOwner, owner_image")
          .eq("restaurantownerid", ownerId)
          .single();

        if (ownerError) throw ownerError;

        // Fetch associated restaurants
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select(
            "restaurantid, restaurantownerid, restaurantname, restaurant_location_latitude, restaurant_location_longitude, starttiming, endtiming, rating, createdat, updatedat, restaurantimage, business_type, business_category, cuisine"
          )
          .eq("restaurantownerid", ownerId);

        if (restaurantError) throw restaurantError;

        // Fetch restaurant items for each restaurant
        const restaurantIds = restaurantData?.map((r) => r.restaurantid) || [];
        const { data: itemsData, error: itemsError } = await supabase
          .from("restaurantitems")
          .select("itemid, restaurantid, itemname, itemdescription, baseprice, availablestatus, discount, rating, createdat, updatedat, itemImages, category")
          .in("restaurantid", restaurantIds);

        if (itemsError) throw itemsError;

        // Generate image URLs
        const ownerImageUrl = ownerData.owner_image
          ? supabase.storage.from("owner-images").getPublicUrl(`public/${ownerData.owner_image}`).data.publicUrl
          : "/null-icon.png";

        const restaurantImageUrls = restaurantData.map((restaurant) =>
          restaurant.restaurantimage
            ? supabase.storage.from("restaurant-items").getPublicUrl(`public/${restaurant.restaurantimage}`).data.publicUrl
            : "/null-icon.png"
        );

        const itemsByRestaurant = restaurantIds.reduce((acc, restaurantId) => {
          acc[restaurantId] = itemsData.filter((item) => item.restaurantid === restaurantId).map((item) => ({
            ...item,
            itemImages: item.itemImages
              ? supabase.storage.from("restaurant-items").getPublicUrl(`public/${item.itemImages}`).data.publicUrl
              : "/null-icon.png",
          }));
          return acc;
        }, {} as { [key: string]: RestaurantItem[] });

        setOwner({ ...ownerData, owner_image: ownerImageUrl });
        setRestaurants(
          restaurantData.map((restaurant, index) => ({
            ...restaurant,
            restaurantimage: restaurantImageUrls[index],
          })) || []
        );
        setRestaurantItems(itemsByRestaurant);
      } catch (err: any) {
        setError("Failed to fetch owner details: " + err.message);
      }
      setLoading(false);
    }

    fetchOwnerDetails();

    const subscription = supabase
      .channel("restaurantowner-detail-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "restaurantowners", filter: `restaurantownerid=eq.${ownerId}` },
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
      setOwner((prev) => (prev ? { ...prev, VerifiedOwner: newVerified } : null));
      toast.success(`Owner ${newVerified ? "verified" : "unverified"} successfully!`);
    }
    setLoadingAction(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !owner) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={() => router.push("/restaurant-owner")}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Owners
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Restaurant Owner Details</h1>
          <button
            onClick={() => router.push("/restaurant-owner")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
              width={100}
              height={100}
              className="rounded-full border-4 border-green-200 mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{owner.name}</h2>
              <p className="text-gray-600">Owner ID: {owner.restaurantownerid}</p>
              <p className="text-gray-600">Email: {owner.email}</p>
              <p className="text-gray-600">Joined: {new Date(owner.createdat).toLocaleString()}</p>
              <p className="text-gray-600">Last Updated: {new Date(owner.updatedat).toLocaleString()}</p>
              <p className="text-gray-600">
                Verification Status: {owner.VerifiedOwner ? "Verified ✅" : "Not Verified ❌"}
              </p>
            </div>
          </div>
          <button
            onClick={handleVerifyToggle}
            className={`px-4 py-2 rounded-md text-white ${
              loadingAction
                ? "bg-gray-400"
                : owner.VerifiedOwner
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-transform hover:scale-105`}
            disabled={loadingAction}
          >
            {loadingAction ? "Updating..." : owner.VerifiedOwner ? "Unverify" : "Verify"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Associated Restaurants</h2>
          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((restaurant) => (
                <div key={restaurant.restaurantid} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{restaurant.restaurantname}</h3>
                  <p className="text-gray-600">Restaurant ID: {restaurant.restaurantid}</p>
                  <p className="text-gray-600">
                    Location: ({restaurant.restaurant_location_latitude}, {restaurant.restaurant_location_longitude})
                  </p>
                  <p className="text-gray-600">
                    Timing: {new Date(restaurant.starttiming).toLocaleTimeString()} -{" "}
                    {new Date(restaurant.endtiming).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-600">Rating: {restaurant.rating || "N/A"}</p>
                  <p className="text-gray-600">Business Type: {restaurant.business_type}</p>
                  <p className="text-gray-600">Category: {restaurant.business_category}</p>
                  <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>
                  <RemoteImageRestaurant
                    path={restaurant.restaurantimage}
                    fallback="/null-icon.png"
                    alt={`Image of ${restaurant.restaurantname}`}
                    width={200}
                    height={150}
                    className="mt-2 rounded-md object-cover"
                  />
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700">Menu Items</h4>
                    {restaurantItems[restaurant.restaurantid]?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {restaurantItems[restaurant.restaurantid].map((item) => (
                          <li key={item.itemid} className="text-gray-600">
                            <div>{item.itemname}</div>
                            <div className="text-sm text-gray-500">Description: {item.itemdescription}</div>
                            <div className="text-sm text-gray-500">Price: ${item.baseprice}</div>
                            <div className="text-sm text-gray-500">
                              Discount: {item.discount ? `${item.discount}%` : "None"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Available: {item.availablestatus ? "Yes" : "No"}
                            </div>
                            <div className="text-sm text-gray-500">Rating: {item.rating || "N/A"}</div>
                            <div className="text-sm text-gray-500">Category: {item.category}</div>
                            <RemoteImageRestaurantItems
                              path={item.itemImages}
                              fallback="/null-icon.png"
                              alt={`Image of ${item.itemname}`}
                              width={100}
                              height={100}
                              className="mt-2 rounded-md object-cover"
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No menu items available.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No restaurants associated.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantOwnerDetail;