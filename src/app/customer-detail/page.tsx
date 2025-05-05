// "use client";

// import Layout from "../components/Layout";
// import { useState } from "react";

// const dummyCustomerDetails = {
//     id: 1,
//     name: "John Doe",
//     email: "johndoe@example.com",
//     phone: "+1 123 456 7890",
//     totalOrders: 15,
//     totalSpent: "$450",
//     status: "Active",
//     address: "123 Main St, New York, NY, USA"
// };

// export default function CustomerDetailPage() {
//     const [customer] = useState(dummyCustomerDetails);

//     return (
//         <Layout>
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">👤 Customer Details</h1>

//             <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-semibold">{customer.name}</h2>
//                 <p className="text-gray-600">{customer.email}</p>

//                 <div className="mt-4">
//                     <p><strong>📞 Phone:</strong> {customer.phone}</p>
//                     <p><strong>📍 Address:</strong> {customer.address}</p>
//                     <p><strong>🛒 Total Orders:</strong> {customer.totalOrders}</p>
//                     <p><strong>💰 Total Spent:</strong> {customer.totalSpent}</p>
//                     <p className={`font-bold ${customer.status === "Active" ? "text-green-600" : "text-red-600"}`}>
//                         {customer.status}
//                     </p>
//                 </div>
//             </div>
//         </div>
//         </Layout>
//     );
// }


// "use client"; 

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { getAllCustomers } from "../api/customers";

// // Define the Customer interface
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

// // Define the API response type
// interface ApiResponse {
//   data: Customer[] | null;
//   error: string | null;
// }

// const CustomerDetail: React.FC = () => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const params = useParams();
//   const customerId = params?.customerid as string;

//   useEffect(() => {
//     async function fetchCustomer(): Promise<void> {
//       if (!customerId) {
//         setError("Customer ID not provided");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       const response: ApiResponse = await getAllCustomers();
//       const { data, error } = response;
//       if (error) {
//         setError(error);
//       } else if (data) {
//         const foundCustomer = data.find((c: Customer) => c.customerid === customerId);
//         if (foundCustomer) {
//           setCustomer(foundCustomer);
//         } else {
//           setError("Customer not found");
//         }
//       }
//       setLoading(false);
//     }

//     fetchCustomer();
//   }, [customerId]);

//   if (loading) {
//     return <p className="text-gray-600">Loading...</p>;
//   }

//   if (error || !customer) {
//     return <p className="text-red-500">{error || "Customer not found"}</p>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <h1 className="text-2xl font-bold mb-6">Customer Detail</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Section */}
//         <div className="col-span-1 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">{customer.name}</h2>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Email:</span> {customer.email}
//           </p>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Location:</span> {customer.location}
//           </p>
//           <p className="text-gray-600 mb-2">
//             <span className="font-semibold">Joined:</span>{" "}
//             {new Date(customer.createdat).toLocaleString()}
//           </p>
//         </div>

//         {/* Details Section */}
//         <div className="col-span-2 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold mb-4">Order Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Customer ID:</span> {customer.customerid}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Total Orders:</span> {customer.noOfOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Last Order:</span> {customer.lastOrder}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Completed Orders:</span>{" "}
//                 {customer.completedOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Cancelled Orders:</span>{" "}
//                 {customer.cancelledOrders}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Total Spent:</span> ${customer.totalSpent}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Placeholder for Future Sections (like "Most Ordered Food" or "Most Liked Food") */}
//       <div className="mt-6 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Additional Information</h2>
//         <p className="text-gray-600">
//           This section can be expanded to include more details such as "Most Ordered Food" or
//           "Most Liked Food" as shown in the design.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CustomerDetail;


"use client"; 

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAllCustomers } from "../api/customers";

// Define the Customer interface
interface Customer {
  customerid: string;
  name: string;
  email: string;
  createdat: string;
  noOfOrders: number;
  lastOrder: string;
  completedOrders: number;
  cancelledOrders: number;
  location: string;
  totalSpent: number;
}

// Define the API response type
interface ApiResponse {
  data: Customer[] | null;
  error: string | null;
}

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const customerId = params?.customerid as string;

  useEffect(() => {
    async function fetchCustomer(): Promise<void> {
      if (!customerId) {
        setError("Customer ID not provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response: ApiResponse = await getAllCustomers();
      const { data, error } = response;
      if (error) {
        setError(error);
      } else if (data) {
        const foundCustomer = data.find((c: Customer) => c.customerid === customerId);
        if (foundCustomer) {
          setCustomer(foundCustomer);
        } else {
          setError("Customer not found");
        }
      }
      setLoading(false);
    }

    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error || !customer) {
    return <p className="text-red-500">{error || "Customer not found"}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Detail</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{customer.name}</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Email:</span> {customer.email}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Location:</span> {customer.location}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Joined:</span>{" "}
            {new Date(customer.createdat).toLocaleString()}
          </p>
        </div>

        {/* Details Section */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Customer ID:</span> {customer.customerid}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Total Orders:</span> {customer.noOfOrders}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Last Order:</span> {customer.lastOrder}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Completed Orders:</span>{" "}
                {customer.completedOrders}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Cancelled Orders:</span>{" "}
                {customer.cancelledOrders}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Total Spent:</span> ${customer.totalSpent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Future Sections (like "Most Ordered Food" or "Most Liked Food") */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Additional Information</h2>
        <p className="text-gray-600">
          This section can be expanded to include more details such as &quot;Most Ordered Food&quot; or
          &quot;Most Liked Food&quot; as shown in the design.
        </p>
      </div>
    </div>
  );
};

export default CustomerDetail;