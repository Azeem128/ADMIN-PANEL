// "use client";

// import { useState } from "react";
// import { updateCustomer } from "../../api/customers";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { createClient } from "@supabase/supabase-js";
// import { useCustomerContext } from "@/providers/CustomerProvider";
// import RemoteImage from "../RemoteImages/RemoteImageCustomer";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface CustomerFormProps {
//   customer: {
//     customerid: string;
//     name: string;
//     email: string;
//     // image: string | null;
//     phone: string | null;
//   };
// }

// const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit }) => {

//   const [formData, setFormData] = useState({
//     name: customer.name || "",
//     email: customer.email || "",
//     phone: customer.phone || "",
//     image: customer.image || "",
//     // imageName: customer.image ? customer.image.split("/").pop() : "No image",
//   });
//   const initialFormData = {
//     name: customer.name || "",
//     email: customer.email || "",
//     phone: customer.phone || "",
//   };

//   const [previewUrl, setPreviewUrl] = useState<string>(customer.image || "");
//   const [fileUpload, setFileUpload] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     const file = e.target.files[0];
//     setFileUpload(file);
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     toast.info("Updating customer...");

//     let imageUrl = formData.image;

//     if (fileUpload) {
//       const filePath = `customers/${customer.customerid}-${fileUpload.name}`;
//       const { data, error } = await supabase.storage
//         .from("profile-images")
//         .upload(filePath, fileUpload, { upsert: true });

//       if (error) {
//         toast.error("Image upload failed");
//         setLoading(false);
//         return;
//       }

//       imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
//     }

//     await onSubmit({ ...formData, image: imageUrl });

//     toast.success("Customer updated!");
//     router.push("/customers");
//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
//       <h2 className="text-xl font-bold text-center mb-4">Edit Customer</h2>

//       {/* Profile Image */}
//       <div className="flex flex-col items-center mb-4">
//         {previewUrl ? (
//           <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
//         ) : (
//           <RemoteImage path={formData.image} alt="Profile Image" fallback="fallback-url" />
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="mt-2"
//         />
//       </div>

//       <input
//         type="text"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         className="w-full border p-2 mb-3 rounded"
//         placeholder="Name"
//       />

//       <input
//         type="email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         className="w-full border p-2 mb-3 rounded"
//         placeholder="Email"
//       />

//       <input
//         type="text"
//         name="phone"
//         value={formData.phone || ""}
//         onChange={handleChange}
//         className="w-full border p-2 mb-3 rounded"
//         placeholder="Phone"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//       >
//         {loading ? "Updating..." : "Update Customer"}
//       </button>
//     </form>
//   );
// };

// export default CustomerForm;







//   // const [imageShow, setImageShow] = useState(customer.image ? customer.image.split("/").pop() : "No image");
//   // const [isImageUpload, setIsImageUpload] = useState(false);

//   // const isFormChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);

//   // const [loading, setLoading] = useState(false);
//   // const router = useRouter();

//   // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const { name, value } = e.target;
//   //   setFormData((prev) => ({ ...prev, [name]: value }));
//   // };

//   // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   setIsImageUpload(true);
//   //   if (!e.target.files || e.target.files.length === 0) return;

//   //   const file = e.target.files[0];
//   //   // const filePath = `{customer.customerid}-${file.name}`;

//   //   // setLoading(true);
//   //   // toast.info("Uploading image...", { autoClose: 2000 });

//   //   // const { data, error } = await supabase.storage
//   //   //   .from("profile-images")
//   //   //   .upload(filePath, file, { upsert: true });

//   //   // setTimeout(() => {
//   //   //   if (error) {
//   //   //     toast.error("Failed to upload image.");
//   //   //   } else {
//   //   //     const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
//   //   //     setFormData((prev) => ({ ...prev, image: publicUrl, imageName: file.name }));
//   //   //     toast.success("Image uploaded successfully!");
//   //   //   }
//   //   //   setLoading(false);
//   //   // }, 2000);

//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onloadend = () => {
//   //       setFormData((prev) => ({
//   //         ...prev, image: file.name,
//   //       }));
//   //       setImageShow(reader.result as string);
//   //     };
//   //     reader.readAsDataURL(file);
//   //   }
//   // };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   toast.info("Updating customer...");

//   //   // const { data, error } = await updateCustomer(customer.customerid, formData);
//   //   if(isImageUpload) {
//   //     const { data, error } = await supabase.storage
//   //       .from("profile-images")
//   //       .upload(formData.image, imageShow, { upsert: true });

//   //     if (error) {
//   //       toast.error("Failed to upload image.");
//   //       setLoading(false);
//   //       return;
//   //     } 
//   //     // else {
//   //     //   const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
//   //     //   formData.image = publicUrl;
//   //     // }
//   //   }
//   //   await onSubmit(formData);
//   //   // setTimeout(() => {
//   //   //   if (error) {
//   //   //     toast.error("Failed to update customer.");
//   //   //   } else {
//   //   //     toast.success("Customer updated successfully!");
//   //   //     router.push("/customers");
//   //   //   }
//   //   //   setLoading(false);
//   //   // }, 2000);
//   // };

// //   return (
// //     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
// //       <h2 className="text-xl font-bold text-center mb-4">Edit Customer</h2>

// //       {/* Profile Image */}
// //       <div className="flex flex-col items-center">

// //         {!isImageUpload ? (
// //           <RemoteImage
// //             path={formData.image}
// //             alt="Profile Image"
// //             fallback="data:image/jpeg;base64,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"
// //             width={120}
// //             height={120}
// //             className="mb-3 rounded-full shadow-lg border"
// //           />
// //         ) : (
// //           <img
// //             src={imageShow}
// //             alt="Uploaded preview"
// //             className="w-64 h-auto rounded shadow"
// //           />
// //         )
// //         }

// //         <input
// //           type="text"
// //           name="imageName"
// //           value={formData?.image}
// //           readOnly
// //           className="border p-2 rounded w-full text-center mb-2"
// //         />
// //         <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
// //       </div>

// //       {/* Form Fields */}
// //       <div className="flex flex-col mt-4">
// //         <label className="font-medium">Name</label>
// //         <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
// //       </div>

// //       <div className="flex flex-col mt-2">
// //         <label className="font-medium">Email</label>
// //         <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
// //       </div>

// //       <div className="flex flex-col mt-2">
// //         <label className="font-medium">Phone</label>
// //         <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 rounded" />
// //       </div>

// //       {/* Submit Button */}
// //       <button
// //         type="submit"
// //         className={`px-4 py-2 rounded mt-4 w-full flex justify-center items-center transition
// //     ${loading || !isFormChanged
// //             ? "bg-blue-900 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 
// //     text-white`}
// //         disabled={loading || !isFormChanged}
// //       >
// //         {loading ? (
// //           <>
// //             <svg
// //               className="animate-spin h-5 w-5 mr-2 text-white"
// //               xmlns="http://www.w3.org/2000/svg"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //             >
// //               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// //               <path
// //                 className="opacity-75"
// //                 fill="currentColor"
// //                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
// //               />
// //             </svg>
// //             Updating...
// //           </>
// //         ) : (
// //           "Update Customer"
// //         )}
// //       </button>

// //     </form>
// //   );
// // };

// // export default CustomerForm;




"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RemoteImage from "../RemoteImages/RemoteImageCustomer";

interface CustomerFormProps {
  customer: {
    customerid: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    image: string;
  }) => Promise<void>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    image: customer.image || "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>(customer.image || "");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setFileUpload(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.info("Processing customer...");

    let imageUrl = formData.image;

    if (fileUpload) {
      const filePath = `customers/${customer.customerid || crypto.randomUUID()}-${fileUpload.name}`;
      // const { data, error } = await supabase.storage
      //   .from("profile-images")
      //   .upload(filePath, fileUpload, { upsert: true });

      // if (error) {
      //   toast.error("Image upload failed: " + error.message);
      //   setLoading(false);
      //   return;
      // }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${filePath}`;
      imageUrl = publicUrl;
    }

    try {
      await onSubmit({ ...formData, image: imageUrl });
    } catch (err) {
      toast.error("Operation failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">
        {customer.customerid ? "Edit Customer" : "Add Customer"}
      </h2>

     {/* Profile Image */}
     <div className="flex flex-col items-center mb-4">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
        ) : customer.image ? (
          <RemoteImage path={customer.image} alt="Profile Image" fallback="fallback-url" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2"
        />
      </div>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="Name"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="Email"
        required
      />

      <input
        type="text"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="Phone"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : customer.customerid ? "Update Customer" : "Add Customer"}
      </button>
    </form>
  );
};

export default CustomerForm;

