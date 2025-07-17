
"use client";

import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme"; // Optional custom theme
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import { SearchProvider } from "@/providers/SearchProvider";
import {useState} from 'react';

export const metadata: Metadata = {
  title: "PakEats Admin",
  description: "Admin dashboard for PakEats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <SearchProvider>
        <div className="flex h-screen fixed top-0 bottom-0 left-0 right-0">
          {/* Sidebar - Fixed */}
          <div className="fixed top-0 left-0 h-full z-50">
            <Sidebar collapse={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>

          {/* Main Content Area */}
          <div
            className={`flex flex-col flex-1 overflow-auto transition-all duration-300 ${
              isCollapsed ? "ml-16" : "ml-64"
            }`}
          >
            <NavBar />
            <main className="mt-16 p-6 bg-gray-100 flex-1">{children}</main>
          </div>
        </div>
      </SearchProvider>
    </MantineProvider>
  );
}