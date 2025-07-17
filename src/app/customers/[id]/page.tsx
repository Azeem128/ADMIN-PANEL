"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useCustomerContext } from "@/providers/CustomerProvider";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface Customer {
  customerid: string;
  name: string;
  email: string;
  
  image: string | null;
}

const CustomerEditPage = () => {
  const { customerData } = useCustomerContext();
  const { id } = useParams() as { id?: string };
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase if not in context
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        toast.error("Invalid customer ID in URL");
        setLoading(false);
        return;
      }

      if (customerData && customerData.customerid === id) {
        setCustomer({
          customerid: customerData.customerid,
          name: customerData.name || "",
          email: customerData.email || "",
       
          image: customerData.image || null,
        });
        setLoading(false);
      } else {
        // Fallback: fetch from Supabase
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("customerid", id)
          .single();

        if (error) {
          console.error("Supabase fetch error:", error);
          toast.error("Customer not found");
        } else {
          setCustomer({
            customerid: data.customerid,
            name: data.name,
            email: data.email,
           
            image: data.image || null,
          });
        }
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, customerData]);

  const handleUpdate = async (updatedData: { name: string; email: string;  password: string }) => {
    try {
      const { data: customerUpdateData, error: customerError } = await supabase
        .from("customers")
        .update({
          name: updatedData.name,
          email: updatedData.email,
         
          updatedat: new Date().toISOString(),
        })
        .eq("customerid", id);

      if (customerError) throw customerError;

      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        email: updatedData.email,
        password: updatedData.password || undefined,
        user_metadata: {
          full_name: updatedData.name,
        },
      });

      if (authError) throw authError;

      toast.success("Customer updated successfully");
      router.push("/customers");
    } catch (err: any) {
      console.error("Update Error:", err);
      toast.error("Failed to update customer: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading customer...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">Error: Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CustomerForm
        customer={customer}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default CustomerEditPage;
