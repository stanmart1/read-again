import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function AuthorRoute({ children }) {
  const { isAuthenticated, getUser } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login?redirect=/author/dashboard" replace />;
  }

  // Check if user has author role
  const user = getUser();
  const roleName = user?.role?.name?.toLowerCase();
  
  if (roleName !== 'author') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center border border-border">
          <i className="ri-error-warning-line text-6xl text-yellow-600 dark:text-yellow-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-foreground mb-2">Author Access Required</h2>
          <p className="text-muted-foreground mb-6">
            You need an author profile to access this area. Please contact support to become an author.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
