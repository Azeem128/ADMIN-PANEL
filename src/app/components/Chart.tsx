
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import { useReadAllOrdersRange } from '../api/OrderRelatedApi/orders';

export default function OrderChart() {
  // State for date range and granularity
  const [startDate, setStartDate] = useState<Date | null>(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2024-12-31'));
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [filterDates, setFilterDates] = useState<{ start: string | undefined; end: string | undefined }>({
    start: '2024-01-01',
    end: '2024-12-31',
  });

  // Fetch data with the selected date range and granularity
  const { data, isLoading, error } = useReadAllOrdersRange(filterDates.start, filterDates.end, granularity);

  // Handle filter button click
  const handleFilter = () => {
    const formattedStart = startDate ? startDate.toISOString().split('T')[0] : undefined;
    const formattedEnd = endDate ? endDate.toISOString().split('T')[0] : undefined;
    setFilterDates({ start: formattedStart, end: formattedEnd });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">📈 Orders Over Time</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        {/* Date Range */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate || new Date()}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select start date"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select end date"
          />
        </div>

        {/* Granularity Selection */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Granularity</label>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="border border-gray-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="mt-6 sm:mt-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Filter
        </button>
      </div>

      {/* Total Orders */}
      {data?.totalOrders !== undefined && (
        <div className="mb-4 text-lg font-semibold">
          Total Orders: {data.totalOrders}
        </div>
      )}

      {/* Loading and Error States */}
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error loading data</div>}

      {/* Chart */}
      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.chartData || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orderCount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );



