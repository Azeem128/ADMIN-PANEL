
// "use client";

// import React from "react";
// import Layout from "../components/Layout";
// import CustomerTable from "../components/Customers/CustomerTable";
// import { useRouter } from "next/navigation";

// export default function CustomersPage() {
//   const router = useRouter();

//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold my-4">Customers</h1>

//       {/* Add Customer Button */}
//       {/* <div className="mb-4">
//         <button
//           onClick={() => router.push("/customers/add")}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Add Customer
//         </button>
//       </div> */}

//       {/* Only displaying the CustomerTable */}
//       <div className="mt-6">
//         <CustomerTable />
//       </div>
//     </Layout>
//   );
// }
//=============
// src/app/customers/page.tsx
// src/app/customers/page.tsx
// "use client";

// import React from "react";
// import Layout from "../components/Layout";
// import CustomerTable from "../components/Customers/CustomerTable";
// import { useRouter } from "next/navigation";
// import { useReadCustomers } from "@/app/api/CustomerRelatedApi/customer";
// import Chart from 'chart.js/auto';

// const ChartComponent = ({ data, options }) => {
//   const chartRef = React.useRef<HTMLCanvasElement | null>(null);
//   const chartInstance = React.useRef<Chart | null>(null);

//   React.useEffect(() => {
//     if (!chartRef.current) return;
//     const ctx = chartRef.current.getContext('2d');
//     if (!ctx) return;

//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     chartInstance.current = new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: options,
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [data, options]);

//   return <canvas ref={chartRef} className="w-full h-[300px]" />;
// };

// export default function CustomersPage() {
//   const router = useRouter();
//   const { data: customers, isLoading, isError, error } = useReadCustomers();

//   if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   if (isError) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error?.message}</div>;

//   const totalCustomers = customers?.length || 0;
//   const currentMonth = new Date().getMonth();
//   const currentYear = new Date().getFullYear();
//   const newCustomersThisMonth = customers?.filter((c) => {
//     const createdDate = new Date(c.createdat || '');
//     return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
//   }).length || 0;
//   const avgOrders = customers?.reduce((acc, c) => acc + (c.noOfOrders || 0), 0) / totalCustomers || 0;
//   const totalRevenue = customers?.reduce((acc, c) => acc + (c.totalSpent || 0), 0) || 0;

//   const chartData = {
//     labels: Array.from({ length: 6 }, (_, i) => {
//       const d = new Date();
//       d.setMonth(d.getMonth() - (5 - i));
//       return d.toLocaleString('default', { month: 'short', year: 'numeric' });
//     }),
//     datasets: [{
//       label: 'New Customers',
//       data: Array.from({ length: 6 }, (_, i) => {
//         const d = new Date();
//         d.setMonth(d.getMonth() - (5 - i));
//         const month = d.getMonth();
//         const year = d.getFullYear();
//         const count = customers?.filter((c) => {
//           const createdDate = new Date(c.createdat || '');
//           return createdDate.getMonth() === month && createdDate.getFullYear() === year;
//         }).length || 0;
//         console.log(`Month ${month}/${year}: ${count} customers`); // Debug log
//         return count;
//       }),
//       backgroundColor: '#4B5EAA',
//       borderColor: '#2A3F8A',
//       borderWidth: 1,
//     }],
//   };
//   const chartOptions = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: { display: true, text: 'Count' },
//         ticks: { stepSize: 1, precision: 0 }, // Force integer steps
//       },
//     },
//   };

//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold my-4">Customers</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
//           <p className="text-sm text-gray-600">Total Customers</p>
//           <p className="text-xl font-semibold">{totalCustomers}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
//           <p className="text-sm text-gray-600">New This Month</p>
//           <p className="text-xl font-semibold">{newCustomersThisMonth}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
//           <p className="text-sm text-gray-600">Avg Orders</p>
//           <p className="text-xl font-semibold">{avgOrders.toFixed(1)}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
//           <p className="text-sm text-gray-600">Total Revenue</p>
//           <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
//         </div>
//       </div>

//       <div className="mt-6 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold mb-4">Customer Growth (Last 6 Months)</h2>
//         <ChartComponent data={chartData} options={chartOptions} />
//       </div>

//       <div className="mt-6">
//         <CustomerTable />
//       </div>
//     </Layout>
//   );
// }


"use client";

import React, { useState } from "react";
import Layout from "../components/Layout";
import CustomerTable from "../components/Customers/CustomerTable";
import { useRouter } from "next/navigation";
import { useReadCustomers } from "@/app/api/CustomerRelatedApi/customer";
import Chart from 'chart.js/auto';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

const ChartComponent = ({ data, options }) => {
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
      type: 'bar',
      data: data,
      options: options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef} className="w-full h-[300px]" />;
};

export default function CustomersPage() {
  const router = useRouter();
  const { data: customers, isLoading, isError, error } = useReadCustomers();
  const [loadingAction, setLoadingAction] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<{ customerid: string; name: string; email: string; phone: string | null } | null>(null);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error?.message}</div>;

  const totalCustomers = customers?.length || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newCustomersThisMonth = customers?.filter((c) => {
    const createdDate = new Date(c.createdat || '');
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length || 0;
  const avgOrders = customers?.reduce((acc, c) => acc + (c.noOfOrders || 0), 0) / totalCustomers || 0;
  const totalRevenue = customers?.reduce((acc, c) => acc + (c.totalSpent || 0), 0) || 0;

  const chartData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [{
      label: 'New Customers',
      data: Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();
        const count = customers?.filter((c) => {
          const createdDate = new Date(c.createdat || '');
          return createdDate.getMonth() === month && createdDate.getFullYear() === year;
        }).length || 0;
        return count;
      }),
      backgroundColor: '#4B5EAA',
      borderColor: '#2A3F8A',
      borderWidth: 1,
    }],
  };
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
        ticks: { stepSize: 1, precision: 0 },
      },
    },
  };

  const handleAddCustomer = () => {
    router.push("/customers/add");
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setLoadingAction(true);
      router.push(`/customers/delete/${customerId}`);
    }
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = customers?.find(c => c.customerid === customerId);
    if (customer) {
      setEditingCustomer({
        customerid: customer.customerid,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
      });
    }
  };

  const handleViewCustomer = (customerId: string) => {
    router.push(`/customer-detail/${customerId}`);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setLoadingAction(true);
      try {
        const { error } = await supabase
          .from("customers")
          .update({
            name: editingCustomer.name,
            email: editingCustomer.email,
            phone: editingCustomer.phone,
            updatedat: new Date().toISOString(),
          })
          .eq("customerid", editingCustomer.customerid);

        if (error) throw error;

        toast.success("Customer updated successfully");
        setEditingCustomer(null);
      } catch (err: any) {
        toast.error("Failed to update customer: " + err.message);
      }
      setLoadingAction(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold my-4">Customers</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-xl font-semibold">{totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-600">New This Month</p>
          <p className="text-xl font-semibold">{newCustomersThisMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-600">Avg Orders</p>
          <p className="text-xl font-semibold">{avgOrders.toFixed(1)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Customer Growth (Last 6 Months)</h2>
        <ChartComponent data={chartData} options={chartOptions} />
      </div>

      <div className="mt-6 flex justify-end mb-4">
        <button
          onClick={handleAddCustomer}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          disabled={loadingAction}
        >
          Add Customer
        </button>
      </div>

      <div className="mt-6">
        <CustomerTable
          customers={customers}
          onDelete={handleDeleteCustomer}
          onEdit={handleEditCustomer}
          onView={handleViewCustomer}
        />
      </div>

      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={editingCustomer.phone || ""}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value || null })}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loadingAction}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}