import {auth} from '@/lib/auth'
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Loader from '@/components/ui/loader'

export default async function Home() {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(session){
        redirect('/dashboard')
    }
    if(session){
        <Loader/>
    }
    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Calrio</h1>
        </main>
    )
}