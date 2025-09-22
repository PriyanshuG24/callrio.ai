'use client'
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
export const EndCallButton=()=>{
    const call=useCall()
    const router=useRouter()
    const {useLocalParticipant}=useCallStateHooks()
    const localParticipant=useLocalParticipant()
    const isMeetingOwner=localParticipant&&call?.state?.createdBy && localParticipant.userId===call.state.createdBy.id;
    const endCallForEveryone = async () => {
        try {
          // Disable camera and microphone first
          await call?.camera.disable();
          await call?.microphone.disable();
          // End the call
          await call?.endCall();
          
          // Navigate to dashboard
          router.push('/dashboard');
        } catch (error) {
          console.error('Failed to end call', error);
        }
      };
    if(!isMeetingOwner){
        return null;
    }
    return(
        <Button className="bg-red-500" onClick={endCallForEveryone}>
        End Call For Everyone
        </Button>
    )
}