import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Analytics</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <i className="ri-line-chart-line text-6xl text-muted-foreground mb-4"></i>
          <p className="text-muted-foreground text-lg">Analytics dashboard coming soon...</p>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
