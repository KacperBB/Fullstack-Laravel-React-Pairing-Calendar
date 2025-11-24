import { useEffect, useState } from "react";
import { fetchPartners, generatePairingCode, pairWithCode, fetchPartnerEvents } from "../api";

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [partnerEvents, setPartnerEvents] = useState([]);

  async function loadPartners() {
    try {
      const data = await fetchPartners();
      setPartners(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  async function handleGenerateCode() {
    try {
      const data = await generatePairingCode();
      setGeneratedCode(data.code);
    } catch (e) {
      console.error(e);
    }
  }

  async function handlePair(e) {
    e.preventDefault();
    if (!code) return;
    try {
      await pairWithCode(code);
      setCode("");
      await loadPartners();
      alert("Sparowano (lub już byliście sparowani)");
    } catch (e) {
      console.error(e);
      alert("Nie udało się sparować (kod nieprawidłowy lub wygasł)");
    }
  }

  async function loadPartnerEvents(partner) {
    try {
      const data = await fetchPartnerEvents(partner.id, date);
      setPartnerEvents(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (selectedPartner) {
      loadPartnerEvents(selectedPartner);
    }
  }, [selectedPartner, date]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
      <div>
        <h2>Partnerzy</h2>
        <button onClick={handleGenerateCode}>Wygeneruj kod parowania</button>
        {generatedCode && (
          <div style={{ marginTop: "8px" }}>
            <strong>Twój kod:</strong> <code>{generatedCode}</code>
            <div style={{ fontSize: "0.8em" }}>Przekaż go drugiej osobie.</div>
          </div>
        )}

        <h3>Sparuj się kodem</h3>
        <form onSubmit={handlePair}>
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Kod parowania"
          />
          <button type="submit">Sparuj</button>
        </form>

        <h3>Lista partnerów</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {partners.map(p => (
            <li
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: "6px",
                marginBottom: "6px",
                cursor: "pointer",
                background: selectedPartner?.id === p.id ? "#eee" : "white",
              }}
              onClick={() => setSelectedPartner(p)}
            >
              <strong>{p.name}</strong>
              <div style={{ fontSize: "0.8em" }}>{p.email}</div>
            </li>
          ))}
          {partners.length === 0 && <li>Brak partnerów.</li>}
        </ul>
      </div>

      <div>
        <h2>Plan partnera</h2>
        {selectedPartner ? (
          <>
            <div style={{ marginBottom: "8px" }}>
              <strong>{selectedPartner.name}</strong>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label>Data: </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {partnerEvents.map(ev => (
                <li
                  key={ev.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    marginBottom: "8px",
                    background: ev.color || "#f5f5f5",
                  }}
                >
                  <div>
                    <strong>{ev.title}</strong> ({ev.start_time} - {ev.end_time})
                  </div>
                  {ev.note && <div style={{ fontSize: "0.9em" }}>{ev.note}</div>}
                </li>
              ))}
              {partnerEvents.length === 0 && (
                <li>Brak eventów partnera na ten dzień.</li>
              )}
            </ul>
            <div style={{ fontSize: "0.8em", marginTop: "8px" }}>
              Komentarze do eventów partnera robisz w tym samym panelu co swoje – jeśli masz ID eventu, możesz go kliknąć w swoim UI (to można potem rozbudować).
            </div>
          </>
        ) : (
          <div>Wybierz partnera z listy po lewej.</div>
        )}
      </div>
    </div>
  );
}
