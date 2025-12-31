import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getImageUrl } from '../../lib/fileService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuthorAnalytics } from '../../hooks/useAuthorAnalytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BookAnalyticsModal({ book, isOpen, onClose }) {
  const { fetchSalesData } = useAuthorAnalytics();
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    if (isOpen && book) {
      loadSalesData();
    }
  }, [isOpen, book, dateRange]);

  const loadSalesData = async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    try {
      const data = await fetchSalesData(startDate, endDate);
      setSalesData(data);
    } catch (err) {
      console.error('Failed to load sales data:', err);
    }
  };

  if (!isOpen || !book) return null;

  const chartData = {
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'var(--foreground)' },
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Book Analytics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Book Info */}
          <div className="flex gap-6">
            <img
              src={getImageUrl(book.cover_image)}
              alt={book.title}
              className="w-32 h-44 object-cover rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{book.description}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">₦{book.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    book.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{book.sales || 0}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₦{(book.revenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{book.sales || 0}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{book.average_rating?.toFixed(1) || 'N/A'}</p>
            </div>
          </div>

          {/* Sales Chart */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {book.isbn && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ISBN</p>
                <p className="text-gray-900 dark:text-white">{book.isbn}</p>
              </div>
            )}
            {book.publisher && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Publisher</p>
                <p className="text-gray-900 dark:text-white">{book.publisher}</p>
              </div>
            )}
            {book.publication_date && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
                <p className="text-gray-900 dark:text-white">{new Date(book.publication_date).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-gray-900 dark:text-white">{new Date(book.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
