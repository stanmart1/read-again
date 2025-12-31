import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorAnalytics } from '../../hooks/useAuthorAnalytics';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { overview, isLoading, error, fetchSalesData, fetchRevenueData, fetchTopBooks } = useAuthorAnalytics();
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const [sales, revenue, books] = await Promise.all([
        fetchSalesData(startDate, endDate),
        fetchRevenueData(startDate, endDate),
        fetchTopBooks(5)
      ]);
      setSalesData(sales);
      setRevenueData(revenue);
      setTopBooks(books);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const salesChartData = {
    labels: salesData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(d => d.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const revenueChartData = {
    labels: revenueData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue (₦)',
        data: revenueData.map(d => d.revenue),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--foreground)',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--muted-foreground)' },
        grid: { color: 'var(--border)' },
      },
      y: {
        ticks: { color: 'var(--muted-foreground)' },
        grid: { color: 'var(--border)' },
      },
    },
  };

  if (isLoading) {
    return (
      <AuthorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AuthorLayout>
    );
  }

  if (error) {
    return (
      <AuthorLayout>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Sales Analytics</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">₦{overview.total_earnings?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold text-foreground">₦{overview.monthly_revenue?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-foreground">{overview.total_sales?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-foreground">{overview.average_rating?.toFixed(1)}</p>
            </motion.div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-lg border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Sales Trend</h2>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card p-6 rounded-lg border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Revenue</h2>
            <div className="h-64">
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Top Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card p-6 rounded-lg border border-border"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Performing Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Sales</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((book, index) => (
                  <tr key={book.book_id} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">{book.title}</td>
                    <td className="py-3 px-4 text-right text-foreground">{book.sales}</td>
                    <td className="py-3 px-4 text-right text-foreground">₦{book.revenue?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-foreground">{book.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AuthorLayout>
  );
}
