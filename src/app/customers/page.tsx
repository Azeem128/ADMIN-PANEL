"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
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

  return (
    <div className="relative w-full h-[400px]">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default function CustomersPage() {
  const router = useRouter();
  const { data: customers, isLoading, isError, error } = useReadCustomers();
  const [loadingAction, setLoadingAction] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<{ customerid: string; name: string; email: string; image?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const customersPerPage = 10;

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error?.message}</div>;

  // Filter customers based on search term (ID or name)
  const filteredCustomers = customers?.filter(customer =>
    customer.customerid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const totalCustomers = customers?.length || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newCustomersThisMonth = customers?.filter((c) => {
    const createdDate = new Date(c.createdat || '');
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length || 0;

  const avgOrders = customers && customers.length > 0
    ? customers.reduce((acc, c) => acc + (c.noOfOrders || 0), 0) / customers.length
    : 0;

  const activeCustomers = customers?.filter(c => {
    const createdDate = new Date(c.createdat || '');
    return customers.some(order => order.customerid === c.customerid && 
      new Date(order.createdat).getTime() > (Date.now() - 30 * 24 * 60 * 60 * 1000));
  }).length || 0;
  const totalOrders = customers?.reduce((acc, c) => acc + (c.noOfOrders || 0), 0) || 0;
  const ordersPerCustomer = totalOrders / (customers?.length || 1);

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

  const maxDataValue = Math.max(...chartData.datasets[0].data, 0);
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
        ticks: { stepSize: 1, precision: 0 },
        max: maxDataValue > 0 ? Math.max(10, Math.ceil(maxDataValue * 1.2)) : 10,
      },
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 6 },
      },
    },
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
        image: customer.image || undefined, // Include image if available
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
            updatedat: new Date().toISOString(),
            image: editingCustomer.image || null, // Update image if provided
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <h1 className="text-2xl font-bold my-4">Customers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <p className="text-sm font-medium">Total Customers</p>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <p className="text-sm font-medium">New This Month</p>
          <p className="text-3xl font-bold">{newCustomersThisMonth}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
          <p className="text-sm font-medium">Avg Orders</p>
          <p className="text-3xl font-bold">{isNaN(avgOrders) ? 'N/A' : avgOrders.toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Customer Growth (Last 6 Months)</h2>
        <ChartComponent data={chartData} options={chartOptions} />
      </div>

      {/* Search Input below the graph */}
      <div className="mt-6 mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      </div>

      <div className="mt-6">
        <CustomerTable
          customers={currentCustomers}
          onDelete={handleDeleteCustomer}
          onEdit={handleEditCustomer}
          onView={handleViewCustomer}
        />
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
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
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="text"
                  value={editingCustomer.image || ""}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, image: e.target.value || undefined })}
                  placeholder="Enter image filename (e.g., user1.jpg)"
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