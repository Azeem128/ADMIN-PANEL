"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const pathname = usePathname();

  const routes = [
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Moved "Dashboard" text to the left and reduced font size */}
        <h1 className="text-lg font-bold mr-auto">PakEats Admin Panel</h1>

        <div className="flex gap-6 items-center">
          {/* Routes */}
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <span
                className={`px-4 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                  pathname === route.path
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                {route.name}
              </span>
            </Link>
          ))}

          {/* Profile Icon */}
          <Link href="/profile">
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaUserCircle className="w-6 h-5 text-white" />
              <span className="text-sm font-semibold">Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";

// const NavBar = () => {
//   const pathname = usePathname();

//   const routes = [{ name: "Dashboard", path: "/dashboard" }];

//   return (
//     <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg fixed top-0 left-0 w-full z-50 h-10">
//       <div className="container mx-auto px-10 py-6 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-extrabold tracking-wide">
//             PakEats Admin Panel
//           </h1>
//         </div>

//         <div className="flex gap-5 items-center">
//           {routes.map((route) => (
//             <Link key={route.path} href={route.path}>
//               <span
//                 className={`px-5 py-2 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer ${
//                   pathname === route.path
//                     ? "bg-white text-purple-700 shadow-md"
//                     : "hover:bg-white hover:text-purple-700"
//                 }`}
//               >
//                 {route.name}
//               </span>
//             </Link>
//           ))}

//           <Link href="/profile">
//             <div className="flex items-center space-x-2 cursor-pointer hover:bg-white hover:text-purple-700 px-4 py-2 rounded-lg transition-all duration-300">
//               <FaUserCircle className="w-6 h-6" />
//               <span className="text-base font-semibold">Profile</span>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
