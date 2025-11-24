import { useEffect, useState } from "react";
import { addComment, fetchEventComments } from "../api";

export default function EventComments({ eventId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ content: "", image_path: "" });

  async function loadComments() {
    setLoading(true);
    try {
      const data = await fetchEventComments(eventId);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [eventId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content && !form.image_path) return;
    try {
      await addComment(eventId, form);
      setForm({ content: "", image_path: "" });
      await loadComments();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      {loading ? (
        <div>Ładowanie komentarzy...</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" }}>
          {comments.map(c => (
            <li key={c.id} style={{ border: "1px solid #ddd", marginBottom: "6px", padding: "6px" }}>
              <div style={{ fontSize: "0.85em", marginBottom: "4px" }}>
                <strong>{c.user?.name || "User"}</strong> • {new Date(c.created_at).toLocaleString()}
              </div>
              {c.content && <div>{c.content}</div>}
              {c.image_path && (
                <div style={{ marginTop: "4px", fontSize: "0.8em", color: "#555" }}>
                  [Obrazek: <code>{c.image_path}</code>]
                </div>
              )}
            </li>
          ))}
          {comments.length === 0 && <li>Brak komentarzy.</li>}
        </ul>
      )}

      <h4>Dodaj komentarz</h4>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "4px" }}>
        <textarea
          name="content"
          placeholder="Treść komentarza..."
          value={form.content}
          onChange={handleChange}
        />
        <input
          name="image_path"
          placeholder="Ścieżka / URL obrazka (opcjonalnie)"
          value={form.image_path}
          onChange={handleChange}
        />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}
