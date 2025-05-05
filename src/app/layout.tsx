
import "./globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { CustomerProvider } from "@/providers/CustomerProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MyApp",
  description: "A Next.js app with dynamic navigation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <QueryProvider>
          <CustomerProvider>
            <div className="flex h-screen">
              {/* Sidebar (Fixed) */}

              {/* Main Content (Takes remaining space & scrolls) */}
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
            
            {/* ✅ Toast container added globally */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CustomerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
