'use client';
import React from "react";
import DashboardCards from "../components/DashBoardComponents/DashboardCards";
import ChartOrder from "../components/Chart";
import { useReadAllOrderStatuses } from "../api/DashboardRelatedApi/Dashboard";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import Layout from "../components/Layout";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
    {children}
  </div>
);

export default function DashboardPage() {
  const {
    data: orderStatusData,
    isLoading,
    isError,
    error,
  } = useReadAllOrderStatuses();

  const CurrentLayout = Layout || DefaultLayout;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-semibold">Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <CurrentLayout>
      {/* Use flex layout to remove ml-64 */}
      <div className="flex">
        <Sidebar collapse={false} setIsCollapsed={() => {}} />

        {/* Main content */}
        <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
          <NavBar />

          {isLoading ? (
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="animate-pulse text-lg text-teal-600 font-semibold">
                Loading dashboard data...
              </div>
            </div>
          ) : (
            <div className="dashboard-main w-full">
              {/* Cards section */}
              <div className="flex flex-col gap-4 w-full items-center">
                <div className="w-full max-w-[1200px] px-4">
                  <DashboardCards data={orderStatusData} />
                </div>
              </div>

              {/* Analytics chart */}
              <div className="mt-6 px-4 w-full flex justify-center">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 w-full max-w-[1200px]">
                  <div className="h-[400px]">
                    <ChartOrder />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CurrentLayout>
  );
}
