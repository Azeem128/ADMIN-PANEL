"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomerForm from "../../components/CustomerForm";
import { supabase } from "@/lib/supabaseClient";

const AddCustomerPage = () => {
  const router = useRouter();

const handleAddCustomer = async (formData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const { name, email, phone, password } = formData;

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: name,
        full_name: name,
      },
    },
  });

  if (signUpError) {
    console.error("Sign Up Error:", signUpError);
    toast.error("Failed to sign up: " + signUpError.message);
    return;
  }

  const userId = data?.user?.id;

  if (data?.user) {
    const { user_metadata } = data.user;

    const { error: insertError } = await supabase.from("customers").insert({
      customerid: userId,
      email: email,
      name: user_metadata.username,
      phone: phone,
    });

    if (insertError) {
      console.error("Customer Insert Error:", insertError);

      // 👇 Delete the user from auth to avoid orphaned account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.error("Rollback failed: Could not delete user from auth", deleteError);
        toast.error("Rollback failed. Manual cleanup needed.");
      } else {
        toast.error("Failed to add customer. Auth entry rolled back.");
      }

      return;
    }

    // Success
    toast.success("Customer added successfully!");
    router.push("/customers");
  }
};


  return (
    <div className="p-6">
      <CustomerForm
        customer={{
          customerid: "",
          name: "",
          email: "",
          phone: "",
          password: "",
          image: "",
        }}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default AddCustomerPage;
