
"use client";

import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-center relative">
        <h1 className="text-lg font-bold text-teal-300">PakEats Admin Panel</h1>
        <Link href="/profile" className="absolute right-6 flex items-center space-x-2 cursor-pointer hover:text-teal-300 transition-colors duration-200">
          <FaUserCircle className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
