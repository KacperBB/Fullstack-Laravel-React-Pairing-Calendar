import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PartnersPage from "./pages/PartnersPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Ładowanie...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <header style={{ padding: "10px", borderBottom: "1px solid #ddd", marginBottom: "10px" }}>
        <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/">Strona główna</Link>
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          {isAuthenticated && <Link to="/partners">Partnerzy</Link>}

          <div style={{ marginLeft: "auto" }}>
            {isAuthenticated ? (
              <>
                <span style={{ marginRight: "10px" }}>{user?.name}</span>
                <button onClick={logout}>Wyloguj</button>
              </>
            ) : (
              <Link to="/auth">Zaloguj</Link>
            )}
          </div>
        </nav>
      </header>

      <main style={{ padding: "10px" }}>
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
