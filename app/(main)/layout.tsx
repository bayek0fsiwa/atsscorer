import { cookies, headers } from "next/headers";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/auth/signin");

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={session.user} />
            <SidebarInset>
                <header className="flex h-16 items-center justify-between border-b px-4">
                    <SidebarTrigger />
                    <ModeToggle />
                </header>
                <main className="p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
