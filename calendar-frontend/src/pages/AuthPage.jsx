import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

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
      setError(err.response?.data?.message || "Nie udało się zalogować/zarejestrować");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>
          {mode === "login" ? "Witaj ponownie" : "Utwórz konto"}
        </h1>
        <p className={styles.authSubtitle}>
          {mode === "login"
            ? "Zaloguj się do swojego kalendarza"
            : "Rozpocznij zarządzanie swoim czasem"}
        </p>

        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${mode === "login" ? styles.active : ""}`}
            onClick={() => setMode("login")}
          >
            Logowanie
          </button>
          <button
            className={`${styles.modeTab} ${mode === "register" ? styles.active : ""}`}
            onClick={() => setMode("register")}
          >
            Rejestracja
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {mode === "register" && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Imię</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={styles.formInput}
                placeholder="Jan Kowalski"
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="twoj@email.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Hasło</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Proszę czekać..." : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
