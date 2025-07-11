"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartPie, FaList, FaUser, FaSignOutAlt, FaBars, FaUtensils, FaStore, FaComments, FaChartBar, FaWallet } from "react-icons/fa";
import { logoutAdmin } from "../../lib/auth";
import { useRouter } from "next/navigation";

const Sidebar = ({ collapse, setIsCollapsed }: { collapse: boolean; setIsCollapsed: (value: boolean) => void }) => {
    const pathname = usePathname();
    const router = useRouter();

    const toggleCollapse = () => {
        setIsCollapsed(!collapse);
    };

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <FaChartPie /> },
        { name: "Customers", path: "/customers", icon: <FaUser /> },
        { name: "Riders", path: "/riders", icon: <FaUser /> },
        { name: "Restaurant Owners", path: "/restaurant-owner", icon: <FaUser /> },
        { name: "Restaurant Details", path: "/restaurant-details", icon: <FaStore /> },
        { name: "Foods", path: "/food", icon: <FaUtensils /> },
        { name: "Order List", path: "/ordersList", icon: <FaList /> },
       { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
      { name: "Reviews", path: "/reviews", icon: <FaComments /> },
       { name: "Food Detail", path: "/food-detail", icon: <FaUtensils /> },
      //{ name: "Customer Detail", path: "/customer-detail", icon: <FaUser /> },
    
    { name: "Chat", path: "/chat", icon: <FaComments /> },
    { name: "Wallet", path: "/wallet", icon: <FaWallet /> },
    ];

    const logoutAdminHere = async () => {
        await logoutAdmin();
        router.push('/auth/login')
    }

    return (
        <aside className={`h-screen bg-gray-900 text-white p-3 fixed top-0 left-0 transition-all duration-300 flex flex-col justify-between 
            ${collapse ? "w-16" : "w-64"}`}
        >
            {/* Sidebar Header */}
            <div className="flex flex-col h-[80%] overflow-hidden">
                <h2 className={`text-xl font-bold text-center py-2 break-words transition-all duration-300 
                    ${collapse ? "w-12 leading-tight" : "w-full"}`}
                >
                    PakEats.
                </h2>

                <nav className="flex-1 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path || pathname.startsWith(item.path);

                        return (
                            <div key={item.path} className="relative group">
                                <Link
                                    href={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-all duration-300 
                                        ${isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-green-800"}`}
                                >
                                    <div className="w-12 flex justify-center">{item.icon}</div>
                                    <span className={`transition Accepting-all duration-300 overflow-hidden 
                                        ${collapse ? "opacity-0 w-0" : "opacity-100 w-full"}`}>
                                        {item.name}
                                    </span>
                                </Link>

                                {/* Tooltip for Collapsed Sidebar */}
                                {collapse && (
                                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar Footer (Logout & Collapse Button) */}
            <div className="mt-auto">
                {/* Logout Button */}
                <button className="flex items-center p-3 text-red-400 w-full relative group hover:bg-gray-800 rounded-lg"
                    onClick={() => logoutAdminHere()}
                >
                    <div className="w-12 flex justify-center"><FaSignOutAlt /></div>
                    <span className={`flex items-start justify-start transition-all duration-300 overflow-hidden 
                        ${collapse ? "opacity-0 w-0" : "opacity-100 w-full"}`}>
                        Logout
                    </span>

                    {/* Tooltip for Logout */}
                    {collapse && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            Logout
                        </span>
                    )}
                </button>

                {/* Collapse Button */}
                <button
                    onClick={toggleCollapse}
                    className="w-full flex items-center justify-center text-xl p-3 bg-gray-800 hover:bg-gray-700 rounded-lg mt-4"
                >
                    <FaBars />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;