import axios from 'axios';
import type { Quest } from './questTypes.ts';

// Wir erstellen eine Axios-Instanz für globale Einstellungen
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

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
  }
};