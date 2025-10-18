'use client'
import { RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { useCallStore } from '@/store/callStore'
import { useSession } from "@/lib/auth-client"
import { useStreamVideoClient} from "@stream-io/video-react-sdk"
import { getAllMeeting } from '@/actions/dbAction/meeting'
import { getMeetingRecordings } from '@/actions/dbAction/recording'
export function RefreshButton() {
    const client = useStreamVideoClient()
    const { data: session } = useSession()
    const userId = session?.user.id
    const {refreshCalls,refreshCallRecordings,setLoading}=useCallStore()
    const fetchCallsData=async()=>{
        if(!client || !userId ) return
        try {
            setLoading(true)
            const data=await getAllMeeting(userId)        
            const recordings=await Promise.all(data.map((meeting)=>getMeetingRecordings(meeting.meetingId)))
            refreshCalls(data)
            refreshCallRecordings(recordings.flat())
        } catch (err) {
            console.log(err)  
          } finally {
            setLoading(false)
          }
    }
    return (
        <Button variant="ghost" size="icon" onClick={fetchCallsData}>
            <RefreshCcw />
        </Button>
    )
}