import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute
 * - Renders children only when the user is authenticated.
 * - Shows a subtle full-screen loader while auth state is being resolved.
 * - Preserves the attempted URL so Login can redirect back after success.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top right, #1a1738 0%, #0f0d20 40%, #0b0918 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '3px solid rgba(205,186,226,0.15)',
              borderTopColor: '#cdbae2',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: '#a39eb5', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
            Verifying access…
          </p>
        </div>

        {/* Inline keyframe because Tailwind's animate-spin needs the class on the element */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
