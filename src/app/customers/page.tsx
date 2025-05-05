'use client';

import React from "react";
import Layout from "../components/Layout";
import CustomerTable from "../components/Customers/CustomerTable";

export default function CustomersPage() {

  return (
    <Layout>
      <h1 className="text-2xl font-bold my-4">Customers</h1>
      {/* Commented out the grid with other components */}
      {/* <div className="grid grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">75</h2>
          <p>Total Active Customers</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">357</h2>
          <p>Total Delivered</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">65</h2>
          <p>Total Canceled</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">$128</h2>
          <p>Total Revenue</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Chart />
        <RevenueGraph />
      </div> */}

      {/* Only displaying the CustomerTable */}
      <div className="mt-6">
        <CustomerTable />
      </div>
    </Layout>
  );
}
