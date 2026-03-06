"use client"

import * as React from "react"
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

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
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
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
                <h1 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight text-balance group-data-[collapsible=icon]:hidden">
                    Dashboard
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
