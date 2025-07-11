interface DashboardData {
  status: string;
  count: number;
  amount: number;
}

export default function DashboardCards({ data }: { data: DashboardData[] }) {
  const totalOrders = data.reduce((acc: number, curr: DashboardData) => acc + curr.count, 0);
  let totalRevenue = data.reduce((acc: number, curr: DashboardData) => acc + curr.amount, 0);
  totalRevenue = totalRevenue - data.filter((item: DashboardData) => item.status === "Canceled").reduce((acc: number, curr: DashboardData) => acc + curr.amount, 0);
  const cardStyles = [
    "bg-gradient-to-br from-blue-500 to-blue-600", // Total Revenue
    "bg-gradient-to-br from-green-500 to-green-600", // Total Orders
    "bg-gradient-to-br from-purple-500 to-purple-600", // Status cards
    "bg-gradient-to-br from-amber-500 to-amber-600",
    "bg-gradient-to-br from-rose-500 to-rose-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue Card */}
      <div className={`${cardStyles[0]} p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Total Revenue</p>
            <h2 className="text-3xl font-bold mt-1">${parseInt(totalRevenue.toString()).toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
          <span>All time revenue</span>
        </div>
      </div>

      {/* Total Orders Card */}
      <div className={`${cardStyles[1]} p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Total Orders</p>
            <h2 className="text-3xl font-bold mt-1">{totalOrders.toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
          <span>All time orders</span>
        </div>
      </div>

      {/* Status Cards */}
      {data.map((stat: DashboardData, index: number) => (
        <div key={stat.status} className={`${cardStyles[2 + (index % 4)]} p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{stat.status}</p>
              <h2 className="text-3xl font-bold mt-1">{stat.count.toLocaleString()}</h2>
            </div>
            <div className="bg jurado-white/20 p-3 rounded-full">
              {stat.status === "Completed" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {stat.status === "Pending" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {stat.status === "Processing" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {stat.status === "Canceled" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-white/80 mr-1"></span>
            <span>{Math.round((stat.count / totalOrders) * 100)}% of total</span>
          </div>
        </div>
      ))}
    </div>
  );
}



