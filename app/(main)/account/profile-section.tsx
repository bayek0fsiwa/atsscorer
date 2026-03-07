"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";
import { EditNameSection } from "./edit-name-section";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function ProfileSection() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex items-center gap-4">
                <Skeleton className="size-14 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        );
    }

    if (!session) return null;

    const { user } = session;
    const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
    });

    return (
        <div className="flex items-start gap-4">
            <Avatar className="size-14 shrink-0">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="text-base font-medium">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-3 text-sm">
                {/* Name */}
                <EditNameSection />

                {/* Email + verified badge */}
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">{user.email}</p>
                        {user.emailVerified ? (
                            <Badge
                                variant="outline"
                                className="gap-1 text-xs text-green-600 border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800 dark:text-green-400"
                            >
                                <CheckCircle2 className="size-3" />
                                Verified
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="gap-1 text-xs text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-400"
                            >
                                <XCircle className="size-3" />
                                Unverified
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Member since */}
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Member Since</p>
                    <p className="font-medium">{memberSince}</p>
                </div>
            </div>
        </div>
    );
}
