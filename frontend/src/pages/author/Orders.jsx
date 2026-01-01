import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorOrders } from '../../hooks/useAuthorOrders';
import OrderDetailsModal from '../../components/author/OrderDetailsModal';

export default function Orders() {
  const { fetchOrderStats, fetchOrders } = useAuthorOrders();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        fetchOrderStats(),
        fetchOrders(page, 20, statusFilter, searchTerm)
      ]);
      setStats(statsData);
      setOrders(ordersData.orders || []);
      setTotal(ordersData.total || 0);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  if (isLoading && !stats) {
    return (
      <AuthorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total_orders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground break-words">₦{stats.total_revenue?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_orders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Completed Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed_orders}</p>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search by order number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Search
              </button>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order #</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground font-mono">#{order.id}</td>
                    <td className="py-3 px-4 text-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-foreground">{order.user?.full_name || order.user?.email}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">₦{order.total_amount?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsModal(true);
                        }}
                        className="px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No orders found</p>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="px-3 py-1 border border-border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
      />
    </AuthorLayout>
  );
}
