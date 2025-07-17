import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { DatePickerInput } from "@mantine/dates";
import { Button, Loader, Text, Group, Box, Card } from "@mantine/core";
import { useReadAllOrdersRange } from "../api/OrderRelatedApi/orders";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export default function OrderChart() {
  const [startDate, setStartDate] = useState<Date | null>(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-12-31"));
  const [granularity, setGranularity] = useState<"daily" | "weekly" | "monthly">("daily");
  const [filterDates, setFilterDates] = useState<{ start: string | undefined; end: string | undefined }>({
    start: "2024-01-01",
    end: "2024-12-31",
  });

  const { data, isLoading, error } = useReadAllOrdersRange(filterDates.start, filterDates.end, granularity);

  const handleFilter = () => {
    console.log("handleFilter called with:", { startDate, endDate }); // Debug log
    if (!startDate && !endDate) return;

    let formattedStart: string | undefined;
    let formattedEnd: string | undefined;

    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      formattedStart = startDate.toISOString().split("T")[0];
    } else {
      console.warn("Invalid startDate:", startDate); // Debug invalid date
    }

    if (endDate instanceof Date && !isNaN(endDate.getTime())) {
      formattedEnd = endDate.toISOString().split("T")[0];
    } else {
      console.warn("Invalid endDate:", endDate); // Debug invalid date
    }

    if (!formattedStart && !formattedEnd) return;
    setFilterDates({ start: formattedStart, end: formattedEnd });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box p="xs" bg="white" radius="md" sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <Text fw={600}>{`Date: ${label}`}</Text>
          <Text>{`Orders: ${payload[0].value}`}</Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card p="lg" radius="md" withBorder>
      <Text size="xl" fw={700} mb="md" c="blue.8">
        📊 Order Analytics
      </Text>
      <Box mb="lg">
        <Group gap="md" align="center">
          <DatePickerInput
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={endDate || new Date()}
            clearable
            placeholder="Pick start date"
            style={{ width: "220px" }}
            styles={{
              input: {
                borderColor: "#e0e7ff",
                transition: "all 0.2s",
                padding: "8px 12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
          <DatePickerInput
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate}
            maxDate={new Date()}
            clearable
            placeholder="Pick end date"
            style={{ width: "220px" }}
            styles={{
              input: {
                borderColor: "#e0e7ff",
                transition: "all 0.2s",
                padding: "8px 12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as "daily" | "weekly" | "monthly")}
            className="border border-gray-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Button
            variant="filled"
            color="blue"
            onClick={handleFilter}
            leftSection={isLoading && <Loader size="xs" />}
            disabled={isLoading}
          >
            Apply Filters
          </Button>
        </Group>
      </Box>

      {data?.totalOrders !== undefined && (
        <Text mb="md" c="gray.7" fw={500}>
          Total Orders: {data.totalOrders.toLocaleString()}
        </Text>
      )}

      {isLoading && (
        <Box style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Loader size="lg" />
        </Box>
      )}
      {error && <Text c="red.6" mb="md">Error: {error.message}</Text>}

      {!isLoading && !error && data?.chartData && data.chartData.length > 0 && (
        <Box style={{ maxHeight: "400px", overflow: "auto" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.chartData} margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" hide={true} /> {/* Hide X-axis labels */}
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <ReferenceLine y={0} stroke="#ccc" />
              <Line
                type="monotone"
                dataKey="orderCount"
                stroke="#4CAF50"
                strokeWidth={3}
                activeDot={{ r: 6, fill: "#4CAF50", stroke: "none" }}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
      {!isLoading && !error && (!data?.chartData || data.chartData.length === 0) && (
        <Text c="gray.6" ta="center">
          No data available for the selected range.
        </Text>
      )}
    </Card>
  );
}