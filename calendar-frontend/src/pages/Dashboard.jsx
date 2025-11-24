import { useEffect, useState } from "react";
import { fetchEvents } from "../api";
import { useAuth } from "../AuthContext";

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
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
      <div>
        {/* Nawigacja po miesiącach */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <button onClick={handlePrevMonth}>{"<"}</button>
          <h2 style={{ textTransform: "capitalize" }}>{monthName}</h2>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>

        {/* Tabela z dniami miesiąca */}
        <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: 20 }}>
          <thead>
            <tr>
              {["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"].map(dow => (
                <th
                  key={dow}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: 4,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {dow}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthMatrix.map((week, wi) => (
              <tr key={wi}>
                {week.map(({ date, isCurrentMonth }, di) => {
                  const isSelected = formatDate(date) === selectedDate;
                  const isToday = formatDate(date) === formatDate(new Date());

                  return (
                    <td
                      key={di}
                      onClick={() => handleDayClick(date)}
                      style={{
                        padding: 8,
                        textAlign: "center",
                        cursor: "pointer",
                        border: "1px solid #eee",
                        backgroundColor: isSelected
                          ? "#1976d2"
                          : isToday
                          ? "#e3f2fd"
                          : "transparent",
                        color: !isCurrentMonth ? "#aaa" : isSelected ? "#fff" : "#000",
                      }}
                    >
                      {date.getDate()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Lista eventów dla wybranego dnia */}
        <div>
          <h3>Wydarzenia w dniu {selectedDateObj.toLocaleDateString("pl-PL")}</h3>
          {loading ? (
            <div>Ładowanie...</div>
          ) : events.length === 0 ? (
            <div>Brak wydarzeń.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {events.map(ev => (
                <li
                  key={ev.id}
                  style={{
                    border: "1px solid #ddd",
                    marginBottom: 8,
                    padding: 8,
                    background: ev.color || "#f5f5f5",
                  }}
                >
                  <div>
                    <strong>{ev.title}</strong> ({ev.start_time} - {ev.end_time})
                  </div>
                  {ev.note && <div style={{ fontSize: "0.9em" }}>{ev.note}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* prawa kolumna - na razie placeholder, później możesz tu dać formę dodawania eventów, komentarze itd. */}
      <div>
        <h3>Szczegóły / dalsza rozbudowa</h3>
        <p>
          Tutaj możesz później dodać:
        </p>
        <ul>
          <li>formularz tworzenia eventu dla wybranego dnia,</li>
          <li>komentarze do eventów,</li>
          <li>listę eventów partnerów w tym samym dniu.</li>
        </ul>
      </div>
      <div style={{ marginBottom: 16, padding: 8, border: "1px solid #ddd" }}>
  {user?.is_paired ? (
    <div style={{ color: "green" }}>
      Sparowany użytkownik: partner_id = {user.partner_id}
    </div>
  ) : (
    <div style={{ color: "red" }}>
      Nie jesteś sparowany z żadnym użytkownikiem.
    </div>
  )}
</div>

    </div>
  );
}
