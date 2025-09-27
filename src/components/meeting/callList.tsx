'use client'
import React from 'react'
import { useEffect } from 'react'
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import MeetingCardMain from './meetingCard/meetingCardMain';    
import Loader from '../ui/loader';
type CallListType = "upcoming" | "ended"| "recordings";
interface CallListProps {
    type: CallListType;
}
const callList = ({type}: CallListProps) => {
    const {callRecordings,loading,endedCalls,upcomingCalls}=useGetCalls()
    const [recordings,setRecordings]=React.useState<CallRecording[]>([])
    const getCalls=()=>{
        switch(type){
            case "upcoming":
                return upcomingCalls
            case "ended":
                return endedCalls
            case "recordings":
                return recordings
            default:
                return []
        }
    }
    const getNoCallsMessage=()=>{
        switch(type){
            case "upcoming":
                return "No upcoming calls"
            case "ended":
                return "No ended calls"
            case "recordings":
                return "No recordings"
            default:
                return ""
        }
    }
    useEffect(()=>{
        const fetchRecordings=async()=>{
            if(type==='recordings'){
                const callData=await Promise.all(callRecordings.map((meeting)=>meeting.queryRecordings()))
                const recordings=callData.
                filter((call)=> call.recordings.length>0)
                .flatMap((call)=>call.recordings)
                setRecordings(recordings)
            }
        }
        if(type==='recordings'){
            fetchRecordings()
        }
    },[type,callRecordings])
    const calls=getCalls()
    const noCallsMessage=getNoCallsMessage()
    if(loading){
        return <Loader />
    }
    if (!calls || calls.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-lg">{noCallsMessage}</p>
          </div>
        );
      }
      
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {calls && calls.length > 0 ? calls.map((meeting:Call|CallRecording)=>(
            <MeetingCardMain 
            key={(meeting as Call).id || (meeting as CallRecording).filename}
            meeting={(meeting as Call)}
            type={type}
             />
        )) : <h1>{noCallsMessage}</h1>}
    </div>
  )
}

export default callList