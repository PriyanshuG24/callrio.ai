'use client'
import React from 'react'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import MeetingCardMain from './meetingCard/meetingCardMain';    
import Loader from '../ui/loader';
import { useCallStore } from '@/store/callStore';
type CallListType = "upcoming" | "ended"| "recordings";
interface CallListProps {
    type: CallListType;
}
const callList = ({type}: CallListProps) => {
    const {callRecordings,loading,endedCalls,upcomingCalls}=useCallStore()
    const getCalls=()=>{
        switch(type){
            case "upcoming":
                return upcomingCalls
            case "ended":
                return endedCalls
            case "recordings":
                return callRecordings
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