// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/supabaseClient";

// // Password validation with regex
// const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// const customerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   password: z.string().regex(
//     passwordRegex,
//     "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
//   ),
// });

// type CustomerFormData = z.infer<typeof customerSchema>;

// interface CustomerFormProps {
//   customer?: {
//     customerid: string;
//     name: string;
//     email: string;
//     phone: string | null;
//     image?: string | null;
//     password: string | null;
//   };
//   onSubmit?: (data: CustomerFormData) => Promise<void>;
// }

// // const CustomerForm: React.FC<CustomerFormProps> = ({
// //   customer,
// //   onSubmit: propOnSubmit,
// // }) => {
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm<CustomerFormData>({
// //     resolver: zodResolver(customerSchema),
// //     defaultValues: {
// //       name: customer?.name || "",
// //       email: customer?.email || "",
// //       phone: customer?.phone || "",
// //       password: customer?.password || "",
// //     },
// //   });

// //   const router = useRouter();

// //   const onSubmit = async (data: CustomerFormData) => {
// //     if (propOnSubmit) {
// //       await propOnSubmit(data);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //       <div>
// //         <label className="block text-sm font-medium">Name</label>
// //         <input type="text" {...register("name")} className="w-full p-2 border rounded" />
// //         {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
// //       </div>

// //       <div>
// //         <label className="block text-sm font-medium">Email</label>
// //         <input type="email" {...register("email")} className="w-full p-2 border rounded" />
// //         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
// //       </div>

// //       <div>
// //         <label className="block text-sm font-medium">Password</label>
// //         <input type="password" {...register("password")} className="w-full p-2 border rounded" />
// //         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
// //       </div>

// //       <div>
// //         <label className="block text-sm font-medium">Phone</label>
// //         <input type="text" {...register("phone")} className="w-full p-2 border rounded" />
// //         {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
// //       </div>

// //       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
// //         {customer?.customerid ? "Update Customer" : "Add Customer"}
// //       </button>
// //     </form>
// //   );
// // };

// // export default CustomerForm;





// const CustomerForm: React.FC<CustomerFormProps> = ({
//   customer,
//   onSubmit: propOnSubmit,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isDirty },
//   } = useForm<CustomerFormData>({
//     resolver: zodResolver(customerSchema),
//     defaultValues: {
//       name: customer?.name || "",
//       email: customer?.email || "",
//       phone: customer?.phone || "",
//       password: "", // Leave blank – we can't prefill real password
//     },
//   });

//   const router = useRouter();

//   const onSubmit = async (data: CustomerFormData) => {
//     if (propOnSubmit) {
//       await propOnSubmit(data);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Name</label>
//         <input type="text" {...register("name")} className="w-full p-2 border rounded" />
//         {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Email</label>
//         <input type="email" {...register("email")} className="w-full p-2 border rounded" />
//         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Password</label>
//         <input
//           type="password"
//           placeholder="Leave blank to keep existing password"
//           {...register("password")}
//           className="w-full p-2 border rounded"
//         />
//         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Phone</label>
//         <input type="text" {...register("phone")} className="w-full p-2 border rounded" />
//         {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
//       </div>

//       <button
//         type="submit"
//         disabled={!isDirty}
//         className={`px-4 py-2 rounded text-white ${isDirty ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
//       >
//         {customer?.customerid ? "Update Customer" : "Add Customer"}
//       </button>
//     </form>
//   );
// };

// export default CustomerForm;




"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Schema when adding a customer
const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().regex(
    passwordRegex,
    "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
  ),
});

// Schema when editing: password optional, but if entered, it must be valid
const editSchema = baseSchema.extend({
  password: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(
          passwordRegex,
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
        )
    ),
});

type CustomerFormData = z.infer<typeof baseSchema>;

interface CustomerFormProps {
  customer?: {
    customerid?: string;
    name: string;
    email: string;
    phone: string | null;
    password?: string | null;
  };
  onSubmit?: (data: CustomerFormData) => Promise<void>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit: propOnSubmit }) => {
  const isEditMode = Boolean(customer?.customerid);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(isEditMode ? editSchema : baseSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      password: "", // Leave password empty for edit
    },
  });

  const router = useRouter();

  const onSubmit = async (data: CustomerFormData) => {
    // Remove password if left blank in edit mode
    if (isEditMode && !data.password) {
      delete data.password;
    }

    if (propOnSubmit) {
      await propOnSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input type="text" {...register("name")} className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register("email")} className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder={isEditMode ? "Leave blank to keep existing password" : ""}
          {...register("password")}
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input type="text" {...register("phone")} className="w-full p-2 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isDirty}
        className={`px-4 py-2 rounded text-white ${isDirty ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {isEditMode ? "Update Customer" : "Add Customer"}
      </button>
    </form>
  );
};

export default CustomerForm;
