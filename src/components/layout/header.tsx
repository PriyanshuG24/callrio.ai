'use client'
import { useSession } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { signOut } from "@/lib/auth-client"
import Link from "next/link"
import { disconnectStreamClient } from "@/lib/stream-client"



export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const isLoginPage = pathname === '/login'

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        }
      },
    })
    disconnectStreamClient()
  }

 
  if (isPending) {
    return (
      <header suppressHydrationWarning={true} className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">CALLRIO.ai</span>
            </Link>
          </div>

          <div className="flex items-center ">
            {session ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500">{session?.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}