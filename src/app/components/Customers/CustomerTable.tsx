
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useReadCustomers } from "@/app/api/CustomerRelatedApi/customer";
// import { useCustomerContext } from "@/providers/CustomerProvider";
// import { supabase } from "@/lib/supabaseClient";

// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   createdat: string;
//   noOfOrders: number;
//   lastOrder: string;
//   completedOrders: number;
//   cancelledOrders: number;
//   location: string;
//   totalSpent: number;
// }

// const recordsPerPage: number = 7;

// const CustomerTable: React.FC = () => {
//   const { data, isLoading, isError, error: err } = useReadCustomers();
//   const { setCustomerData } = useCustomerContext();
//   const router = useRouter();

//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   useEffect(() => {
//     if (data) {
//       setCustomers(data);
//     }

//     // Real-time subscription for customers
//     const subscription = supabase
//       .channel("customers-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "Customers" },
//         (payload) => {
//           const newCustomer = payload.new as Customer;
//           setCustomers((prev) => [...prev, newCustomer]);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">Loading...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-red-600">Error: {err.message}</p>
//       </div>
//     );
//   }

//   if (!data || customers.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">No customers available.</p>
//       </div>
//     );
//   }

//   const totalPages: number = Math.ceil(customers.length / recordsPerPage);
//   const indexOfLastRecord: number = currentPage * recordsPerPage;
//   const indexOfFirstRecord: number = indexOfLastRecord - recordsPerPage;
//   const currentRecords: Customer[] = customers.slice(indexOfFirstRecord, indexOfLastRecord);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow w-full max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-lg font-bold">All Customers</h2>
//         <button
//           onClick={() => router.push("/customers/add")}
//           className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
//         >
//           Add Customer
//         </button>
//       </div>

//       <div className="w-full">
//         <table className="w-full border-collapse border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left text-xs">
//               <th className="p-1 border border-gray-200 min-w-[80px]">Customer ID</th>
//               <th className="p-1 border border-gray-200 min-w-[100px]">Name</th>
//               <th className="p-1 border border-gray-200 min-w-[150px]">Email</th>
//               <th className="p-1 border border-gray-200 min-w-[120px]">Created At</th>
//               <th className="p-1 border border-gray-200 min-w-[120px]">Actions</th>
//               <th className="p-1 border border-gray-200 min-w-[100px]">View Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.length > 0 ? (
//               currentRecords.map((customer: Customer) => (
//                 <tr
//                   key={customer.customerid || `customer-${customer.name}`}
//                   className="border border-gray-200 transition duration-200 hover:bg-gray-100"
//                 >
//                   <td className="p-1 border border-gray-200 text-xs">{customer.customerid || "N/A"}</td>
//                   <td className="p-1 border border-gray-200 text-xs">{customer.name}</td>
//                   <td className="p-1 border border-gray-200 text-xs truncate">{customer.email}</td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     {new Date(customer.createdat).toLocaleString()}
//                   </td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     <button
//                       onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
//                         e.stopPropagation();
//                         setCustomerData(customer);
//                         router.push(`/customers/${encodeURIComponent(customer.customerid)}`);
//                       }}
//                       className="bg-blue-500 text-white px-1 py-0.5 rounded-lg mr-1 hover:bg-blue-600 text-xs"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
//                         e.stopPropagation();
//                         alert(`Delete Customer: ${customer.name}`);
//                       }}
//                       className="bg-red-500 text-white px-1 py-0.5 rounded-lg hover:bg-red-600 text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     <button
//                       onClick={() => {
//                         router.push(`/customer-detail/${encodeURIComponent(customer.customerid)}`);
//                       }}
//                       className="bg-green-500 text-white px-1 py-0.5 rounded-lg hover:bg-green-600 text-xs"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="p-2 text-center text-gray-500">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-3">
//           <button
//             onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <div className="flex space-x-1">
//             {Array.from({ length: totalPages }, (_, i: number) => (
//               <button
//                 key={i + 1}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 rounded-lg text-xs ${
//                   currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerTable;
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useReadCustomers } from "@/app/api/CustomerRelatedApi/customer";
// import { useCustomerContext } from "@/providers/CustomerProvider";
// import { supabase } from "@/lib/supabaseClient";
// import { toast } from "react-toastify";
// import Link from "next/link";

// interface Customer {
//   customerid: string;
//   name: string;
//   email: string;
//   createdat: string;
//   noOfOrders: number;
//   lastOrder: string;
//   completedOrders: number;
//   cancelledOrders: number;
//   location: string;
//   totalSpent: number;
// }

// const recordsPerPage: number = 7;

// const CustomerTable: React.FC = () => {
//   const { data, isLoading, isError, error: err } = useReadCustomers();
//   const { setCustomerData } = useCustomerContext();
//   const router = useRouter();

//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   useEffect(() => {
//     if (data) {
//       setCustomers(data);
//     }

//     // Real-time subscription for customers
//     const subscription = supabase
//       .channel("customers-channel")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "Customers" },
//         (payload) => {
//           const newCustomer = payload.new as Customer;
//           setCustomers((prev) => [...prev, newCustomer]);
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "Customers" },
//         (payload) => {
//           const updatedCustomer = payload.new as Customer;
//           setCustomers((prev) =>
//             prev.map((customer) =>
//               customer.customerid === updatedCustomer.customerid
//                 ? { ...customer, ...updatedCustomer }
//                 : customer
//             )
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "Customers" },
//         (payload) => {
//           const deletedCustomerId = payload.old.CustomerId as string;
//           setCustomers((prev) =>
//             prev.filter((customer) => customer.customerid !== deletedCustomerId)
//           );
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [data]);

//   const handleDeleteCustomer = async (customerId: string, customerName: string) => {
//     if (!confirm(`Are you sure you want to delete customer: ${customerName}?`)) return;

//     const { error } = await supabase
//       .from("Customers")
//       .delete()
//       .eq("CustomerId", customerId);

//     if (error) {
//       toast.error("Failed to delete customer: " + error.message);
//     } else {
//       toast.success("Customer deleted successfully!");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">Loading...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-red-600">Error: {err.message}</p>
//       </div>
//     );
//   }

//   if (!data || customers.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-gray-600">No customers available.</p>
//       </div>
//     );
//   }

//   const totalPages: number = Math.ceil(customers.length / recordsPerPage);
//   const indexOfLastRecord: number = currentPage * recordsPerPage;
//   const indexOfFirstRecord: number = indexOfLastRecord - recordsPerPage;
//   const currentRecords: Customer[] = customers.slice(indexOfFirstRecord, indexOfLastRecord);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow w-full max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-lg font-bold">All Customers</h2>
//         <button
//           onClick={() => router.push("/customers/add")}
//           className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
//         >
//           Add Customer
//         </button>
//       </div>

//       <div className="w-full">
//         <table className="w-full border-collapse border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left text-xs">
//               <th className="p-1 border border-gray-200 min-w-[80px]">Customer ID</th>
//               <th className="p-1 border border-gray-200 min-w-[100px]">Name</th>
//               <th className="p-1 border border-gray-200 min-w-[150px]">Email</th>
//               <th className="p-1 border border-gray-200 min-w-[120px]">Created At</th>
//               <th className="p-1 border border-gray-200 min-w-[120px]">Actions</th>
//               <th className="p-1 border border-gray-200 min-w-[100px]">View Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.length > 0 ? (
//               currentRecords.map((customer: Customer) => (
//                 <tr
//                   key={customer.customerid || `customer-${customer.name}`}
//                   className="border border-gray-200 transition duration-200 hover:bg-gray-100"
//                 >
//                   <td className="p-1 border border-gray-200 text-xs">{customer.customerid || "N/A"}</td>
//                   <td className="p-1 border border-gray-200 text-xs">{customer.name}</td>
//                   <td className="p-1 border border-gray-200 text-xs truncate">{customer.email}</td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     {new Date(customer.createdat).toLocaleString()}
//                   </td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     <button
//                       onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
//                         e.stopPropagation();
//                         setCustomerData(customer);
//                         router.push(`/customers/${encodeURIComponent(customer.customerid)}`);
//                       }}
//                       className="bg-blue-500 text-white px-1 py-0.5 rounded-lg mr-1 hover:bg-blue-600 text-xs"
//                     >
//                       Edit
//                     </button>
//                     <Link
//   href={`/customers/delete/${customer.customerid}`}
//   className="bg-red-500 text-white px-1 py-0.5 rounded-lg hover:bg-red-600 text-xs"
// >
//   Delete
// </Link>

//                   </td>
//                   <td className="p-1 border border-gray-200 text-xs">
//                     <button
//                       onClick={() => {
//                         router.push(`/customer-detail/${encodeURIComponent(customer.customerid)}`);
//                       }}
//                       className="bg-green-500 text-white px-1 py-0.5 rounded-lg hover:bg-green-600 text-xs"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="p-2 text-center text-gray-500">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-3">
//           <button
//             onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <div className="flex space-x-1">
//             {Array.from({ length: totalPages }, (_, i: number) => (
//               <button
//                 key={i + 1}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 rounded-lg text-xs ${
//                   currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerTable;


// src/components/Customers/CustomerTable.tsx

"use client";

import React from "react";
import RemoteImage from "../RemoteImages/RemoteImageCustomer";

interface Customer {
  customerid: string;
  name: string;
  phone: string | null;
  createdat: string;
  profile_image: string | null;
}

interface CustomerTableProps {
  customers: Customer[] | null;
  onDelete?: (customerId: string) => void;
  onEdit?: (customerId: string) => void;
  onView?: (customerId: string) => void;
}

const CustomerTable = ({ customers, onDelete, onEdit, onView }: CustomerTableProps) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-600">No customers available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-blue-900">Profile</th>
            <th className="p-3 text-blue-900">Customer ID</th>
            <th className="p-3 text-blue-900">Name</th>
            <th className="p-3 text-blue-900">Phone</th>
            <th className="p-3 text-blue-900">Joined At</th>
            <th className="p-3 text-blue-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerid} className="border-b">
              <td className="p-3">
                <RemoteImage
                  path={customer.profile_image || ""}
                  fallback="/null-icon.png"
                  alt={`Profile of ${customer.name}`}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              </td>
              <td className="p-3">{customer.customerid}</td>
              <td className="p-3">{customer.name}</td>
              <td className="p-3">{customer.phone || "N/A"}</td>
              <td className="p-3">{new Date(customer.createdat).toLocaleString()}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(customer.customerid)}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(customer.customerid)}
                      className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(customer.customerid)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;