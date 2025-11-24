import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    //Przekierowanie na dashboard, jeśli zalogowany
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div style = {{ maxWidth: "600ox", margin: "0 auto"}}>
            <h1>Kalendarz współdzielony</h1>
      <p>
        Ta aplikacja pozwala ci:
      </p>
      <ul>
        <li>planować swój dzień w kalendarzu,</li>
        <li>udostępniać plan innym użytkownikom przez parowanie,</li>
        <li>dodawać komentarze i notatki do wydarzeń.</li>
      </ul>

      <p>
        Żeby korzystać z kalendarza, musisz się zalogować lub założyć konto.
      </p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/auth">
          <button>Zaloguj / Zarejestruj</button>
        </Link>
      </div>
        </div>
    );
}
