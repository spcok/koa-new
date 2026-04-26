import { create } from 'zustand';

interface DashboardState {
  viewingDate: Date;
  sortOrder: 'asc' | 'desc';
  setViewingDate: (date: Date) => void;
  shiftDate: (days: number) => void;
  toggleSortOrder: () => void;
  resetToToday: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  viewingDate: new Date(),
  sortOrder: 'asc',
  setViewingDate: (date) => set({ viewingDate: date }),
  shiftDate: (days) => set((state) => {
    const newDate = new Date(state.viewingDate);
    newDate.setDate(newDate.getDate() + days);
    return { viewingDate: newDate };
  }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
  resetToToday: () => set({ viewingDate: new Date() }),
}));
