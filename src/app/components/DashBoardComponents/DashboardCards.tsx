
interface DashboardData {
  status: string;
  total: number; // Changed from count to match backend data
  revenue: number; // Changed from amount to match backend data
}

export default function DashboardCards({ data }: { data: DashboardData[] }) {
  // Calculate total orders (sum of all totals)
  const totalOrders = data.reduce((acc: number, curr: DashboardData) => acc + curr.total, 0);

  // Calculate total revenue (only include non-zero revenue and exclude Cancelled statuses)
  const totalRevenue = data
    .filter((item: DashboardData) => item.revenue > 0 && !item.status.includes("Cancelled"))
    .reduce((acc: number, curr: DashboardData) => acc + curr.revenue, 0);

  // Define vibrant, modern gradient styles
  const cardStyles = [
    "bg-gradient-to-br from-teal-400 to-teal-600", // Total Revenue
    "bg-gradient-to-br from-emerald-400 to-emerald-600", // Total Orders
    "bg-gradient-to-br from-indigo-400 to-indigo-600", // Status cards
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue Card */}
      <div
        className={`${cardStyles[0]} p-5 rounded-xl shadow-md transform hover:scale-[1.03] transition-all duration-300 text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-90">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-1">${Number(totalRevenue || 0).toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
          <span>All time revenue</span>
        </div>
      </div>

      {/* Total Orders Card */}
      <div
        className={`${cardStyles[1]} p-5 rounded-xl shadow-md transform hover:scale-[1.03] transition-all duration-300 text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-90">Total Orders</p>
            <h2 className="text-2xl font-bold mt-1">{totalOrders.toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
          <span>All time orders</span>
        </div>
      </div>

      {/* Status Cards */}
      {data.map((stat: DashboardData, index: number) => (
        <div
          key={stat.status}
          className={`${cardStyles[2 + (index % 4)]} p-5 rounded-xl shadow-md transform hover:scale-[1.03] transition-all duration-300 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold opacity-90">{stat.status}</p>
              <h2 className="text-2xl font-bold mt-1">{Number(stat.total || 0).toLocaleString()}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              {stat.status === "Completed" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {stat.status === "Pending" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {stat.status === "On Process" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              {(stat.status === "Cancelled By Owner" || stat.status === "Cancelled by Rider") && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {stat.status === "Delivered" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
              {stat.status === "Ready for Delivery" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              )}
              {stat.status === "Picked Up" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              )}
              {(stat.status === "Accepted by Owner" || stat.status === "Accepted by Rider") && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
            <span>{totalOrders > 0 ? Math.round((stat.total / totalOrders) * 100) : 0}% of total</span>
          </div>
        </div>
      ))}
    </div>
  );
}