// 'use client';

// import { useEffect } from "react";
// // import DashboardHeader from "../components/DashBoardComponents/DashboardHeader"; // Commented out DashboardHeader import
// import DashboardCards from "../components/DashBoardComponents/DashboardCards";
// import ChartOrder from "../components/Chart";
// //import RevenueGraph from "../components/RevenueGraph";  // Commented out RevenueGraph import
// import { useReadAllOrderStatuses } from "../api/DashboardRelatedApi/Dashboard";

// // Define inline styles for zero spacing
// const noSpacingStyle = {
//   marginTop: 0,
//   paddingTop: 0,
// };

// // Custom CSS for overriding any framework styles
// const customStyles = `
//   /* Ensure no space at the top of dashboard components */
//   .dashboard-container,
//   .dashboard-header,
//   .dashboard-header h1,
//   .dashboard-cards-container,
//   .dashboard-main {
//     margin-top: 0 !important;
//     padding-top: 0 !important;
//   }

//   /* Target parent containers */
//   .layout-wrapper > div,
//   .content-area > div:first-child,
//   .min-h-screen > div:first-child {
//     margin-top: 0 !important;
//     padding-top: 0 !important;
//   }

//   /* Remove spacing from any potential container */
//   .p-6 {
//     padding-top: 0 !important;
//   }
// `;

// const DefaultLayout = ({ children }: { children: React.ReactNode }) => (
//   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//     {children}
//   </div>
// );

// export default function DashboardPage() {
//   const { data: orderStatusData, isLoading, isError, error } = useReadAllOrderStatuses();

//   // Try to import Layout, fallback to DefaultLayout if not found
//   let Layout;
//   try {
//     Layout = require("../components/Layout").default;
//   } catch {
//     Layout = DefaultLayout;
//   }

//   useEffect(() => {
//     // Inject custom CSS to override any framework styles
//     const styleElement = document.createElement("style");
//     styleElement.textContent = customStyles;
//     document.head.appendChild(styleElement);

//     // Direct DOM manipulation to remove spacing
//     setTimeout(() => {
//       // Fix any dashboard header spacing
//       const dashboardHeader = document.querySelector("h1");
//       if (dashboardHeader) {
//         dashboardHeader.style.marginTop = "0";
//         dashboardHeader.style.paddingTop = "0";

//         // Also fix parent elements
//         let parent = dashboardHeader.parentElement;
//         while (parent && parent !== document.body) {
//           parent.style.marginTop = "0";
//           parent.style.paddingTop = "0";
//           parent = parent.parentElement;
//         }
//       }

//       // Target the main container and its parents
//       const mainContainer = document.querySelector(".dashboard-main");
//       if (mainContainer) {
//         let parent = mainContainer.parentElement;
//         while (parent && parent !== document.body) {
//           parent.style.marginTop = "0";
//           parent.style.paddingTop = "0";
//           parent = parent.parentElement;
//         }
//       }
//     }, 0);

//     return () => {
//       // Clean up the injected style on component unmount
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   if (isError) {
//     return <div className="flex items-center justify-center h-screen">Error: {error?.message}</div>;
//   }

//   return (
//     <Layout>
//       {isLoading ? (
//         <div className="flex items-center justify-center h-screen">
//           <div className="animate-pulse text-xl text-blue-600">Loading dashboard data...</div>
//         </div>
//       ) : (
//         <div className="dashboard-main p-0 m-0 max-w-7xl mx-auto" style={noSpacingStyle}>
//           {/* Dashboard Header with zero spacing */}
//           {/* <div style={noSpacingStyle} className="p-0 m-0">
//             <ModifiedDashboardHeader />
//           </div> */}

//           {/* Dashboard Cards with increased size */}
//           <div className="flex flex-col gap-6 p-0 m-0" style={noSpacingStyle}>
//             <div
//               className="dashboard-cards-container bg-white p-12 rounded-2xl shadow-xl border border-gray-100"  // Increased padding here
//               style={noSpacingStyle}
//             >
//               <DashboardCards data={orderStatusData} />
//             </div>
//           </div>

//           {/* Charts with proper spacing */}
//           <div className="mt-8 px-6">
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-12">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Analytics</h2>
//               <div className="h-[450px]">
//                 <ChartOrder />
//               </div>
//             </div>

//             {/* Commented out the RevenueGraph component */}
//             {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Revenue Trends</h2>
//               <div className="h-[450px]">
//                 <RevenueGraph />
//               </div>
//             </div> */}
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }




'use client';

import { useEffect } from "react";
import DashboardCards from "../components/DashBoardComponents/DashboardCards";
import ChartOrder from "../components/Chart";
import Layout from "../components/Layout";
import { useReadAllOrderStatuses } from "../api/DashboardRelatedApi/Dashboard";

// Define inline styles for zero spacing
const noSpacingStyle = {
  marginTop: 0,
  paddingTop: 0,
};

// Custom CSS for overriding any framework styles
const customStyles = `
  /* Ensure no space at the top of dashboard components */
  .dashboard-container,
  .dashboard-header,
  .dashboard-header h1,
  .dashboard-cards-container,
  .dashboard-main {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Target parent containers */
  .layout-wrapper > div,
  .content-area > div:first-child,
  .min-h-screen > div:first-child {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Remove spacing from any potential container */
  .p-6 {
    padding-top: 0 !important;
  }
`;

export default function DashboardPage() {
  const { data: orderStatusData, isLoading, isError, error } = useReadAllOrderStatuses();

  useEffect(() => {
    // Inject custom CSS to override any framework styles
    const styleElement = document.createElement("style");
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    // Direct DOM manipulation to remove spacing
    setTimeout(() => {
      // Fix any dashboard header spacing
      const dashboardHeader = document.querySelector("h1");
      if (dashboardHeader) {
        dashboardHeader.style.marginTop = "0";
        dashboardHeader.style.paddingTop = "0";

        // Also fix parent elements
        let parent = dashboardHeader.parentElement;
        while (parent && parent !== document.body) {
          parent.style.marginTop = "0";
          parent.style.paddingTop = "0";
          parent = parent.parentElement;
        }
      }

      // Target the main container and its parents
      const mainContainer = document.querySelector(".dashboard-main");
      if (mainContainer) {
        let parent = mainContainer.parentElement;
        while (parent && parent !== document.body) {
          parent.style.marginTop = "0";
          parent.style.paddingTop = "0";
          parent = parent.parentElement;
        }
      }
    }, 0);

    return () => {
      // Clean up the injected style on component unmount
      document.head.removeChild(styleElement);
    };
  }, []);

  if (isError) {
    return <div className="flex items-center justify-center h-screen">Error: {error?.message}</div>;
  }

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-xl text-blue-600">Loading dashboard data...</div>
        </div>
      ) : (
        <div className="dashboard-main p-0 m-0 max-w-7xl mx-auto" style={noSpacingStyle}>
          {/* Dashboard Cards with increased size */}
          <div className="flex flex-col gap-6 p-0 m-0" style={noSpacingStyle}>
            <div
              className="dashboard-cards-container bg-white p-12 rounded-2xl shadow-xl border border-gray-100"
              style={noSpacingStyle}
            >
              <DashboardCards data={orderStatusData} />
            </div>
          </div>

          {/* Charts with proper spacing */}
          <div className="mt-8 px-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Analytics</h2>
              <div className="h-[450px]">
                <ChartOrder />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}