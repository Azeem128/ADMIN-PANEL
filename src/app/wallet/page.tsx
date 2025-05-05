// "use client";
// import { useState, useEffect } from "react";
// import { CreditCard, Plus, Minus, TrendingDown, Download } from "lucide-react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// // Register Chart.js components
// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// // Interfaces
// interface Transaction {
//   id: string;
//   name: string;
//   avatar: string;
//   type: 'deposit' | 'withdrawal' | 'order';
//   amount: number;
//   date: string;
//   method: string;
//   status: 'completed' | 'pending' | 'cancelled';
// }

// interface Invoice {
//   name: string;
//   avatar: string;
//   amount: number;
// }

// interface WalletData {
//   balance: number;
//   walletBalance: number;
//   pending: number;
// }

// const WalletPage: React.FC = () => {
//   // State
//   const [wallet, setWallet] = useState<WalletData>({ balance: 5675412.66, walletBalance: 824571.93, pending: 150.00 });
//   const [transactions, setTransactions] = useState<Transaction[]>([
//     { id: "#001253", name: "Peterdraw", avatar: "https://randomuser.me/api/portraits/men/1.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-23 08:22 AM", method: "MasterCard 404", status: 'pending' },
//     { id: "#001254", name: "Olivia Browniee", avatar: "https://randomuser.me/api/portraits/women/2.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-22 08:22 AM", method: "MasterCard 404", status: 'completed' },
//     { id: "#001255", name: "Angela Moss", avatar: "https://randomuser.me/api/portraits/women/3.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-21", method: "MasterCard 404", status: 'cancelled' },
//     { id: "#001256", name: "XYZ Online Shop", avatar: "https://randomuser.me/api/portraits/men/4.jpg", type: 'deposit', amount: 65.53, date: "2025-04-20 08:22 AM", method: "MasterCard 404", status: 'completed' },
//     { id: "#001257", name: "Peter Parkur", avatar: "https://randomuser.me/api/portraits/men/5.jpg", type: 'deposit', amount: 65.53, date: "2025-04-19 08:22 AM", method: "MasterCard 404", status: 'completed' },
//   ]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
//   // const [invoices, setInvoices] = useState<Invoice[]>([
//   //   { name: "Steven Stone", avatar: "https://randomuser.me/api/portraits/men/6.jpg", amount: 852 },
//   //   { name: "David Ignis", avatar: "https://randomuser.me/api/portraits/men/7.jpg", amount: 872 },
//   //   { name: "Olivia Johnson", avatar: "https://randomuser.me/api/portraits/women/8.jpg", amount: 769 },
//   //   { name: "Melanie Wong", avatar: "https://randomuser.me/api/portraits/women/9.jpg", amount: 445 },
//   //   { name: "Roberto", avatar: "https://randomuser.me/api/portraits/men/10.jpg", amount: 876 },
//   // ]);
//   const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
//   const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
//   const [depositAmount, setDepositAmount] = useState<string>("");
//   const [withdrawAmount, setWithdrawAmount] = useState<string>("");
//   const [depositMethod, setDepositMethod] = useState<string>("");
//   const [withdrawMethod, setWithdrawMethod] = useState<string>("");
//   const [confirmationMessage, setConfirmationMessage] = useState<string>("");
//   const [dateFilter, setDateFilter] = useState<string>("monthly");
//   const [typeFilter, setTypeFilter] = useState<string>("all");
//   const [sortBy, setSortBy] = useState<string>("date-desc");

//   // Chart Data for Earning Trend
//   const chartData = {
//     labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//     datasets: [
//       {
//         label: "Income",
//         data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
//         borderColor: "#34d399",
//         backgroundColor: "#34d399",
//         tension: 0.4,
//       },
//       {
//         label: "Expense",
//         data: [1000, 1500, 2000, 3000, 2500, 2000, 3500],
//         borderColor: "#f87171",
//         backgroundColor: "#f87171",
//         tension: 0.4,
//       },
//     ],
//   };

//   // Chart Options
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { enabled: true },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: { grid: { borderDash: [5, 5] }, beginAtZero: true },
//     },
//   };

//   // Filter and Sort Transactions
//   useEffect(() => {
//     let filtered = [...transactions];
    
//     // Filter by type
//     if (typeFilter !== "all") {
//       filtered = filtered.filter(tx => tx.type === typeFilter);
//     }

//     // Filter by date range
//     const now = new Date();
//     if (dateFilter === "daily") {
//       filtered = filtered.filter(tx => new Date(tx.date).toDateString() === now.toDateString());
//     } else if (dateFilter === "weekly") {
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//       filtered = filtered.filter(tx => new Date(tx.date) >= oneWeekAgo);
//     } else if (dateFilter === "monthly") {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//       filtered = filtered.filter(tx => new Date(tx.date) >= oneMonthAgo);
//     }

//     // Sort
//     if (sortBy === "date-asc") {
//       filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     } else if (sortBy === "date-desc") {
//       filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     } else if (sortBy === "amount-asc") {
//       filtered.sort((a, b) => a.amount - b.amount);
//     } else if (sortBy === "amount-desc") {
//       filtered.sort((a, b) => b.amount - a.amount);
//     }

//     setFilteredTransactions(filtered);
//   }, [dateFilter, typeFilter, sortBy, transactions]);

//   // Handlers
//   const handleDeposit = () => {
//     if (!depositAmount || !depositMethod) {
//       setConfirmationMessage("Please enter an amount and select a method.");
//       return;
//     }
//     const amount = parseFloat(depositAmount);
//     if (isNaN(amount) || amount <= 0) {
//       setConfirmationMessage("Please enter a valid amount.");
//       return;
//     }
//     setWallet(prev => ({ ...prev, balance: prev.balance + amount }));
//     setTransactions(prev => [
//       {
//         id: `#${(parseInt(prev[0].id.slice(1)) + 1).toString().padStart(6, '0')}`,
//         name: "Admin Deposit",
//         avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//         type: 'deposit',
//         amount: amount,
//         date: new Date().toLocaleString(),
//         method: depositMethod,
//         status: 'completed',
//       },
//       ...prev,
//     ]);
//     setConfirmationMessage(`Successfully deposited $${amount} via ${depositMethod}.`);
//     setShowDepositModal(false);
//     setDepositAmount("");
//     setDepositMethod("");
//   };

//   const handleWithdraw = () => {
//     if (!withdrawAmount || !withdrawMethod) {
//       setConfirmationMessage("Please enter an amount and select a method.");
//       return;
//     }
//     const amount = parseFloat(withdrawAmount);
//     if (isNaN(amount) || amount <= 0) {
//       setConfirmationMessage("Please enter a valid amount.");
//       return;
//     }
//     if (amount > wallet.balance) {
//       setConfirmationMessage("Insufficient balance for withdrawal.");
//       return;
//     }
//     setWallet(prev => ({ ...prev, balance: prev.balance - amount, pending: prev.pending + amount }));
//     setTransactions(prev => [
//       {
//         id: `#${(parseInt(prev[0].id.slice(1)) + 1).toString().padStart(6, '0')}`,
//         name: "Admin Withdrawal",
//         avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//         type: 'withdrawal',
//         amount: -amount,
//         date: new Date().toLocaleString(),
//         method: withdrawMethod,
//         status: 'pending',
//       },
//       ...prev,
//     ]);
//     setConfirmationMessage(`Withdrawal of $${amount} via ${withdrawMethod} is pending.`);
//     setShowWithdrawModal(false);
//     setWithdrawAmount("");
//     setWithdrawMethod("");
//   };

//   const handleExport = () => {
//     const csvContent = [
//       "ID,Name,Type,Amount,Date,Method,Status",
//       ...filteredTransactions.map(tx =>
//         `${tx.id},${tx.name},${tx.type},${tx.amount},"${tx.date}",${tx.method},${tx.status}`
//       ),
//     ].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "transaction_history.csv";
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // Render status icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>;
//       case 'pending':
//         return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Pending</span>;
//       case 'cancelled':
//         return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Cancelled</span>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-2">
//           <CreditCard className="h-8 w-8 text-purple-600" /> Wallet Dashboard
//         </h1>
//       </div>

//       {/* Balance Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <p className="text-blue-100 text-sm">Main Balance</p>
//               <p className="text-4xl font-bold">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDepositModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
//               >
//                 <Plus className="h-4 w-4" /> Add Funds
//               </button>
//               <button
//                 onClick={() => setShowWithdrawModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
//               >
//                 <Minus className="h-4 w-4" /> Withdraw
//               </button>
//             </div>
//           </div>
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <p className="text-blue-100 text-sm">VALID THRU</p>
//               <p className="text-lg font-semibold">08/21</p>
//             </div>
//             <div className="flex-1">
//               <p className="text-blue-100 text-sm">CARD NUMBER</p>
//               <p className="text-lg font-semibold">**** **** **** 1234</p>
//             </div>
//             <div className="flex-1">
//               <p className="text-blue-100 text-sm">CARD HOLDER</p>
//               <p className="text-lg font-semibold">Samantha Anderson</p>
//             </div>
//             <div className="flex-1">
//               <CreditCard className="h-6 w-6 text-blue-200" />
//             </div>
//           </div>
//           <div className="mt-4">
//             <p className="text-blue-100 text-sm">Pending Transactions</p>
//             <p className="text-xl font-semibold text-yellow-300">${wallet.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
//           <p className="text-purple-100 text-sm mb-2">Wallet Balance</p>
//           <p className="text-3xl font-bold mb-2">${wallet.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
//           <p className="text-sm text-red-300 flex items-center gap-2">
//             <TrendingDown className="h-4 w-4" /> -0.6% than last week
//           </p>
//           <div className="mt-4 flex gap-3">
//             <button className="p-2 bg-purple-500 rounded-full hover:bg-purple-400">
//               <Plus className="h-4 w-4" />
//             </button>
//             <button className="p-2 bg-purple-500 rounded-full hover:bg-purple-400">
//               <Minus className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Earning Category and Graph */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
//           <h2 className="text-lg font-semibold mb-4 text-green-800">Earning Category</h2>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <svg className="w-24 h-24">
//                 <circle cx="50%" cy="50%" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
//                 <circle cx="50%" cy="50%" r="40" stroke="#34d399" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="0" />
//                 <circle cx="50%" cy="50%" r="40" stroke="#f87171" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="125.6" />
//                 <circle cx="50%" cy="50%" r="40" stroke="#60a5fa" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="188.4" />
//               </svg>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <p className="text-sm font-semibold text-green-800">60%</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Income: 30%</p>
//               <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Expense: 40%</p>
//               <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Others: 10%</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
//           <h2 className="text-lg font-semibold mb-4 text-blue-800">Earning Trend</h2>
//           <div className="h-40">
//             <Line data={chartData} options={chartOptions} />
//           </div>
//           <div className="flex justify-around text-sm text-blue-600">
//             <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
//           </div>
//         </div>
//       </div>

//       {/* Payment History and Invoices Sent */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-purple-800">Payment History</h2>
//             <div className="flex gap-3">
//               <select
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="all">All Time</option>
//               </select>
//               <select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
//               >
//                 <option value="all">All Types</option>
//                 <option value="deposit">Deposits</option>
//                 <option value="withdrawal">Withdrawals</option>
//                 <option value="order">Orders</option>
//               </select>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
//               >
//                 <option value="date-desc">Date (Newest)</option>
//                 <option value="date-asc">Date (Oldest)</option>
//                 <option value="amount-desc">Amount (High to Low)</option>
//                 <option value="amount-asc">Amount (Low to High)</option>
//               </select>
//               <button
//                 onClick={handleExport}
//                 className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
//               >
//                 <Download className="h-4 w-4" /> Export
//               </button>
//             </div>
//           </div>
//           <div className="max-h-60 overflow-y-auto">
//             {filteredTransactions.length > 0 ? (
//               filteredTransactions.map((tx) => (
//                 <div key={tx.id} className="flex items-center justify-between p-3 bg-purple-200 rounded-lg mb-3 hover:bg-purple-300 transition-colors">
//                   <div className="flex items-center gap-3">
//                     <img src={tx.avatar} alt={tx.name} className="h-10 w-10 rounded-full" />
//                     <div>
//                       <p className="font-medium text-purple-800">{tx.name}</p>
//                       <p className="text-sm text-purple-600">{tx.date}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`font-semibold ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
//                       {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
//                     </p>
//                     <p className="text-sm text-purple-600">{tx.method}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {getStatusIcon(tx.status)}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-purple-600">No transactions found.</p>
//             )}
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
//           <h2 className="text-lg font-semibold mb-4 text-red-800">Invoices Sent</h2>
//           {invoices.map((invoice, index) => (
//             <div key={index} className="flex items-center justify-between mb-3 hover:bg-red-200 rounded-lg p-2 transition-colors">
//               <div className="flex items-center gap-3">
//                 <img src={invoice.avatar} alt={invoice.name} className="h-8 w-8 rounded-full" />
//                 <p className="font-medium text-red-800">{invoice.name}</p>
//               </div>
//               <p className="font-semibold text-red-800">${invoice.amount}</p>
//             </div>
//           ))}
//           <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md">
//             View More
//           </button>
//         </div>
//       </div>

//       {/* Deposit Modal */}
//       {showDepositModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-purple-800">Add Funds</h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1 text-purple-700">Amount</label>
//               <input
//                 type="number"
//                 value={depositAmount}
//                 onChange={(e) => setDepositAmount(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter amount"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1 text-purple-700">Payment Method</label>
//               <select
//                 value={depositMethod}
//                 onChange={(e) => setDepositMethod(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               >
//                 <option value="">Select Method</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Digital Wallet">Digital Wallet</option>
//               </select>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDeposit}
//                 className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
//               >
//                 Deposit
//               </button>
//               <button
//                 onClick={() => setShowDepositModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 shadow-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Withdraw Modal */}
//       {showWithdrawModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-purple-800">Withdraw Funds</h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1 text-purple-700">Amount</label>
//               <input
//                 type="number"
//                 value={withdrawAmount}
//                 onChange={(e) => setWithdrawAmount(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter amount"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1 text-purple-700">Withdrawal Method</label>
//               <select
//                 value={withdrawMethod}
//                 onChange={(e) => setWithdrawMethod(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               >
//                 <option value="">Select Method</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="Digital Wallet">Digital Wallet</option>
//               </select>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleWithdraw}
//                 className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
//               >
//                 Withdraw
//               </button>
//               <button
//                 onClick={() => setShowWithdrawModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 shadow-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Message */}
//       {confirmationMessage && (
//         <div className="fixed bottom-4 right-4 bg-purple-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-2">
//           {confirmationMessage}
//           <button onClick={() => setConfirmationMessage("")} className="text-white">
//             <XCircle className="h-4 w-4" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WalletPage;




"use client";
import { useState, useEffect } from "react";
import { CreditCard, Plus, Minus, TrendingDown, Download, XCircle } from "lucide-react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

// Interfaces
interface Transaction {
  id: string;
  name: string;
  avatar: string;
  type: 'deposit' | 'withdrawal' | 'order';
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Invoice {
  name: string;
  avatar: string;
  amount: number;
}

interface WalletData {
  balance: number;
  walletBalance: number;
  pending: number;
}

const WalletPage: React.FC = () => {
  // State
  const [wallet, setWallet] = useState<WalletData>({ balance: 5675412.66, walletBalance: 824571.93, pending: 150.00 });
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "#001253", name: "Peterdraw", avatar: "https://randomuser.me/api/portraits/men/1.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-23 08:22 AM", method: "MasterCard 404", status: 'pending' },
    { id: "#001254", name: "Olivia Browniee", avatar: "https://randomuser.me/api/portraits/women/2.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-22 08:22 AM", method: "MasterCard 404", status: 'completed' },
    { id: "#001255", name: "Angela Moss", avatar: "https://randomuser.me/api/portraits/women/3.jpg", type: 'withdrawal', amount: -55.53, date: "2025-04-21", method: "MasterCard 404", status: 'cancelled' },
    { id: "#001256", name: "XYZ Online Shop", avatar: "https://randomuser.me/api/portraits/men/4.jpg", type: 'deposit', amount: 65.53, date: "2025-04-20 08:22 AM", method: "MasterCard 404", status: 'completed' },
    { id: "#001257", name: "Peter Parkur", avatar: "https://randomuser.me/api/portraits/men/5.jpg", type: 'deposit', amount: 65.53, date: "2025-04-19 08:22 AM", method: "MasterCard 404", status: 'completed' },
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [invoices] = useState<Invoice[]>([
    { name: "Steven Stone", avatar: "https://randomuser.me/api/portraits/men/6.jpg", amount: 852 },
    { name: "David Ignis", avatar: "https://randomuser.me/api/portraits/men/7.jpg", amount: 872 },
    { name: "Olivia Johnson", avatar: "https://randomuser.me/api/portraits/women/8.jpg", amount: 769 },
    { name: "Melanie Wong", avatar: "https://randomuser.me/api/portraits/women/9.jpg", amount: 445 },
    { name: "Roberto", avatar: "https://randomuser.me/api/portraits/men/10.jpg", amount: 876 },
  ]);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [depositMethod, setDepositMethod] = useState<string>("");
  const [withdrawMethod, setWithdrawMethod] = useState<string>("");
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("monthly");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  // Chart Data for Earning Trend
  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Income",
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        borderColor: "#34d399",
        backgroundColor: "#34d399",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: [1000, 1500, 2000, 3000, 2500, 2000, 3500],
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        tension: 0.4,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [5, 5] }, beginAtZero: true },
    },
  };

  // Filter and Sort Transactions
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Filter by date range
    const now = new Date();
    if (dateFilter === "daily") {
      filtered = filtered.filter(tx => new Date(tx.date).toDateString() === now.toDateString());
    } else if (dateFilter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(tx => new Date(tx.date) >= oneWeekAgo);
    } else if (dateFilter === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(tx => new Date(tx.date) >= oneMonthAgo);
    }

    // Sort
    if (sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "date-desc") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "amount-asc") {
      filtered.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "amount-desc") {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    setFilteredTransactions(filtered);
  }, [dateFilter, typeFilter, sortBy, transactions]);

  // Handlers
  const handleDeposit = () => {
    if (!depositAmount || !depositMethod) {
      setConfirmationMessage("Please enter an amount and select a method.");
      return;
    }
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setConfirmationMessage("Please enter a valid amount.");
      return;
    }
    setWallet(prev => ({ ...prev, balance: prev.balance + amount }));
    setTransactions(prev => [
      {
        id: `#${(parseInt(prev[0].id.slice(1)) + 1).toString().padStart(6, '0')}`,
        name: "Admin Deposit",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        type: 'deposit',
        amount: amount,
        date: new Date().toLocaleString(),
        method: depositMethod,
        status: 'completed',
      },
      ...prev,
    ]);
    setConfirmationMessage(`Successfully deposited $${amount} via ${depositMethod}.`);
    setShowDepositModal(false);
    setDepositAmount("");
    setDepositMethod("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawMethod) {
      setConfirmationMessage("Please enter an amount and select a method.");
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setConfirmationMessage("Please enter a valid amount.");
      return;
    }
    if (amount > wallet.balance) {
      setConfirmationMessage("Insufficient balance for withdrawal.");
      return;
    }
    setWallet(prev => ({ ...prev, balance: prev.balance - amount, pending: prev.pending + amount }));
    setTransactions(prev => [
      {
        id: `#${(parseInt(prev[0].id.slice(1)) + 1).toString().padStart(6, '0')}`,
        name: "Admin Withdrawal",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        type: 'withdrawal',
        amount: -amount,
        date: new Date().toLocaleString(),
        method: withdrawMethod,
        status: 'pending',
      },
      ...prev,
    ]);
    setConfirmationMessage(`Withdrawal of $${amount} via ${withdrawMethod} is pending.`);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setWithdrawMethod("");
  };

  const handleExport = () => {
    const csvContent = [
      "ID,Name,Type,Amount,Date,Method,Status",
      ...filteredTransactions.map(tx =>
        `${tx.id},${tx.name},${tx.type},${tx.amount},"${tx.date}",${tx.method},${tx.status}`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction_history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-purple-600" /> Wallet Dashboard
        </h1>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-blue-100 text-sm">Main Balance</p>
              <p className="text-4xl font-bold">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
              >
                <Plus className="h-4 w-4" /> Add Funds
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
              >
                <Minus className="h-4 w-4" /> Withdraw
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-blue-100 text-sm">VALID THRU</p>
              <p className="text-lg font-semibold">08/21</p>
            </div>
            <div className="flex-1">
              <p className="text-blue-100 text-sm">CARD NUMBER</p>
              <p className="text-lg font-semibold">**** **** **** 1234</p>
            </div>
            <div className="flex-1">
              <p className="text-blue-100 text-sm">CARD HOLDER</p>
              <p className="text-lg font-semibold">Samantha Anderson</p>
            </div>
            <div className="flex-1">
              <CreditCard className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-blue-100 text-sm">Pending Transactions</p>
            <p className="text-xl font-semibold text-yellow-300">${wallet.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <p className="text-purple-100 text-sm mb-2">Wallet Balance</p>
          <p className="text-3xl font-bold mb-2">${wallet.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-red-300 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" /> -0.6% than last week
          </p>
          <div className="mt-4 flex gap-3">
            <button className="p-2 bg-purple-500 rounded-full hover:bg-purple-400">
              <Plus className="h-4 w-4" />
            </button>
            <button className="p-2 bg-purple-500 rounded-full hover:bg-purple-400">
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Earning Category and Graph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold mb-4 text-green-800">Earning Category</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-24 h-24">
                <circle cx="50%" cy="50%" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                <circle cx="50%" cy="50%" r="40" stroke="#34d399" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="0" />
                <circle cx="50%" cy="50%" r="40" stroke="#f87171" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="125.6" />
                <circle cx="50%" cy="50%" r="40" stroke="#60a5fa" strokeWidth="10" fill="none" strokeDasharray="125.6" strokeDashoffset="188.4" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm font-semibold text-green-800">60%</p>
              </div>
            </div>
            <div>
              <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Income: 30%</p>
              <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Expense: 40%</p>
              <p className="text-sm flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Others: 10%</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Earning Trend</h2>
          <div className="h-40">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-around text-sm text-blue-600">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
        </div>
      </div>

      {/* Payment History and Invoices Sent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-lg col-span-2 transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-800">Payment History</h2>
            <div className="flex gap-3">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="all">All Time</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="order">Orders</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-purple-50 text-purple-700"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-purple-200 rounded-lg mb-3 hover:bg-purple-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <Image src={tx.avatar} alt={tx.name} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-medium text-purple-800">{tx.name}</p>
                      <p className="text-sm text-purple-600">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                    </p>
                    <p className="text-sm text-purple-600">{tx.method}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-purple-600">No transactions found.</p>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <h2 className="text-lg font-semibold mb-4 text-red-800">Invoices Sent</h2>
          {invoices.map((invoice, index) => (
            <div key={index} className="flex items-center justify-between mb-3 hover:bg-red-200 rounded-lg p-2 transition-colors">
              <div className="flex items-center gap-3">
                <Image src={invoice.avatar} alt={invoice.name} width={32} height={32} className="rounded-full" />
                <p className="font-medium text-red-800">{invoice.name}</p>
              </div>
              <p className="font-semibold text-red-800">${invoice.amount}</p>
            </div>
          ))}
          <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md">
            View More
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">Add Funds</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-purple-700">Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-purple-700">Payment Method</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeposit}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
              >
                Deposit
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">Withdraw Funds</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-purple-700">Amount</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-purple-700">Withdrawal Method</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
              >
                Withdraw
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {confirmationMessage && (
        <div className="fixed bottom-4 right-4 bg-purple-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-2">
          {confirmationMessage}
          <button onClick={() => setConfirmationMessage("")} className="text-white">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletPage;