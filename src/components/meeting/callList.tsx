'use client'
import React from 'react'
import MeetingCardMain from './meetingCard/meetingCardMain';    
import Loader from '../ui/loader';
import { useCallStore } from '@/store/callStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
type CallListType = "upcoming" | "ended"| "recordings";
interface CallListProps {
    type: CallListType;
}
const callList = ({type}: CallListProps) => {
    const router=useRouter()
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
    <>
    <div className="flex justify-end mb-5">
        <Button variant="outline" className="flex items-center gap-2" onClick={()=>router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
        </Button>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {calls && calls.length > 0 ? calls.map((meeting)=>(
            
            
            <MeetingCardMain 
            key={(meeting as any).id  || (meeting as any).url}
            meeting={(meeting as any)}
            type={type}
             />

        )) : <h1>{noCallsMessage}</h1>}
    </div>
    </>
  )
}

export default callList