import axios, { AxiosError } from 'axios';
import type { Quest } from './questTypes.ts';

// Wir erstellen eine Axios-Instanz für globale Einstellungen
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
});

// Ein Interceptor fängt Fehler zentral ab
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Falls der Server eine Nachricht schickt, nutzen wir die, ansonsten Fallback
    const message = (error.response?.data as any)?.message || "Die Verbindung zum Server ist fehlgeschlagen.";
    
    // Wir werfen den Fehler mit der sauberen Nachricht weiter
    return Promise.reject({ ...error, message });
  }
);

export const questService = {
  async fetchQuests(): Promise<Quest[]> {
    const response = await api.get<Quest[]>('/quests');
    return response.data; // Axios packt die Daten automatisch in .data
  },

  async toggleQuest(quest: Quest): Promise<Quest> {
    const response = await api.put<Quest>(`/quests/${quest.id}`, {
      ...quest,
      completed: !quest.completed
    });
    return response.data;
  },

  async createQuest(quest: Omit<Quest, 'id'>): Promise<Quest> {
    const response = await api.post<Quest>('/quests', quest);
    return response.data;
  },
  
  async updateQuest(id: number, quest: Partial<Quest>): Promise<Quest> {
    // Partial erlaubt es uns, auch nur geänderte Felder zu senden
    const response = await api.put<Quest>(`/quests/${id}`, quest);
    return response.data;
  },

  async deleteQuest(id: number): Promise<void> {
    await api.delete(`/quests/${id}`);
  },
};