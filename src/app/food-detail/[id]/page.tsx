
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useFetchRestaurantItemById } from "../../api/RestaurantRelatedApi/useFetchRestaurantItemById";
import { RestaurantItem } from "../../api/RestaurantRelatedApi/restaurantTypes";
import Link from "next/link";
import RemoteImageRestaurantItems from "../../components/RemoteImages/RemoteImageRestaurantItems";
import Layout from "../../components/Layout";
import { format } from "date-fns";

export default function FoodDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: food, isLoading, error } = useFetchRestaurantItemById(id); // Assuming this hook can be extended for restaurantname

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error || !food) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-base text-red-600 font-medium">
            Error loading food details: {error?.message || "Item not found"}
          </p>
        </div>
      </Layout>
    );
  }

  // Calculate discounted price
  const originalPrice = food.baseprice;
  const discountPercentage = food.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">{food.itemname}</h1>
            <Link href="/food">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                Back to Food Items Menu
              </button>
            </Link>
          </div>
          {/* Image Section */}
          <div className="mb-8">
            {food.itemImages && food.itemImages.length > 0 ? (
              <RemoteImageRestaurantItems
                path={food.itemImages[0]}
                alt={food.itemname}
                className="w-64 h-64 mx-auto object-cover rounded-lg shadow-md"
                width={256}
                height={256}
              />
            ) : (
              <div className="w-64 h-64 mx-auto rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                No Image Available
              </div>
            )}
          </div>
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Category</h2>
                <p className="text-gray-600">{food.category || "N/A"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Restaurant</h2>
                <p className="text-gray-600">{food.restaurantname || "Not assigned"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Description</h2>
                <p className="text-gray-600">{food.itemdescription || "No description provided"}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Rating</h2>
                <p className="text-gray-600">{food.rating ? `${food.rating}/5` : "Not rated"}</p>
              </div>
            </div>

            {/* Right Column - Pricing and Status */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Original Price</h2>
                <p className="text-gray-600 line-through">${originalPrice.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Discount</h2>
                <p className="text-gray-600">{discountPercentage}%</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Final Price</h2>
                <p className="text-2xl font-bold text-green-600">${discountedPrice.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Availability</h2>
                <p className={`text-lg font-medium ${food.availablestatus ? "text-green-600" : "text-red-600"}`}>
                  {food.availablestatus ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="mt-6 border-t pt-4 text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-md font-medium">Created On</h2>
                <p>{food.createdat ? format(new Date(food.createdat), "PPP") : "N/A"}</p>
              </div>
              <div>
                <h2 className="text-md font-medium">Last Updated</h2>
                <p>{food.updatedat ? format(new Date(food.updatedat), "PPP") : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Item ID (Optional, for admin use) */}
          <div className="mt-6 text-gray-500 text-sm">
            <p>Item ID: {food.itemid}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}