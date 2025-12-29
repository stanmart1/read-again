import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useActivity } from '../../hooks';
import { ActivitySkeleton } from '../../components/SkeletonLoader';

export default function Activity() {
  const { activities, loading, hasMore, loadMore } = useActivity();

  const getIconBg = (color) => {
    const colors = {
      green: 'bg-green-100 dark:bg-green-900/30',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
      blue: 'bg-primary/20',
      purple: 'bg-purple-100',
      pink: 'bg-pink-100',
      orange: 'bg-orange-100'
    };
    return colors[color] || 'bg-muted';
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600 dark:text-green-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      blue: 'text-primary',
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      orange: 'text-orange-600'
    };
    return colors[color] || 'text-muted-foreground';
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Activity Feed</h1>
          <p className="text-muted-foreground">Your recent reading activities and achievements</p>
        </div>

        {/* Activity Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted"></div>

          {/* Activities */}
          <div className="space-y-6">
            {loading ? (
              [...Array(5)].map((_, i) => <ActivitySkeleton key={i} />)
            ) : activities.length > 0 ? (
              activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Icon */}
                <div className={`absolute left-0 w-12 h-12 ${getIconBg(activity.color)} rounded-full flex items-center justify-center`}>
                  <i className={`${activity.icon} text-xl ${getIconColor(activity.color)}`}></i>
                </div>

                {/* Content */}
                <div className="bg-card rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground">{activity.title}</h3>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-muted-foreground">{activity.description}</p>
                </div>
              </motion.div>
            ))
            ) : (
              <div className="text-center py-12">
                <i className="ri-time-line text-6xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">No activities yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMore}
              className="px-6 py-3 bg-card border-2 border-input rounded-lg font-semibold text-foreground hover:bg-muted"
            >
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
