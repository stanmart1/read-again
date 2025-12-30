import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorDashboard } from '../../hooks/useAuthorDashboard';

export default function AuthorDashboard() {
  const { dashboard, isLoading, error } = useAuthorDashboard();

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="ri-book-line"
            label="Total Books"
            value={dashboard?.total_books || 0}
            color="blue"
          />
          <StatCard
            icon="ri-shopping-cart-line"
            label="Total Sales"
            value={dashboard?.total_sales || 0}
            color="green"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="Total Earnings"
            value={`₦${(dashboard?.total_earnings || 0).toLocaleString()}`}
            color="purple"
          />
          <StatCard
            icon="ri-wallet-line"
            label="Available Balance"
            value={`₦${(dashboard?.available_balance || 0).toLocaleString()}`}
            color="orange"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Revenue</span>
                <span className="text-xl font-bold text-foreground">
                  ₦{(dashboard?.this_month_revenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Published Books</span>
                <span className="text-xl font-bold text-foreground">
                  {dashboard?.published_books || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pending</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Balance</span>
                <span className="text-xl font-bold text-foreground">
                  ₦{(dashboard?.pending_balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorLayout>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <i className={`${icon} text-2xl`}></i>
        </div>
      </div>
    </div>
  );
}
