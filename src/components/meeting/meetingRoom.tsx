import { Call, CallControls, CallParticipantsList, CallStatsButton, PaginatedGridLayout,SpeakerLayout } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel } from '../ui/dropdown-menu'
import { LayoutList, Users } from 'lucide-react'
import { DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import { EndCallButton } from './endCallButton'
type CallLayoutType='grid'|'speaker-left'| 'speaker-right'
const MeetingRoom = () => {
  const searchParams=useSearchParams()
  const isPersonal=!!searchParams.get('personal')
  const [layout,setLayout]=useState<CallLayoutType>('speaker-left')
  const [showParticipants,setShowParticipants]=useState(false)
  const CallLayout=()=>{
    switch(layout){
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition='left'/>
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition='right'/>
      default:
        return <PaginatedGridLayout/>
    }
  }
  return (
   <section className='relative h-screen w-full overflow-hidden pt-16 text-white'>
    <div className='relative size-full flex items-center justify-center'>
      <div className='relative size-full max-w-[1000px] items-center justify-center'>
        <CallLayout/>
      </div>
      <div className={cn('h-[calc(100vh-86px)] hidden ml-2 w-[250px]',{'block':showParticipants})}>
        <CallParticipantsList onClose={()=>setShowParticipants(false)}/>
      </div>
    </div>
    <div className='fixed bottom-0 w-full flex items-center justify-center gap-5 flex-wrap'>
      <CallControls/>
      <DropdownMenu>
        <div className='flex items-center gap-2'>
          <DropdownMenuTrigger className='curosr-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
            <LayoutList size={22} className='text-white '/>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
          {['grid','speaker-left','speaker-right'].map((item,index)=>(
            <div key={index}>
              <DropdownMenuItem onClick={()=>setLayout(item.toLocaleLowerCase() as CallLayoutType )} className='flex items-center gap-2 cursor-pointer text-black'>
                {item}
              </DropdownMenuItem>
            </div>
          ))}
          <DropdownMenuSeparator className='border-dark-1'/>
        </DropdownMenuContent>
      </DropdownMenu>
      <CallStatsButton/>
      <Button onClick={()=>setShowParticipants((prev)=>!prev)}>
        <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
          <Users size={22} className='text-white '/>
        </div>
      </Button>
      {!isPersonal && <EndCallButton/>}
    </div>
   </section>
  )
}

export default MeetingRoom