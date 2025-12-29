import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';

const AdminDashboard = () => {
  const {
    stats,
    trendData,
    dailyActivity,
    recentActivities,
    loading,
    error,
    fetchAnalytics
  } = useAdminAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">Error loading analytics: {error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-2 text-sm text-destructive hover:text-destructive/80 underline"
          >
            Try again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Title Card */}
        <div className="bg-card rounded-lg shadow-md p-3 sm:p-6">
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1">Manage your ReadAgain platform</p>
        </div>

        {/* Header */}
        <div className="bg-card rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-foreground">Analytics Overview</h2>
              <p className="text-xs sm:text-base text-muted-foreground mt-1">Real-time insights and performance metrics</p>
            </div>
            <button
              onClick={() => fetchAnalytics()}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
            >
              <i className="ri-refresh-line mr-2"></i>
              <span className="hidden sm:inline">Refresh Data</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg shadow-md p-3 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform transition-transform duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`${stat.icon} text-white text-lg sm:text-xl`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 truncate">{stat.change} from last month</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
          {/* Growth Trends */}
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Growth Trends</h3>
            <div className="h-48 sm:h-64 -mx-3 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -20, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'sales' ? `₦${value.toLocaleString()}` : value.toLocaleString(),
                      name === 'sales' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} name="sales" />
                  <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Daily Activity</h3>
            <div className="h-48 sm:h-64 -mx-3 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyActivity} margin={{ left: -20, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      value.toLocaleString(),
                      name === 'active' ? 'Active Users' : 'Orders'
                    ]}
                  />
                  <Bar dataKey="active" fill="#3B82F6" name="active" />
                  <Bar dataKey="orders" fill="#10B981" name="orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow-md p-3 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Activities</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">Last 7 days</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200">
                  <div className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'book' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    activity.type === 'order' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <i className={`${
                      activity.type === 'user' ? 'ri-user-add-line' :
                      activity.type === 'book' ? 'ri-book-line' :
                      activity.type === 'order' ? 'ri-shopping-cart-line' :
                      'ri-settings-line'
                    } text-xs sm:text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <i className="ri-history-line text-3xl sm:text-4xl text-muted-foreground mb-2"></i>
                <p className="text-sm sm:text-base text-muted-foreground">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
