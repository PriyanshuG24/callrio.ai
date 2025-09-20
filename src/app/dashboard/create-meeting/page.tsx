'use client'
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function CreateMeetingPage() {
    const [values,setValues]=useState({
        dateTime:new Date(),
        description:"",
        link:"",
    })
    const [callDetails,setCallDetails]=useState<Call>()
    const {data:user,isPending} = useSession();
    const client=useStreamVideoClient();
    const router=useRouter();
    const handleCreateMeeting =async () => {
        if(!user || !client){
            return;
        }
        try {
            const id=uuidv4();
            const call=client.call('default',id)
            if(!call){
                throw new Error('Call not created');
            }
            const startsAt=values.dateTime.toISOString() || new Date().toISOString();
            const description=values.description || 'instant meeting';
            await call.getOrCreate({
                data:{
                    starts_at:startsAt,
                    custom:{
                        description
                    }
                }
                
            })
            setCallDetails(call);
            console.log(call);
            console.log(values);
            if(!values.description){
             router.push(`/dashboard/meeting/${id}`)   
            }
            toast.success('Meeting created successfully');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return (
        <div>
            <h1>Create Meeting Page</h1>
            <Button onClick={handleCreateMeeting}>Create Meeting</Button>
        </div>
    );
}