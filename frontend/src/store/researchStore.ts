import { create } from 'zustand';

interface ResearchState {
  jobId: string | null;
  status: string;
  query: string;
  report: string;
  progressUpdates: Array<{ event: string; agent?: string; message?: string }>;
  setJobId: (id: string) => void;
  setStatus: (status: string) => void;
  setQuery: (query: string) => void;
  setReport: (report: string) => void;
  addProgressUpdate: (update: any) => void;
  reset: () => void;
}

export const useResearchStore = create<ResearchState>((set) => ({
  jobId: null,
  status: 'idle',
  query: '',
  report: '',
  progressUpdates: [],
  setJobId: (id) => set({ jobId: id }),
  setStatus: (status) => set({ status }),
  setQuery: (query) => set({ query }),
  setReport: (report) => set({ report }),
  addProgressUpdate: (update) => set((state) => ({ 
    progressUpdates: [...state.progressUpdates, update] 
  })),
  reset: () => set({ jobId: null, status: 'idle', query: '', report: '', progressUpdates: [] })
}));
