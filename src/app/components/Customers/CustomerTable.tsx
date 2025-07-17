"use client";

import React from "react";
import RemoteImage from "../RemoteImages/RemoteImageCustomer"; 
interface Customer {
  customerid: string;
  name: string;
  email: string;
  image?: string | null;
  noOfOrders?: number;
  createdat?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (customerId: string) => void;
  onEdit: (customerId: string) => void;
  onView: (customerId: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onDelete, onEdit, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
            <th className="py-3 px-4 border-b text-left">Image</th>
            <th className="py-3 px-4 border-b text-left">ID</th>
            <th className="py-3 px-4 border-b text-left">Name</th>
            <th className="py-3 px-4 border-b text-left">Email</th>
            <th className="py-3 px-4 border-b text-left">Orders</th>
            <th className="py-3 px-4 border-b text-left">Joined</th>
            <th className="py-3 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerid} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 border-b">
                <RemoteImage
                  path={customer.image || null}
                  fallback="/null-icon.png"
                  alt={`${customer.name}'s profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-4 border-b">{customer.customerid}</td>
              <td className="py-3 px-4 border-b">{customer.name}</td>
              <td className="py-3 px-4 border-b">{customer.email}</td>
              <td className="py-3 px-4 border-b">{customer.noOfOrders || 0}</td>
              <td className="py-3 px-4 border-b">
                {customer.createdat ? new Date(customer.createdat).toLocaleDateString() : "N/A"}
              </td>
              <td className="py-3 px-4 border-b space-x-2">
                <button
                  onClick={() => onView(customer.customerid)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(customer.customerid)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(customer.customerid)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;