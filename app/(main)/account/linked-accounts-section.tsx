"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LoaderPinwheel, Link as LinkIcon, Unlink } from "lucide-react";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../auth/icons";

type ProviderId = "google" | "github" | "apple";

const providers: { id: ProviderId; name: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { id: "google", name: "Google", Icon: GoogleIcon },
    { id: "github", name: "GitHub", Icon: GithubIcon },
    { id: "apple", name: "Apple", Icon: AppleIcon },
];

import { useRouter } from "next/navigation";

interface Account {
    id: string;
    userId: string;
    providerId: string;
    accountId: string;
    createdAt: Date;
    updatedAt: Date;
}

export function LinkedAccountsSection({ initialAccounts }: { initialAccounts: Account[] }) {
    const router = useRouter();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const linkedProviders = initialAccounts.map(a => a.providerId);
    // User can unlink if they have more than one account linked (social or credential)
    const canUnlink = initialAccounts.length > 1;

    const handleLink = async (providerId: ProviderId) => {
        setActionLoading(providerId);
        try {
            const { error } = await authClient.linkSocial({
                provider: providerId,
                callbackURL: "/account",
            });
            if (error) {
                toast.error(error.message ?? `Failed to link ${providerId}.`);
                return;
            }
            // Router refresh to get updated accounts from server
            router.refresh();
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnlink = async (providerId: ProviderId) => {
        if (!canUnlink) {
            toast.error("You must have at least one authentication method linked.");
            return;
        }

        setActionLoading(providerId);
        try {
            // @ts-ignore
            const { error } = await authClient.account.unlink({
                providerId: providerId,
            });
            if (error) {
                toast.error(error.message ?? `Failed to unlink ${providerId}.`);
                return;
            }
            toast.success(`${providerId} unlinked successfully.`);
            router.refresh();
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-3">
            {providers.map((provider) => {
                const isLinked = linkedProviders.includes(provider.id);
                const isLoading = actionLoading === provider.id;

                return (
                    <div
                        key={provider.id}
                        className="flex items-center justify-between p-3 border rounded-lg transition-colors hover:bg-muted/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border shadow-sm">
                                <provider.Icon className="size-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">{provider.name}</p>
                                {isLinked ? (
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
                                    >
                                        Connected
                                    </Badge>
                                ) : (
                                    <p className="text-[11px] text-muted-foreground">Not connected</p>
                                )}
                            </div>
                        </div>

                        {isLinked ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnlink(provider.id)}
                                disabled={isLoading || !canUnlink}
                                className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                            >
                                {isLoading ? (
                                    <LoaderPinwheel className="size-3 animate-spin" />
                                ) : (
                                    <Unlink className="size-3" />
                                )}
                                Unlink
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleLink(provider.id)}
                                disabled={isLoading}
                                className="h-8 gap-1.5 text-xs"
                            >
                                {isLoading ? (
                                    <LoaderPinwheel className="size-3 animate-spin" />
                                ) : (
                                    <LinkIcon className="size-3" />
                                )}
                                Link
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
