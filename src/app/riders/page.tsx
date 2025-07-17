"use client";
import React from "react";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import ReadRiders from "./ReadRiders";
import UpdateRider from "./UpdateRider";
import DeleteRider from "./DeleteRider";
import { useReadRiders } from "../api/RiderRelatedApi/useRiders";
import Chart from 'chart.js/auto';

const Riders = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRider, setCurrentRider] = useState<Rider | null>(null);
  const [deleteRiderId, setDeleteRiderId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const { data: riders, isLoading, isError, error } = useReadRiders();

  // Calculate stats
  const totalRiders = riders?.length || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newRidersThisMonth = riders?.filter((r) => {
    const createdDate = new Date(r.createdat || '');
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length || 0;
  const onlineRiders = riders?.filter((r) => r.isonline).length || 0; // Total riders with isonline true

  // Chart Data
  const riderGrowthData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [{
      label: 'New Riders',
      data: Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();
        return riders?.filter((r) => {
          const createdDate = new Date(r.createdat || '');
          return createdDate.getMonth() === month && createdDate.getFullYear() === year;
        }).length || 0;
      }),
      backgroundColor: '#4B5EAA',
      borderColor: '#2A3F8A',
      borderWidth: 1,
    }],
  };
  const riderGrowthOptions = {
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' }, ticks: { stepSize: 1, precision: 0 } } },
  };

  const vehicleTypeData = {
    labels: ["Bike", "Car", "Scooter", "Other"],
    datasets: [{
      label: 'Vehicle Types',
      data: [
        riders?.filter(r => r.vehicletype === "Bike").length || 0,
        riders?.filter(r => r.vehicletype === "Car").length || 0,
        riders?.filter(r => r.vehicletype === "Scooter").length || 0,
        riders?.filter(r => r.vehicletype && !["Bike", "Car", "Scooter"].includes(r.vehicletype)).length || 0,
      ],
      backgroundColor: ['#4B5EAA', '#6A8DD6', '#8AB4F8', '#B0C4DE'],
      borderWidth: 1,
    }],
  };
  const vehicleTypeOptions = { plugins: { legend: { position: 'top' } } };

  const ChartComponent = ({ data, options, type }) => {
    const chartRef = React.useRef<HTMLCanvasElement | null>(null);
    const chartInstance = React.useRef<Chart | null>(null);

    React.useEffect(() => {
      if (!chartRef.current) return;
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: type,
        data: data,
        options: options,
      });

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [data, options, type]);

    return <canvas ref={chartRef} className="w-full h-[300px]" />;
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error?.message}</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Riders</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-600">Total Riders</p>
            <p className="text-xl font-semibold">{totalRiders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-600">New This Month</p>
            <p className="text-xl font-semibold">{newRidersThisMonth}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <p className="text-sm text-gray-600">Online Riders</p>
            <p className="text-xl font-semibold">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  onlineRiders > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`w-2 h-2 mr-1 rounded-full ${
                    onlineRiders > 0 ? "bg-green-400" : "bg-red-400"
                  }`}
                ></span>
                {onlineRiders}
              </span>
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Rider Growth (Last 6 Months)</h2>
            <ChartComponent data={riderGrowthData} options={riderGrowthOptions} type="line" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Vehicle Type Distribution</h2>
            <ChartComponent data={vehicleTypeData} options={vehicleTypeOptions} type="pie" />
          </div>
        </div>

        <UpdateRider
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentRider={currentRider}
          setCurrentRider={setCurrentRider}
          setLoadingAction={setLoadingAction}
        />
        <DeleteRider
          setLoadingAction={setLoadingAction}
          currentRider={deleteRiderId ? { riderid: deleteRiderId, name: "", vehicletype: null, createdat: "", isonline: false } as Rider : null}
          setCurrentRider={setDeleteRiderId}
        />
        <ReadRiders
          onEdit={(rider) => {
            setCurrentRider(rider);
            setIsEditModalOpen(true);
          }}
          onDelete={(riderId) => {
            setDeleteRiderId(riderId);
          }}
          onView={(rider) => {
            setCurrentRider(rider);
            setIsViewModalOpen(true);
          }}
          isViewModalOpen={isViewModalOpen}
          setIsViewModalOpen={setIsViewModalOpen}
          loadingAction={loadingAction}
          currentRider={currentRider}
          setCurrentRider={setCurrentRider}
        />
      </div>
    </Layout>
  );
};

export default Riders;