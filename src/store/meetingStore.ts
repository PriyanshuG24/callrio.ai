// store/meetingStore.ts
import { create } from "zustand";

interface MeetingStore {
  meetingCache: Record<string, any>;
  storeMeeting: (id: string, data: any) => void;
  getMeeting: (id: string) => any;
  clearMeeting: (id: string) => void;
  clearAllMeetings: () => void;
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetingCache: {},

  storeMeeting: (id, data) =>
    set((state) => ({
      meetingCache: { ...state.meetingCache, [id]: data },
    })),

  getMeeting: (id) => get().meetingCache[id],

  clearMeeting: (id) =>
    set((state) => {
      const updated = { ...state.meetingCache };
      delete updated[id];
      return { meetingCache: updated };
    }),

  clearAllMeetings: () => set({ meetingCache: {} }),
}));
