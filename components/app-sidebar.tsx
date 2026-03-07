"use client"

import * as React from "react"
import Image from "next/image"
import { FileUser, House, } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const navMain = [
    {
        title: "Home",
        url: "/",
        icon: House,
        isActive: true,
    },
    {
        title: "Resumes",
        url: "/resumes",
        icon: FileUser,
    },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { user: { name: string, email: string, image?: string | null } }

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border px-2">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                    <Image src="/logo.svg" alt="ATS Scorer Logo" width={28} height={28} className="shrink-0" />
                    <h1 className="truncate text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                        ATS Scorer Dashboard
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
