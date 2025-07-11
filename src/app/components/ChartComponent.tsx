const ChartComponent = ({ data, options }) => {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!chartRef.current) return;
    // Assuming Chart.js is installed (npm install chart.js)
    const Chart = require('chart.js/auto').default;
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });

    return () => {
      if (chartRef.current) chartRef.current.getContext('2d')?.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    };
  }, [data, options]);

  return <canvas ref={chartRef} className="w-full h-[300px]" />;
};