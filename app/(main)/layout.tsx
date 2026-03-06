import { cookies } from "next/headers";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 items-center justify-between border-b px-4">
                    <SidebarTrigger />
                    <ModeToggle />
                </header>

                <main className="p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
