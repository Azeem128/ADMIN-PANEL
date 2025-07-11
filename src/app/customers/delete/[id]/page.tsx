// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/supabaseClient";

// const CustomerDeletePage = () => {
//   const { id } = useParams() as { id?: string };
//   const router = useRouter();
//   const [deleting, setDeleting] = useState(true);

//   useEffect(() => {
//     const deleteCustomer = async () => {
//       if (!id) {
//         toast.error("Missing customer ID");
//         setDeleting(false);
//         return;
//       }

//       try {
//         // Delete from customers table
//         const { error: tableError } = await supabase
//           .from("customers")
//           .delete()
//           .eq("customerid", id);

//         if (tableError) throw tableError;

//         // Delete from Supabase Auth
//         const { error: authError } = await supabase.auth.admin.deleteUser(id);
//         if (authError) throw authError;

//         toast.success("Customer deleted successfully");
//         router.push("/customers");
//       } catch (error: any) {
//         console.error("Delete error:", error);
//         toast.error("Failed to delete customer: " + error.message);
//       } finally {
//         setDeleting(false);
//       }
//     };

//     deleteCustomer();
//   }, [id, router]);

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <p className="text-lg">
//         {deleting ? "Deleting customer..." : "Redirecting..."}
//       </p>
//     </div>
//   );
// };

// export default CustomerDeletePage;
// app/customers/delete/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";

const CustomerDeletePage = () => {
  const router = useRouter();
  const { id } = useParams() as { id?: string };

  useEffect(() => {
    const deleteCustomer = async () => {
      if (!id) {
        toast.error("Invalid customer ID");
        router.push("/customers");
        return;
      }

      // Deletion logic (no confirm here, handled in CustomersPage)
      const { error: customerError } = await supabase
        .from("customers")
        .delete()
        .eq("customerid", id);

      if (customerError) {
        toast.error(`Error deleting customer: ${customerError.message}`);
      } else {
        const { data: authUser, error: getUserError } = await supabase.auth.admin.getUserById(id);
        let authMessage = "";
        if (getUserError || !authUser) {
          authMessage = " (User not found in auth, skipping auth deletion)";
        } else {
          const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
          authMessage = authDeleteError ? ` (Error deleting auth user: ${authDeleteError.message})` : " (Auth user deleted successfully)";
        }
        toast.success(`Customer deleted successfully${authMessage}`);
      }

      setTimeout(() => router.push("/customers"), 1000);
    };

    deleteCustomer();
  }, [id, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg text-gray-700">Deleting customer...</p>
    </div>
  );
};

export default CustomerDeletePage;