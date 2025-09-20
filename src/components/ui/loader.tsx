import { Loader2 } from "lucide-react"

export default function Loader() {
    return(
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2 text-sm text-muted-foreground">Loading...</p>
        </div>
    )
}