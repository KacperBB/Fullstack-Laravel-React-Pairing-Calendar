import { useEffect, useState } from "react";
import { fetchPartners, generatePairingCode, pairWithCode, fetchPartnerEvents } from "../api";
import styles from "./PartnersPage.module.css";

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
    <div className={styles.partnersContainer}>
      <div className={styles.leftPanel}>
        {/* Generate Code Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🔑 Generuj kod parowania</h2>
          <button onClick={handleGenerateCode} className={styles.generateButton}>
            Wygeneruj nowy kod
          </button>
          {generatedCode && (
            <div className={styles.codeDisplay}>
              <div className={styles.codeLabel}>Twój kod parowania:</div>
              <div className={styles.codeValue}>{generatedCode}</div>
              <div className={styles.codeHint}>Przekaż ten kod drugiej osobie</div>
            </div>
          )}
        </div>

        {/* Pair with Code Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🔗 Sparuj się kodem</h2>
          <form onSubmit={handlePair} className={styles.pairingForm}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Wpisz kod parowania"
              className={styles.codeInput}
            />
            <button type="submit" className={styles.pairButton}>
              Sparuj
            </button>
          </form>
        </div>

        {/* Partners List Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>👥 Lista partnerów</h2>
          <div className={styles.partnersList}>
            {partners.map(p => (
              <div
                key={p.id}
                className={`${styles.partnerItem} ${selectedPartner?.id === p.id ? styles.selected : ''}`}
                onClick={() => setSelectedPartner(p)}
              >
                <div className={styles.partnerName}>{p.name}</div>
                <div className={styles.partnerEmail}>{p.email}</div>
              </div>
            ))}
            {partners.length === 0 && (
              <div className={styles.emptyPartners}>
                Brak partnerów. Wygeneruj kod i podziel się nim!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Partner Events */}
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📅 Plan partnera</h2>
          {selectedPartner ? (
            <>
              <div className={styles.partnerHeader}>
                <div className={styles.partnerInfo}>
                  <div className={styles.partnerAvatar}>
                    {selectedPartner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.partnerDetails}>
                    <div className={styles.partnerDetailsName}>{selectedPartner.name}</div>
                    <div className={styles.partnerDetailsEmail}>{selectedPartner.email}</div>
                  </div>
                </div>
                <div className={styles.dateSelector}>
                  <label className={styles.dateLabel}>Data:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              <div className={styles.eventsList}>
                {partnerEvents.map(ev => (
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
                {partnerEvents.length === 0 && (
                  <div className={styles.emptyEvents}>
                    <div className={styles.emptyEventsIcon}>📭</div>
                    <div>Brak wydarzeń w tym dniu</div>
                  </div>
                )}
              </div>

              <div className={styles.infoNote}>
                💡 Możesz zobaczyć plan swojego partnera i lepiej zaplanować wspólny czas
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>👈</div>
              <div className={styles.placeholderText}>Wybierz partnera z listy</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
