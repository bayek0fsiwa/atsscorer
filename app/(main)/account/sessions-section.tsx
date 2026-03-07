"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LoaderPinwheel, Monitor, Smartphone, Globe, LogOut } from "lucide-react";
import { UAParser } from "ua-parser-js";

type Session = {
    id: string;
    token: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date;
};

function getDeviceIcon(userAgent: string | null | undefined) {
    if (!userAgent) return <Globe className="size-4 shrink-0 text-muted-foreground" />;
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().type;
    if (device === "mobile" || device === "tablet") {
        return <Smartphone className="size-4 shrink-0 text-muted-foreground" />;
    }
    return <Monitor className="size-4 shrink-0 text-muted-foreground" />;
}

function getDeviceLabel(userAgent: string | null | undefined) {
    if (!userAgent) return "Unknown device";
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name ?? "Unknown browser";
    const os = parser.getOS().name ?? "Unknown OS";
    return `${browser} on ${os}`;
}

export function SessionsSection() {
    const { data: currentSession } = authClient.useSession();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [revokingToken, setRevokingToken] = useState<string | null>(null);
    const [isRevokingAll, setIsRevokingAll] = useState(false);

    const fetchSessions = useCallback(async () => {
        setIsPending(true);
        try {
            const { data } = await authClient.listSessions();
            setSessions((data as Session[]) ?? []);
        } finally {
            setIsPending(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleRevoke = async (token: string) => {
        setRevokingToken(token);
        try {
            const { error } = await authClient.revokeSession({ token });
            if (error) {
                toast.error(error.message ?? "Failed to revoke session.");
                return;
            }
            toast.success("Session revoked.");
            fetchSessions();
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setRevokingToken(null);
        }
    };

    const handleRevokeOthers = async () => {
        setIsRevokingAll(true);
        try {
            const { error } = await authClient.revokeOtherSessions();
            if (error) {
                toast.error(error.message ?? "Failed to revoke sessions.");
                return;
            }
            toast.success("All other sessions signed out.");
            fetchSessions();
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setIsRevokingAll(false);
        }
    };

    if (isPending) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3.5 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const otherSessions = sessions.filter(
        (s) => s.token !== currentSession?.session.token
    );

    return (
        <div className="space-y-4">
            <ul className="space-y-2">
                {sessions.map((session) => {
                    const isCurrent = session.token === currentSession?.session.token;
                    const isRevoking = revokingToken === session.token;

                    return (
                        <li
                            key={session.id}
                            className="flex items-center justify-between rounded-md border px-4 py-3 gap-3"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {getDeviceIcon(session.userAgent)}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {getDeviceLabel(session.userAgent)}
                                        {isCurrent && (
                                            <span className="ml-2 text-xs text-green-600 font-normal">
                                                (This device)
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {session.ipAddress ?? "Unknown IP"} ·{" "}
                                        {new Date(session.createdAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {!isCurrent && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive shrink-0"
                                    disabled={isRevoking}
                                    onClick={() => handleRevoke(session.token)}
                                    aria-label="Revoke session"
                                >
                                    {isRevoking ? (
                                        <LoaderPinwheel className="size-4 animate-spin" />
                                    ) : (
                                        <LogOut className="size-4" />
                                    )}
                                </Button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {otherSessions.length > 1 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeOthers}
                    disabled={isRevokingAll}
                >
                    {isRevokingAll && (
                        <LoaderPinwheel className="size-4 animate-spin" />
                    )}
                    Sign out all other devices
                </Button>
            )}

            {sessions.length <= 1 && (
                <p className="text-sm text-muted-foreground italic">
                    No other active sessions.
                </p>
            )}
        </div>
    );
}
