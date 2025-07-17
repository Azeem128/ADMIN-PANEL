"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer";
import RemoteImageRiderDocs from "../../components/RemoteImages/RemoteImageRiderDocs";

interface Rider {
  riderid: string;
  name: string;
  email: string;
  vehicletype: string | null;
  cnicfrontimage: string | null;
  cnicbackimage: string | null;
  vehiclefrontimage: string | null;
  vehiclebackimage: string | null;
  ridinglicenseimage: string | null;
  createdat: string;
  updatedat: string;
  profile_image: string | null;
  isonline: boolean | null;
  account_verified: boolean;
}

interface RiderLocation {
  locationid: string;
  riderid: string;
  rider_location_latitude: number;
  rider_location_longitude: number;
  createdat: string;
}

interface PaymentSummary {
  riderpaymentid: string;
  riderid: string;
  orderid: string;
  earningamount: number;
  paymentstatus: string;
  createdat: string;
  updatedat: string;
  isactive: boolean;
}

const RiderDetail: React.FC = () => {
  const [rider, setRider] = useState<Rider | null>(null);
  const [latestLocation, setLatestLocation] = useState<RiderLocation | null>(null);
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllPayments, setShowAllPayments] = useState<boolean>(false); // Toggle for active/inactive payments
  const router = useRouter();
  const params = useParams();
  const riderId = params?.riderid as string;

  useEffect(() => {
    async function fetchRider(): Promise<void> {
      if (!riderId || riderId === "undefined") {
        setError("Rider ID not provided");
        router.push("/riders");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Log authenticated user for debugging
        const { user } = await supabase.auth.getUser();
        console.log("Authenticated User:", user);

        // Fetch rider data
        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select(
            "riderid, name, email, vehicletype, cnicfrontimage, cnicbackimage, vehiclefrontimage, vehiclebackimage, ridinglicenseimage, createdat, updatedat, profile_image, isonline, account_verified"
          )
          .eq("riderid", riderId)
          .single();

        if (riderError) {
          console.error("Rider Error:", riderError.message, riderError.details);
          throw new Error(`Failed to fetch rider: ${riderError.message}`);
        }

        // Fetch payment summary data with conditional isactive filter
        let query = supabase
          .from("riderpaymentsummary")
          .select(
            "riderpaymentid, riderid, orderid, earningamount, paymentstatus, createdat, updatedat, isactive"
          )
          .eq("riderid", riderId);

        if (!showAllPayments) {
          query = query.eq("isactive", true); // Apply filter only for active payments
        }

        const { data: paymentData, error: paymentError } = await query;

        if (paymentError) {
          console.error("Payment Error:", paymentError.message, paymentError.details);
          throw new Error(`Failed to fetch payments: ${paymentError.message}`);
        }

        // Log payment data with riderId comparison
        console.log("Fetched Rider ID:", riderId);
        console.log("Payment Data Rider IDs:", paymentData?.map((p) => p.riderid) || []);
        console.log("Full Payment Data:", paymentData);

        // Fetch latest rider location
        const { data: locationData, error: locationError } = await supabase
          .from("riderlocations")
          .select("locationid, riderid, rider_location_latitude, rider_location_longitude, createdat")
          .eq("riderid", riderId)
          .order("createdat", { ascending: false })
          .limit(1);

        if (locationError) {
          console.error("Location Error:", locationError.message, locationError.details);
          throw new Error(`Failed to fetch location: ${locationError.message}`);
        }

        // Set rider data
        setRider(riderData);

        // Set payment data
        setPayments(
          paymentData?.map((payment) => ({
            riderpaymentid: payment.riderpaymentid,
            riderid: payment.riderid,
            orderid: payment.orderid,
            earningamount: payment.earningamount,
            paymentstatus: payment.paymentstatus,
            createdat: payment.createdat,
            updatedat: payment.updatedat,
            isactive: payment.isactive,
          })) || []
        );

        // Set latest location
        setLatestLocation(locationData?.[0] || null);
      } catch (err: any) {
        console.error("Error fetching rider:", err.message, err.details || {});
        setError(`Failed to fetch rider data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    }

    fetchRider();
  }, [riderId, router, showAllPayments]); // Re-run effect when showAllPayments changes

  const handleVerifyToggle = async () => {
    if (!rider) return;
    setLoading(true);

    try {
      const newVerified = !rider.account_verified;
      const { error } = await supabase
        .from("riders")
        .update({
          account_verified: newVerified,
          updatedat: new Date().toISOString(),
        })
        .eq("riderid", rider.riderid);

      if (error) throw error;

      setRider((prev) =>
        prev
          ? {
              ...prev,
              account_verified: newVerified,
              updatedat: new Date().toISOString(),
            }
          : null
      );

      toast.success(`Rider ${newVerified ? "verified" : "unverified"} successfully!`);
    } catch (err: any) {
      toast.error(`Failed to update verification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentToggle = async (paymentId: string) => {
    if (!rider) return;
    setLoading(true);

    try {
      const payment = payments.find((p) => p.riderpaymentid === paymentId);
      if (payment) {
        const newStatus = payment.paymentstatus === "Completed" ? "Pending" : "Completed";
        const { error } = await supabase
          .from("riderpaymentsummary")
          .update({
            paymentstatus: newStatus,
            updatedat: new Date().toISOString(),
          })
          .eq("riderpaymentid", paymentId);

        if (error) throw error;

        setPayments((prev) =>
          prev.map((p) =>
            p.riderpaymentid === paymentId
              ? { ...p, paymentstatus: newStatus, updatedat: new Date().toISOString() }
              : p
          )
        );
        toast.success(`Payment status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(`Failed to update payment status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentFilter = () => {
    setShowAllPayments((prev) => !prev);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !rider) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-lg">{error || "Rider not found"}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Rider Details</h1>
          <button
            onClick={() => router.push("/riders")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Riders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <RemoteImage
              path={rider.profile_image}
              fallback="/null-icon.png"
              alt={`Profile of ${rider.name}`}
              width={80}
              height={80}
              className="rounded-full mr-4 border-4 border-indigo-200"
            />
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">{rider.name}</h2>
              <p className="text-gray-600">Email: {rider.email || "N/A"}</p>
              <p className="text-gray-600">Vehicle Type: {rider.vehicletype || "N/A"}</p>
              <p className="text-gray-600">Joined: {new Date(rider.createdat).toLocaleString()}</p>
              <p className="text-gray-600">Last Updated: {new Date(rider.updatedat).toLocaleString()}</p>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    rider.isonline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 mr-1 rounded-full ${
                      rider.isonline ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                  {rider.isonline ? "Online" : "Offline"}
                </span>
              </p>
              {latestLocation && (
                <p className="text-gray-600">
                  Location: Lat {latestLocation.rider_location_latitude}, Long{" "}
                  {latestLocation.rider_location_longitude}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-600">Rider ID: {rider.riderid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Verification Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RemoteImageRiderDocs
              path={rider.cnicfrontimage}
              bucket="cnic-front-images"
              fallback="/null-icon.png"
              alt="CNIC Front"
              width={150}
              height={100}
              className="rounded-lg object-cover"
            />
            <RemoteImageRiderDocs
              path={rider.cnicbackimage}
              bucket="cnic-back-images"
              fallback="/null-icon.png"
              alt="CNIC Back"
              width={150}
              height={100}
              className="rounded-lg object-cover"
            />
            <RemoteImageRiderDocs
              path={rider.vehiclefrontimage}
              bucket="vehicle-front-images"
              fallback="/null-icon.png"
              alt="Vehicle Front"
              width={150}
              height={100}
              className="rounded-lg object-cover"
            />
            <RemoteImageRiderDocs
              path={rider.vehiclebackimage}
              bucket="vehicle-back-images"
              fallback="/null-icon.png"
              alt="Vehicle Back"
              width={150}
              height={100}
              className="rounded-lg object-cover"
            />
            <RemoteImageRiderDocs
              path={rider.ridinglicenseimage}
              bucket="riding-license-images"
              fallback="/null-icon.png"
              alt="License"
              width={150}
              height={100}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleVerifyToggle}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                rider.account_verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {rider.account_verified ? "Unverify" : "Verify"}
            </button>
            <span className="ml-4 text-gray-600">
              Account Verified: {rider.account_verified ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-800">Payment Summary</h2>
            <button
              onClick={togglePaymentFilter}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {showAllPayments ? "Show Active Only" : "Show All Payments"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                  <th className="p-3 border border-gray-200">Payment ID</th>
                  <th className="p-3 border border-gray-200">Order ID</th>
                  <th className="p-3 border border-gray-200">Earning</th>
                  <th className="p-3 border border-gray-200">Status</th>
                  <th className="p-3 border border-gray-200">Date</th>
                  <th className="p-3 border border-gray-200">Updated</th>
                  <th className="p-3 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.riderpaymentid} className="border-b">
                      <td className="p-3 border border-gray-200 text-xs">{payment.riderpaymentid}</td>
                      <td className="p-3 border border-gray-200 text-xs">{payment.orderid}</td>
                      <td className="p-3 border border-gray-200 text-xs">
                        ${payment.earningamount.toFixed(2)}
                      </td>
                      <td className="p-3 border border-gray-200 text-xs">{payment.paymentstatus}</td>
                      <td className="p-3 border border-gray-200 text-xs">
                        {new Date(payment.createdat).toLocaleString()}
                      </td>
                      <td className="p-3 border border-gray-200 text-xs">
                        {new Date(payment.updatedat).toLocaleString()}
                      </td>
                      <td className="p-3 border border-gray-200 text-xs">
                        <button
                          onClick={() => handlePaymentToggle(payment.riderpaymentid)}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          disabled={loading}
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-600">
                      No payment records found for this rider.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiderDetail;