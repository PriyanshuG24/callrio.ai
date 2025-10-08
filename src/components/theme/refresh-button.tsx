'use client'
import { RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { useCallStore } from '@/store/callStore'
import { useSession } from "@/lib/auth-client"
import { useStreamVideoClient} from "@stream-io/video-react-sdk"
export function RefreshButton() {
    const client = useStreamVideoClient()
    const { data: session } = useSession()
    const userId = session?.user.id
    const {refreshCalls,refreshCallRecordings,setLoading}=useCallStore()
    const fetchCallsData=async()=>{
        if(!client || !userId ) return
        try {
            setLoading(true)
            const { calls } = await client.queryCalls({
                sort: [{ field: "starts_at", direction: -1 }],
                filter_conditions: {
                starts_at: { $exists: true },
                $or: [
                    { created_by_user_id: userId },
                    { members: { $in: [userId] } },
                ],
                },
            })           
            const callData=await Promise.all(calls.map((meeting)=>meeting.queryRecordings()))
            const recordings=callData.filter((call)=> call.recordings.length>0).flatMap((call)=>call.recordings)
            refreshCalls(calls)
            refreshCallRecordings(recordings)
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