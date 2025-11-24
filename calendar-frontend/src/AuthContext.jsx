import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  fetchMe,
  logout as apiLogout,
  setAuthToken,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // sprawdzamy na starcie czy user jest zalogowany

  // 1) Przy starcie aplikacji – sprawdzamy /me
  useEffect(() => {
    async function init() {
      try {
        const me = await fetchMe(); // <<< TUTAJ UŻYWASZ fetchMe
        console.log("ME z /api/me:", me); // tu zobaczysz is_paired w konsoli
        setUser(me); // zapisujemy usera razem z is_paired
      } catch (e) {
        console.log("Brak zalogowanego usera / błąd /api/me");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // 2) Logowanie
  async function login(credentials) {
    const { user: loggedUser, token } = await apiLogin(credentials);
    setAuthToken(token);

    // po zalogowaniu dla pewności zaciągnij aktualne /me,
    // żeby mieć partner_id i is_paired na pewno w tym samym formacie
    const me = await fetchMe();
    console.log("ME po login:", me);
    setUser(me);
  }

  // 3) Rejestracja
  async function register(data) {
    const { user: registeredUser, token } = await apiRegister(data);
    setAuthToken(token);

    const me = await fetchMe();
    console.log("ME po register:", me);
    setUser(me);
  }

  // 4) Wylogowanie
  async function logout() {
    try {
      await apiLogout();
    } catch (e) {
      console.error(e);
    }
    setAuthToken(null);
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
