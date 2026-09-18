import axios, { AxiosError } from 'axios';
import type { User } from './userTypes.ts';

// Wir erstellen eine Axios-Instanz für globale Einstellungen
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
});

// Ein Interceptor fängt Fehler zentral ab
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Wenn Token ungültig oder abgelaufen (401 oder 403) -> Automatischer Logout
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const data = error.response?.data;

    // Prüft erst ob data ein Text ist, sonst ob data.message existiert
    const message =
      typeof data === 'string'
        ? data
        : (data as any)?.message || 'Die Verbindung zum Server ist fehlgeschlagen.';

    // Wir werfen den Fehler mit der sauberen Nachricht weiter
    return Promise.reject({ ...error, message });
  }
);

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/login', { username, password });
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/register', { username, email, password });
    return response.data;
  },
};
