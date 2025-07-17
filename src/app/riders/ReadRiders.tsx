"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Rider {
  riderid: string;
  name: string;
  vehicletype: string | null;
  createdat: string;
  "Account Verified": boolean | string | null;
  isonline: boolean | null;
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

const ReadRiders = ({
  onEdit,
  onDelete,
  isViewModalOpen,
  setIsViewModalOpen,
  loadingAction,
  currentRider,
  setCurrentRider,
}: ReadRidersProps) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRiders() {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("riders")
          .select("riderid, name, vehicletype, createdat, isonline"); // Explicitly select isonline

        if (fetchError) throw fetchError;

        setRiders(
          data.map((rider: any) => ({
            riderid: rider.riderid,
            name: rider.name,
            vehicletype: rider.vehicletype,
            createdat: rider.createdat,
            "Account Verified": rider["Account Verified"],
            isonline: rider.isonline || false,
          }))
        );
        console.log("Fetched riders:", data); // Debug log
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
        { event: "*", schema: "public", table: "riders" },
        (payload) => {
          const newRider = payload.new as Rider;
          setRiders((prev) =>
            prev.map((rider) =>
              rider.riderid === newRider.riderid
                ? {
                    riderid: newRider.riderid,
                    name: newRider.name,
                    vehicletype: newRider.vehicletype,
                    createdat: newRider.createdat,
                    "Account Verified": newRider["Account Verified"],
                    isonline: newRider.isonline || false,
                  }
                : rider
            ).concat(
              payload.event === "INSERT"
                ? [
                    {
                      riderid: newRider.riderid,
                      name: newRider.name,
                      vehicletype: newRider.vehicletype,
                      createdat: newRider.createdat,
                      "Account Verified": newRider["Account Verified"],
                      isonline: newRider.isonline || false,
                    },
                  ]
                : []
            ).filter((rider) => !(payload.event === "DELETE" && rider.riderid === (payload.old as Rider).riderid))
          );
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <table className="w-full text-left"><thead><tr className="border-b"><th className="p-3 text-blue-900">Rider ID</th><th className="p-3 text-blue-900">Name</th><th className="p-3 text-blue-900">Vehicle Type</th><th className="p-3 text-blue-900">Joined At</th><th className="p-3 text-blue-900">Verified</th><th className="p-3 text-blue-900">Status</th><th className="p-3 text-blue-900">Actions</th></tr></thead><tbody>{riders.map((rider) => (<tr key={rider.riderid} className="border-b"><td className="p-3">{rider.riderid}</td><td className="p-3">{rider.name}</td><td className="p-3">{rider.vehicletype || "N/A"}</td><td className="p-3">{new Date(rider.createdat).toLocaleString()}</td><td className="p-3">{rider["Account Verified"] === true || rider["Account Verified"] === "true" ? "Yes" : "No"}</td><td className="p-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rider.isonline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}><span className={`w-2 h-2 mr-1 rounded-full ${rider.isonline ? "bg-green-400" : "bg-red-400"}`}></span>{rider.isonline ? "Online" : "Offline"}</span></td><td className="p-3 flex gap-2"><button onClick={() => onEdit(rider)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center" disabled={loadingAction}><FaEdit /></button><button onClick={() => onDelete(rider.riderid)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center" disabled={loadingAction}><FaTrash /></button><button onClick={() => router.push(`/rider-detail/${rider.riderid}`)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"><FaEye /></button></td></tr>))}</tbody></table>
    </div>
  );
};

export default ReadRiders;