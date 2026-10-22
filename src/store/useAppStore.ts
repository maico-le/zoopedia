import { create } from 'zustand';

export interface AppState {
  language: 'vi' | 'en';
  darkMode: boolean;
  performanceMode: 'high' | 'low';
  setLanguage: (lang: 'vi' | 'en') => void;
  toggleDarkMode: () => void;
  setPerformanceMode: (mode: 'high' | 'low') => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'vi',
  darkMode: true,
  performanceMode: 'high',
  setLanguage: (language) => set({ language }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setPerformanceMode: (performanceMode) => set({ performanceMode }),
}));
