import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';

const UserAnalyticsModal = ({ isOpen, onClose, userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchAnalytics();
    }
  }, [isOpen, userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}/analytics`);
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Reading Analytics</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Books Read</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.booksRead || 0}</p>
                  </div>
                  <i className="ri-book-line text-3xl text-primary"></i>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reading Hours</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.readingHours || 0}</p>
                  </div>
                  <i className="ri-time-line text-3xl text-green-600"></i>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.streak || 0} days</p>
                  </div>
                  <i className="ri-fire-line text-3xl text-purple-600"></i>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Rating</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.avgRating || 0}</p>
                  </div>
                  <i className="ri-star-line text-3xl text-yellow-600"></i>
                </div>
              </div>
            </div>

            {/* Reading Progress Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Reading Progress</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.progressData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pages" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Books */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Recent Books</h4>
              <div className="space-y-3">
                {analytics.recentBooks && analytics.recentBooks.length > 0 ? (
                  analytics.recentBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{book.progress}%</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-book-open-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-muted-foreground text-lg font-medium">No books yet</p>
                    <p className="text-muted-foreground text-sm mt-1">User hasn't started reading any books</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-bar-chart-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserAnalyticsModal;
