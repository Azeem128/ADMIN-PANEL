"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
// import SearchBar from "./SearchBar";
import { FaBars } from "react-icons/fa";
import NavBar from "./NavBar"; // Import the NavBar component
import { SearchProvider } from "@/providers/SearchProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SearchProvider>
      <div className="flex h-screen fixed top-0 bottom-0 left-0 right-0">
        {/* Sidebar - Fixed from top to bottom */}
        <div className="fixed top-0 left-0 h-full">
          <Sidebar collapse={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        {/* Main Content Wrapper */}
        <div className={`flex flex-col flex-1 scroll overflow-auto transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`}>
          {/* NavBar - Fixed at the top with black background */}
          <NavBar />

          {/* Main Content - Positioned under the fixed navbar */}
          <main className="mt-16 p-6 bg-gray-100 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;