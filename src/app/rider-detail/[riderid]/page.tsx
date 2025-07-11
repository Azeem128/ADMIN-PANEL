// // app/rider-detail/[riderid]/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import { toast } from "react-toastify";
// import Layout from "../../components/Layout";
// import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer";

// interface Rider {
//   riderid: string;
//   name: string;
//   phone: string | null;
//   vehicletype: string | null;
//   cnicfrontimage: string | null;
//   cnicbackimage: string | null;
//   vehiclefrontimage: string | null;
//   vehiclebackimage: string | null;
//   ridinglicenseimage: string | null;
//   createdat: string;
//   updatedat: string;
//   profile_image: string | null;
//   "Account Verified": boolean;
// }

// interface PaymentSummary {
//   riderpaymentid: string;
//   riderid: string;
//   orderid: string;
//   earningamount: number;
//   paymentstatus: string;
//   createdat: string;
//   updatedat?: string; // Optional until added to schema
// }

// const RiderDetail: React.FC = () => {
//   const [rider, setRider] = useState<Rider | null>(null);
//   const [payments, setPayments] = useState<PaymentSummary[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const params = useParams();
//   const riderId = params?.riderid as string;

//   useEffect(() => {
//     async function fetchRider(): Promise<void> {
//       if (!riderId || riderId === "undefined") {
//         setError("Rider ID not provided");
//         router.push("/riders");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const { data: riderData, error: riderError } = await supabase
//           .from("riders")
//           .select("*")
//           .eq("riderid", riderId)
//           .single();

//         if (riderError) throw riderError;

//         const { data: paymentData, error: paymentError } = await supabase
//           .from("riderpaymentsummary")
//           .select("riderpaymentid, riderid, orderid, earningamount, paymentstatus, createdat")
//           .eq("riderid", riderId);

//         if (paymentError) throw paymentError;

//         setRider(riderData);
//         setPayments(paymentData || []);
//       } catch (err: any) {
//         console.error("Error fetching rider:", err.message, err.details || {});
//         setError("Failed to fetch rider data: " + (err.message || "Unknown error"));
//       }
//       setLoading(false);
//     }

//     fetchRider();
//   }, [riderId, router]);

//   const handleEditToggle = async (paymentId?: string) => {
//     if (!rider) return;
//     setLoading(true);

//     try {
//       // Update rider verification
//       const newVerified = !rider["Account Verified"];
//       const { error: riderError } = await supabase
//         .from("riders")
//         .update({ "Account Verified": newVerified, updatedat: new Date().toISOString() })
//         .eq("riderid", riderId);

//       if (riderError) throw riderError;

//       // Update payment status if paymentId is provided
//       if (paymentId) {
//         const payment = payments.find(p => p.riderpaymentid === paymentId);
//         if (payment) {
//           const newPaymentStatus = payment.paymentstatus === "Completed" ? "Pending" : "Completed";
//           const { error: paymentError } = await supabase
//             .from("riderpaymentsummary")
//             .update({ paymentstatus: newPaymentStatus })
//             .eq("riderpaymentid", paymentId);

//           if (paymentError) throw paymentError;

//           setPayments(payments.map(p => 
//             p.riderpaymentid === paymentId ? { ...p, paymentstatus: newPaymentStatus } : p
//           ));
//         }
//       }

//       setRider(prev => prev ? { ...prev, "Account Verified": newVerified, updatedat: new Date().toISOString() } : null);
//       toast.success(`Rider ${newVerified ? "verified" : "unverified"}${paymentId ? `, Payment ${paymentId} status updated to ${newPaymentStatus}` : ""}.`);
//     } catch (err: any) {
//       toast.error("Failed to update: " + err.message);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-gray-600 text-lg">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (error || !rider) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-red-500 text-lg">{error || "Rider not found"}</p>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-indigo-800">Rider Details</h1>
//           <button
//             onClick={() => router.push("/riders")}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Back to Riders
//           </button>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center mb-4">
//             <RemoteImage
//               path={rider.profile_image}
//               fallback="/null-icon.png"
//               alt={`Profile of ${rider.name}`}
//               width={80}
//               height={80}
//               className="rounded-full mr-4 border-4 border-indigo-200"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-indigo-900">{rider.name}</h2>
//               <p className="text-gray-600">Phone: {rider.phone || "N/A"}</p>
//               <p className="text-gray-600">Vehicle Type: {rider.vehicletype || "N/A"}</p>
//               <p className="text-gray-600">Joined: {new Date(rider.createdat).toLocaleString()}</p>
//               <p className="text-gray-600">Last Updated: {new Date(rider.updatedat).toLocaleString()}</p>
//             </div>
//           </div>
//           <p className="text-gray-600">Rider ID: {rider.riderid}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-indigo-800 mb-4">Verification Images</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <p className="text-gray-600 mb-2">CNIC Front</p>
//               <RemoteImage
//                 path={rider.cnicfrontimage}
//                 fallback="/null-icon.png"
//                 alt="CNIC Front"
//                 width={150}
//                 height={100}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">CNIC Back</p>
//               <RemoteImage
//                 path={rider.cnicbackimage}
//                 fallback="/null-icon.png"
//                 alt="CNIC Back"
//                 width={150}
//                 height={100}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">Vehicle Front</p>
//               <RemoteImage
//                 path={rider.vehiclefrontimage}
//                 fallback="/null-icon.png"
//                 alt="Vehicle Front"
//                 width={150}
//                 height={100}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">Vehicle Back</p>
//               <RemoteImage
//                 path={rider.vehiclebackimage}
//                 fallback="/null-icon.png"
//                 alt="Vehicle Back"
//                 width={150}
//                 height={100}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">Riding License</p>
//               <RemoteImage
//                 path={rider.ridinglicenseimage}
//                 fallback="/null-icon.png"
//                 alt="Riding License"
//                 width={150}
//                 height={100}
//                 className="rounded-lg object-cover"
//               />
//             </div>
//           </div>
//           <div className="mt-4">
//             <button
//               onClick={() => handleEditToggle()}
//               className={`px-4 py-2 rounded-lg text-white transition-colors ${
//                 rider["Account Verified"] ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
//               }`}
//               disabled={loading}
//             >
//               {rider["Account Verified"] ? "Unverify" : "Verify"}
//             </button>
//             <span className="ml-4 text-gray-600">
//               Account Verified: {rider["Account Verified"] ? "Yes" : "No"}
//             </span>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-xl font-semibold text-indigo-800 mb-4">Payment Summary</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200 rounded-lg">
//               <thead>
//                 <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
//                   <th className="p-3 border border-gray-200">Payment ID</th>
//                   <th className="p-3 border border-gray-200">Order ID</th>
//                   <th className="p-3 border border-gray-200">Earning</th>
//                   <th className="p-3 border border-gray-200">Status</th>
//                   <th className="p-3 border border-gray-200">Date</th>
//                   <th className="p-3 border border-gray-200">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {payments.map((payment) => (
//                   <tr key={payment.riderpaymentid} className="border-b">
//                     <td className="p-3 border border-gray-200 text-xs">{payment.riderpaymentid}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{payment.orderid}</td>
//                     <td className="p-3 border border-gray-200 text-xs">${payment.earningamount.toFixed(2)}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{payment.paymentstatus}</td>
//                     <td className="p-3 border border-gray-200 text-xs">{new Date(payment.createdat).toLocaleString()}</td>
//                     <td className="p-3 border border-gray-200 text-xs">
//                       <button
//                         onClick={() => handleEditToggle(payment.riderpaymentid)}
//                         className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         disabled={loading}
//                       >
//                         Toggle Status
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

// export default RiderDetail;




// app/rider-detail/[riderid]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import RemoteImage from "../../components/RemoteImages/RemoteImageCustomer";

interface Rider {
  riderid: string;
  name: string;
  phone: string | null;
  vehicletype: string | null;
  cnicfrontimage: string | null;
  cnicbackimage: string | null;
  vehiclefrontimage: string | null;
  vehiclebackimage: string | null;
  ridinglicenseimage: string | null;
  createdat: string;
  updatedat: string;
  profile_image: string | null;
  "Account Verified": boolean;
}

interface PaymentSummary {
  riderpaymentid: string;
  riderid: string;
  orderid: string;
  earningamount: number;
  paymentstatus: string;
  createdat: string;
}

const RiderDetail: React.FC = () => {
  const [rider, setRider] = useState<Rider | null>(null);
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select("*")
          .eq("riderid", riderId)
          .single();

        if (riderError) throw riderError;

        const { data: paymentData, error: paymentError } = await supabase
          .from("riderpaymentsummary")
          .select("riderpaymentid, riderid, orderid, earningamount, paymentstatus, createdat")
          .eq("riderid", riderId);

        if (paymentError) throw paymentError;

        setRider(riderData);
        setPayments(paymentData || []);
      } catch (err: any) {
        console.error("Error fetching rider:", err.message, err.details || {});
        setError("Failed to fetch rider data: " + (err.message || "Unknown error"));
      }
      setLoading(false);
    }

    fetchRider();
  }, [riderId, router]);

  const handleVerifyToggle = async () => {
    if (!rider) return;
    setLoading(true);

    try {
      const newVerified = !rider["Account Verified"];
      const { error } = await supabase
        .from("riders")
        .update({ "Account Verified": newVerified, updatedat: new Date().toISOString() })
        .eq("riderid", riderId);

      if (error) throw error;

      setRider(prev => prev ? { ...prev, "Account Verified": newVerified, updatedat: new Date().toISOString() } : null);
      toast.success(`Rider ${newVerified ? "verified" : "unverified"} successfully!`);
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    }
    setLoading(false);
  };

  const handlePaymentToggle = async (paymentId?: string) => {
    if (!rider) return;
    setLoading(true);

    try {
      if (paymentId) {
        const payment = payments.find(p => p.riderpaymentid === paymentId);
        if (payment) {
          const newPaymentStatus = payment.paymentstatus === "Completed" ? "Pending" : "Completed";
          const { error: paymentError } = await supabase
            .from("riderpaymentsummary")
            .update({ paymentstatus: newPaymentStatus })
            .eq("riderpaymentid", paymentId);

          if (paymentError) throw paymentError;

          setPayments(payments.map(p => 
            p.riderpaymentid === paymentId ? { ...p, paymentstatus: newPaymentStatus } : p
          ));
          toast.success(`Payment ${paymentId} status updated to ${newPaymentStatus}.`);
        }
      }

      setRider(prev => prev ? { ...prev, updatedat: new Date().toISOString() } : null);
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    }
    setLoading(false);
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
              <p className="text-gray-600">Phone: {rider.phone || "N/A"}</p>
              <p className="text-gray-600">Vehicle Type: {rider.vehicletype || "N/A"}</p>
              <p className="text-gray-600">Joined: {new Date(rider.createdat).toLocaleString()}</p>
              <p className="text-gray-600">Last Updated: {new Date(rider.updatedat).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-gray-600">Rider ID: {rider.riderid}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Verification Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 mb-2">CNIC Front</p>
              <RemoteImage
                path={rider.cnicfrontimage}
                fallback="/null-icon.png"
                alt="CNIC Front"
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-2">CNIC Back</p>
              <RemoteImage
                path={rider.cnicbackimage}
                fallback="/null-icon.png"
                alt="CNIC Back"
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-2">Vehicle Front</p>
              <RemoteImage
                path={rider.vehiclefrontimage}
                fallback="/null-icon.png"
                alt="Vehicle Front"
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-2">Vehicle Back</p>
              <RemoteImage
                path={rider.vehiclebackimage}
                fallback="/null-icon.png"
                alt="Vehicle Back"
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-2">Riding License</p>
              <RemoteImage
                path={rider.ridinglicenseimage}
                fallback="/null-icon.png"
                alt="Riding License"
                width={150}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleVerifyToggle}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                rider["Account Verified"] ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {rider["Account Verified"] ? "Unverify" : "Verify"}
            </button>
            <span className="ml-4 text-gray-600">
              Account Verified: {rider["Account Verified"] ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Payment Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-50 text-left text-xs text-indigo-800">
                  <th className="p-3 border border-gray-200">Payment ID</th>
                  <th className="p-3 border border-gray-200">Order ID</th>
                  <th className="p-3 border border-gray-200">Earning</th>
                  <th className="p-3 border border-gray-200">Status</th>
                  <th className="p-3 border border-gray-200">Date</th>
                  <th className="p-3 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.riderpaymentid} className="border-b">
                    <td className="p-3 border border-gray-200 text-xs">{payment.riderpaymentid}</td>
                    <td className="p-3 border border-gray-200 text-xs">{payment.orderid}</td>
                    <td className="p-3 border border-gray-200 text-xs">${payment.earningamount.toFixed(2)}</td>
                    <td className="p-3 border border-gray-200 text-xs">{payment.paymentstatus}</td>
                    <td className="p-3 border border-gray-200 text-xs">{new Date(payment.createdat).toLocaleString()}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiderDetail;