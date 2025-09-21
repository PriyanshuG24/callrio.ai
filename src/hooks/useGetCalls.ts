import { useSession } from "@/lib/auth-client"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([])
    const [loading, setLoading] = useState(false)
    const client = useStreamVideoClient()
    const {data: session} =useSession()
    const userId = session?.user.id
    useEffect(() => {
        const loadCalls = async () => {
            if(!client || !userId) return
            setLoading(true)
            try {
                const {calls}=await client.queryCalls({
                    sort:[{
                        field:"starts_at",
                        direction:-1
                    }],
                    filter_conditions: {
                       starts_at: {$exists:true},
                       $or:[
                        {created_by_user_id:userId},
                        {members:{$in:[userId]}}
                    ]
                    }
                })
                setCalls(calls)

            } catch (error) {
                console.log(error)
            }finally {
                setLoading(false)
            }
        }
        loadCalls()
    }, [client,userId])
    const now=new Date()
    const endedCalls=calls.filter(({state:{
        startsAt,endedAt}}:Call)=>{
            return (startsAt && new Date(startsAt)<now || !!endedAt)
        }
    )
    const upcomingCalls=calls.filter(({state:{
        startsAt}}:Call)=>{
            return (startsAt && new Date(startsAt)>now)
        }
    )
    return{
        callRecordings:calls,
        loading,
        endedCalls,
        upcomingCalls
    }
}
