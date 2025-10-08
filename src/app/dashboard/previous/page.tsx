'use client'
import CallList from '@/components/meeting/callList';
import { Clock } from 'lucide-react';
import { useCall } from '@stream-io/video-react-sdk';
import { useEffect } from 'react';

export default function PreviousPage() {
  const call=useCall()
  // console.log(call)
  useEffect(()=>{
    const fxn=async()=>{
      const data=await call?.queryTranscriptions()
      // console.log(data)
    }
    fxn()
  },[call])
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <Clock className="h-6 w-6" />
        Ended Meetings
      </h1>
      <CallList type="ended" />
    </div>
  );
}