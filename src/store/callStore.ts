import { create } from "zustand";
import { Call,CallRecording } from "@stream-io/video-react-sdk";
interface CallStore {
    callRecordings: CallRecording[]
    endedCalls: Call[]
    upcomingCalls: Call[]
    loading: boolean
    setCalls: (calls: Call[]) => void
    setLoading: (loading: boolean) => void
    refreshCalls: (calls: Call[]) => void
    setCallRecordings: (recordings: CallRecording[]) => void
    refreshCallRecordings: (recordings: CallRecording[]) => void

  }
export const useCallStore = create<CallStore>((set,get) => ({
    callRecordings: [],
    endedCalls: [],
    upcomingCalls: [],
    loading: false,

    setCalls: (calls) => {
        const now = new Date()
        const endedCalls = calls.filter(
        ({ state: { startsAt, endedAt } }: Call) => startsAt && endedAt && endedAt > startsAt
        )
        const upcomingCalls = calls.filter(
        ({ state: {startsAt, endedAt, custom } }: Call) => !endedAt && custom.description !== 'Instant Meeting' && startsAt && startsAt>now
        )
        set({endedCalls, upcomingCalls })
    },

    setLoading: (loading) => set({ loading }),

    refreshCalls: (calls) => {
        get().setCalls(calls)
    },

    setCallRecordings: (recordings) => set({ callRecordings: recordings }),

    refreshCallRecordings: (recordings) => {
        get().setCallRecordings(recordings)
    },
}));
