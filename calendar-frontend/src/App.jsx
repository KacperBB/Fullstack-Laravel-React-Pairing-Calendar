import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PartnersPage from "./pages/PartnersPage";
import HomePage from "./pages/HomePage";
import "./App.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="app-nav">
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              🏠 Strona główna
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  📅 Kalendarz
                </Link>
                <Link
                  to="/partners"
                  className={`nav-link ${isActive('/partners') ? 'active' : ''}`}
                >
                  👥 Partnerzy
                </Link>
              </>
            )}
          </div>

          <div className="nav-user">
            {isAuthenticated ? (
              <>
                <span className="user-name">👤 {user?.name}</span>
                <button onClick={logout} className="btn-logout">
                  Wyloguj
                </button>
              </>
            ) : (
              <Link to="/auth" className="nav-link">
                Zaloguj się
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <ProtectedRoute>
                <PartnersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
