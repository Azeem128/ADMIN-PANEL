
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