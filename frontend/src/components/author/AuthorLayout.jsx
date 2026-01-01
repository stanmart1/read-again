import { Link, useLocation } from 'react-router-dom';
import Header from '../Header';

export default function AuthorLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/author/dashboard', icon: 'ri-dashboard-line' },
    { name: 'My Books', path: '/author/books', icon: 'ri-book-line' },
    { name: 'Analytics', path: '/author/analytics', icon: 'ri-line-chart-line' },
    { name: 'Earnings', path: '/author/earnings', icon: 'ri-money-dollar-circle-line' },
    { name: 'Orders', path: '/author/orders', icon: 'ri-shopping-cart-line' },
    { name: 'Reviews', path: '/author/reviews', icon: 'ri-star-line' },
    { name: 'Profile', path: '/author/profile', icon: 'ri-user-settings-line' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 h-screen sticky top-0 bg-card border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-2 mt-20">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <i className={`${item.icon} text-xl mb-1`}></i>
                <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
