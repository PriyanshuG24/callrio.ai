'use client'

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isPending) {
            router.push("/dashboard")
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

    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Calrio</h1>
        </main>
    )
}