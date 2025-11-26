import { useEffect, useState } from "react";
import { fetchEvents } from "../api";
import { useAuth } from "../AuthContext";
import styles from "./Dashboard.module.css";

// helper: zamiana Date -> "YYYY-MM-DD"
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// helper: generuje "matrycę" miesiąca jako tablicę tygodni, każdy tydzień to 7 dni
function getMonthMatrix(date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const firstOfMonth = new Date(year, month, 1);

  // getDay(): 0 = niedziela, 1 = poniedziałek, ..., 6 = sobota
  // my chcemy poniedziałek jako pierwszy, więc przesuwamy
  const jsDay = firstOfMonth.getDay(); // 0..6
  const mondayFirstIndex = (jsDay + 6) % 7; // 0..6, gdzie 0 = poniedziałek

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // dni z poprzedniego miesiąca na początku
  for (let i = 0; i < mondayFirstIndex; i++) {
    const d = new Date(year, month, 1 - (mondayFirstIndex - i));
    days.push({ date: d, isCurrentMonth: false });
  }

  // właściwe dni miesiąca
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    days.push({ date: d, isCurrentMonth: true });
  }

  // dni z następnego miesiąca, żeby domknąć pełne tygodnie (multiples of 7)
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false });
  }

  // dzielimy na tygodnie
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export default function Dashboard() {
  // data reprezentująca "bieżący miesiąc", np. 2025-11-01
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  // wybrany dzień (w formacie YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
    const { user } = useAuth();

  // kiedy selectedDate się zmienia -> pobierz eventy z backendu
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchEvents(selectedDate); // GET /api/events?date=...
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedDate]);

  const monthMatrix = getMonthMatrix(currentMonthDate);
  const monthName = currentMonthDate.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  function handlePrevMonth() {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handleDayClick(dateObj) {
    setSelectedDate(formatDate(dateObj));
  }

  const selectedDateObj = new Date(selectedDate);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.calendarSection}>
        {/* Calendar Card */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <h2 className={styles.monthTitle}>{monthName}</h2>
            <div className={styles.monthNav}>
              <button onClick={handlePrevMonth} className={styles.navButton}>←</button>
              <button onClick={handleNextMonth} className={styles.navButton}>→</button>
            </div>
          </div>

          <table className={styles.calendarTable}>
            <thead>
              <tr>
                {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map(dow => (
                  <th key={dow}>{dow}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthMatrix.map((week, wi) => (
                <tr key={wi}>
                  {week.map(({ date, isCurrentMonth }, di) => {
                    const isSelected = formatDate(date) === selectedDate;
                    const isToday = formatDate(date) === formatDate(new Date());

                    let dayClasses = styles.calendarDay;
                    if (!isCurrentMonth) dayClasses += ` ${styles.otherMonth}`;
                    if (isToday) dayClasses += ` ${styles.today}`;
                    if (isSelected) dayClasses += ` ${styles.selected}`;

                    return (
                      <td key={di}>
                        <div
                          className={dayClasses}
                          onClick={() => handleDayClick(date)}
                        >
                          {date.getDate()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Events List */}
        <div className={styles.eventsSection}>
          <div className={styles.sectionTitle}>
            📋 Wydarzenia
            <span className={styles.selectedDateBadge}>
              {selectedDateObj.toLocaleDateString("pl-PL", { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : events.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📅</div>
              <div className={styles.emptyStateText}>Brak wydarzeń w tym dniu</div>
            </div>
          ) : (
            <div className={styles.eventsList}>
              {events.map(ev => (
                <div key={ev.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventTitle}>{ev.title}</div>
                    <div className={styles.eventTime}>
                      {ev.start_time} - {ev.end_time}
                    </div>
                  </div>
                  {ev.note && <div className={styles.eventNote}>{ev.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Pairing Status */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>Status parowania</div>
          {user?.is_paired ? (
            <div className={`${styles.statusCard} ${styles.paired}`}>
              <div className={styles.statusIcon}>✓</div>
              <div className={styles.statusText}>
                <strong>Sparowany</strong>
                Partner ID: {user.partner_id}
              </div>
            </div>
          ) : (
            <div className={`${styles.statusCard} ${styles.notPaired}`}>
              <div className={styles.statusIcon}>⚠</div>
              <div className={styles.statusText}>
                <strong>Brak parowania</strong>
                Przejdź do zakładki Partnerzy
              </div>
            </div>
          )}
        </div>

        {/* Future Features */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>Funkcje</div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>➕</span>
              <span>Dodawanie nowych wydarzeń</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>💬</span>
              <span>Komentarze do wydarzeń</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>👥</span>
              <span>Wspólny widok z partnerem</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>🔔</span>
              <span>Powiadomienia o wydarzeniach</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
