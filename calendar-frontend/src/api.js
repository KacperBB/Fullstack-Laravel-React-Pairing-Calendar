import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
})

//token
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common['Authorization'];
    }
}

const existingToken = localStorage.getItem("token");
if(existingToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

export async function register(data) {
    const res = await api.post("/register", data);
    return res.data;
}

export async function login(data) {
    const res = await api.post("/login", data);
    return res.data;
}

export async function fetchMe() {
  const res = await api.get("/me");
  return res.data;
}

export async function fetchEvents(date) {
  const res = await api.get("/events", {
    params: date ? { date } : {},
  });
  return res.data;
}

export async function createEvent(payload) {
  const res = await api.post("/events", payload);
  return res.data;
}

export async function fetchEventComments(eventId) {
  const res = await api.get(`/events/${eventId}/comments`);
  return res.data;
}

export async function addComment(eventId, payload) {
  const res = await api.post(`/events/${eventId}/comments`, payload);
  return res.data;
}

export async function generatePairingCode() {
  const res = await api.post("/pairing-code");
  return res.data;
}

export async function pairWithCode(code) {
  const res = await api.post("/pair", { code });
  return res.data;
}

export async function fetchPartners() {
  const res = await api.get("/partners");
  return res.data;
}

export async function logout() {
  await api.post("/logout");
  setAuthToken(null);
}

export async function fetchPartnerEvents(partnerId, date) {
  const res = await api.get(`/partners/${partnerId}/events`, {
    params: date ? { date } : {},
  });
  return res.data;
}



export default api;
