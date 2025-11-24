import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch (err) {
      console.error(err);
      setError("Nie udało się zalogować/zarejestrować");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>{mode === "login" ? "Logowanie" : "Rejestracja"}</h2>
      <div style={{ marginBottom: "10px" }}>
        <button disabled={mode === "login"} onClick={() => setMode("login")}>
          Mam konto
        </button>
        <button disabled={mode === "register"} onClick={() => setMode("register")} style={{ marginLeft: "8px" }}>
          Nowe konto
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div>
            <label>Imię</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Hasło</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "..." : mode === "login" ? "Zaloguj" : "Zarejestruj"}
        </button>
      </form>
    </div>
  );
}
