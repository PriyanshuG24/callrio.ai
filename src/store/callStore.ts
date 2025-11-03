import { create } from "zustand";
import { persist } from "zustand/middleware"; 

interface CallStore {
  callRecordings:any[]
  endedCalls: any[]
  upcomingCalls: any[]
  loading: boolean
  setCalls: (calls: any[]) => void
  setLoading: (loading: boolean) => void
  refreshCalls: (calls: any[]) => void
  setCallRecordings: (recordings: any[]) => void
  refreshCallRecordings: (recordings: any[]) => void
  clearStore: () => void 
  addUpcomingCall: (call: any) => void
  addEndedCall: (call: any) => void 
  addCallRecording: (call: any) => void
}

export const useCallStore = create<CallStore>()(
  persist(
    (set, get) => ({
      callRecordings: [],
      endedCalls: [],
      upcomingCalls: [],
      loading: false,

      setCalls: (calls:any[]) => {
        const endedCalls = calls.filter((call:any) => call.isEnded);
        const upcomingCalls = calls.filter((call:any) => !call.isStarted);
        set({ endedCalls, upcomingCalls });
      },
      setLoading: (loading) => set({ loading }),

      refreshCalls: (calls:any[]) => {
        get().setCalls(calls);
      },

      setCallRecordings: (recordings:any[]) => set({ callRecordings: recordings }),
      addCallRecording: (call:any) =>
        set((state) => ({
          callRecordings: [...state.callRecordings, call],
        })),
      addUpcomingCall: (call:any) =>
        set((state) => ({
          upcomingCalls: [...state.upcomingCalls, call],
        })),
      addEndedCall: (call:any) =>
        set((state) => ({
          endedCalls: [...state.endedCalls, call],
          upcomingCalls: state.upcomingCalls.filter((c) => c.meetingId !== call.meetingId)
        })),
      refreshCallRecordings: (recordings:any[]) => {
        get().setCallRecordings(recordings);
      },

      clearStore: () => set({ callRecordings: [], endedCalls: [], upcomingCalls: [] })
    }),
    {
      name: "call-store-storage", 
    }
  )
);
