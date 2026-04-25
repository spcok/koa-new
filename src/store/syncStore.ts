import { create } from 'zustand';

interface SyncState {
  isSyncing: boolean;
  lastSynced: string | null;
  setSyncing: (status: boolean) => void;
  setLastSynced: (timestamp: string) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSynced: null,
  setSyncing: (status) => set({ isSyncing: status }),
  setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
}));
