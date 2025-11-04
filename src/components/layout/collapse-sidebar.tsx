"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Plus,
  Clock,
  Calendar,
  CalendarClock,
  Video,
  User,
} from "lucide-react";
import { LogoutButton } from "../auth/logout";
import { useTheme } from "next-themes";

export function CollapsibleSidebar() {
  const { theme } = useTheme();
  const navItems = [
    { name: "New Meeting", href: "/dashboard/create-meeting", icon: Plus },
    { name: "Previous", href: "/dashboard/previous", icon: Clock },
    { name: "Upcoming", href: "/dashboard/upcoming", icon: CalendarClock },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Recordings", href: "/dashboard/recordings", icon: Video },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="sm:hidden ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5" />
            Menu
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={`w-36 ${theme === "light" ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : ""}`}
          align="start"
        >
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} passHref>
                <DropdownMenuItem
                  className={cn(
                    "flex items-center gap-2 cursor-pointer text-sm",
                    "hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  )}
                >
                  <Icon className="h-4 w-4 text-blue-500" />
                  {item.name}
                </DropdownMenuItem>
              </Link>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-500 hover:text-red-600 cursor-pointer">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
