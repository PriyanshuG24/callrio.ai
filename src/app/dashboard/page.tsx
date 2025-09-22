'use client'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
export default function DashboardPage() {
    const { data: session, isPending } = useSession()
        const router = useRouter()
        const [isLoading, setIsLoading] = useState(true)
    
        useEffect(() => {
            if (isPending) {
                router.push("/")
            } else if (!isPending) {
                setIsLoading(false)
            }
        }, [isPending, router])
    
        if (isLoading) {
            return (
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            )
        }
    return(
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}