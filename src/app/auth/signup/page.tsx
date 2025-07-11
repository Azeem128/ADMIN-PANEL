// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signupAdmin } from "../../../lib/auth";

// export default function SignupPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signupAdmin(email, password);
//       router.push("/dashboard"); // Redirect after signup
//     } catch (err: Error) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center">Admin Signup</h2>
//         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         <form onSubmit={handleSignup} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 border rounded-lg"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 border rounded-lg"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="text-sm text-center mt-4">
//           Already have an account? <a href="/auth/login" className="text-green-500">Login</a>
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupAdmin } from "../../../lib/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupAdmin(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Signup</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4 animate-pulse">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account? <a href="/auth/login" className="text-teal-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}