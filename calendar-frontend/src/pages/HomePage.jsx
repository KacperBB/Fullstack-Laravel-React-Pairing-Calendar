import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Przekierowanie na dashboard, jeśli zalogowany
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Kalendarz dla dwojga</h1>
        <p className={styles.heroSubtitle}>
          Zarządzaj swoim czasem i planuj wspólne chwile. Prosty, elegancki kalendarz stworzony specjalnie dla par.
        </p>
        <Link to="/auth">
          <button className={styles.ctaButton}>
            Rozpocznij za darmo
          </button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📅</span>
          <h3 className={styles.featureTitle}>Elegancki kalendarz</h3>
          <p className={styles.featureDescription}>
            Minimalistyczny interfejs inspirowany Notion, który ułatwia planowanie dnia
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🔗</span>
          <h3 className={styles.featureTitle}>Współdzielenie</h3>
          <p className={styles.featureDescription}>
            Sparuj się z partnerem za pomocą prostego kodu i zobacz wspólny plan
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💬</span>
          <h3 className={styles.featureTitle}>Komentarze</h3>
          <p className={styles.featureDescription}>
            Dodawaj notatki i komentarze do wydarzeń, komunikuj się płynnie
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={styles.benefitsSection}>
        <h2 className={styles.benefitsTitle}>Dlaczego warto?</h2>
        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✨</span>
            <span className={styles.benefitText}>
              Prosty i intuicyjny interfejs
            </span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>🔒</span>
            <span className={styles.benefitText}>
              Bezpieczne dane z Laravel Sanctum
            </span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>⚡</span>
            <span className={styles.benefitText}>
              Szybki i responsywny React
            </span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>🎨</span>
            <span className={styles.benefitText}>
              Piękny, nowoczesny design
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
