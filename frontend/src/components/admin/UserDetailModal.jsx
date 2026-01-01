import { motion } from 'framer-motion';

const UserDetailModal = ({ isOpen, onClose, user, onEdit }) => {
  if (!isOpen || !user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'super_admin': return 'bg-red-50 dark:bg-red-900/200';
      case 'user': return 'bg-primary/100';
      default: return 'bg-muted0';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">User Details</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* User Header */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground">{user.first_name} {user.last_name}</h4>
            <p className="text-muted-foreground">@{user.username}</p>
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white mt-2 ${getRoleColor(user.role?.name)}`}>
              {user.role?.display_name || 'No Role'}
            </span>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-3">Contact Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Username</p>
                <p className="font-medium text-foreground">{user.username}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                <p className="font-medium text-foreground">{user.phone_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-3">Account Status</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {user.status || 'Active'}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Email Verified</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  user.email_verified ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {user.email_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-3">Activity</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Joined</p>
                <p className="font-medium text-foreground">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Last Login</p>
                <p className="font-medium text-foreground">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-3">Statistics</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <i className="ri-book-line text-3xl text-primary mb-2"></i>
                <p className="text-2xl font-bold text-foreground">{user.books_count || 0}</p>
                <p className="text-sm text-muted-foreground">Books</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <i className="ri-shopping-cart-line text-3xl text-green-600 dark:text-green-400 mb-2"></i>
                <p className="text-2xl font-bold text-foreground">{user.orders_count || 0}</p>
                <p className="text-sm text-muted-foreground">Orders</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <i className="ri-star-line text-3xl text-purple-600 dark:text-purple-400 mb-2"></i>
                <p className="text-2xl font-bold text-foreground">{user.reviews_count || 0}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <i className="ri-time-line text-3xl text-yellow-600 dark:text-yellow-400 mb-2"></i>
                <p className="text-2xl font-bold text-foreground">{user.reading_hours || 0}h</p>
                <p className="text-sm text-muted-foreground">Reading</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(user);
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 flex items-center gap-2"
          >
            <i className="ri-edit-line"></i>
            Edit User
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-primary to-primary text-white rounded-lg font-semibold hover:from-primary/90 hover:to-primary/90"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailModal;
