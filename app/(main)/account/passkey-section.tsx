"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel, Fingerprint, Trash2, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function PasskeySection() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: passkeys, isPending, refetch } = authClient.useListPasskeys();

    const handleAddPasskey = async () => {
        setIsRegistering(true);
        try {
            const result = await authClient.passkey.addPasskey();
            if (result?.error) {
                const err = result.error;
                const code = "code" in err ? err.code : "";
                if (code !== "ERROR_CEREMONY_ABORTED" && code !== "AUTH_CANCELLED") {
                    toast.error(err.message ?? "Failed to add passkey.");
                }
                return;
            }
            toast.success("Passkey registered! You can now sign in with it.");
            refetch();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            toast.error(`Error: ${message}`);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const result = await authClient.passkey.deletePasskey({ id });
            if (result?.error) {
                toast.error(result.error.message ?? "Failed to delete passkey.");
                return;
            }
            toast.success("Passkey deleted.");
            refetch();
        } catch {
            toast.error("Failed to delete passkey.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Passkeys let you sign in securely using your device — Face ID, fingerprint, or Windows Hello — no password needed.
            </p>

            {/* Registered passkeys list */}
            {isPending ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoaderPinwheel className="size-4 animate-spin" />
                    Loading passkeys.....
                </div>
            ) : passkeys && passkeys.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {passkeys.map((pk) => (
                        <li
                            key={pk.id}
                            className="flex items-center justify-between rounded-md border px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <KeyRound className="size-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {pk.name ?? pk.deviceType ?? "Passkey"}
                                    </p>
                                    {pk.createdAt && (
                                        <p className="text-xs text-muted-foreground">
                                            Added{" "}
                                            {new Date(pk.createdAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                disabled={deletingId === pk.id}
                                onClick={() => handleDelete(pk.id)}
                                aria-label="Delete passkey"
                            >
                                {deletingId === pk.id ? (
                                    <LoaderPinwheel className="size-4 animate-spin" />
                                ) : (
                                    <Trash2 className="size-4" />
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground italic">No passkeys registered yet.</p>
            )}

            <div>
                <Button
                    onClick={handleAddPasskey}
                    disabled={isRegistering}
                    variant="outline"
                >
                    {isRegistering ? (
                        <LoaderPinwheel className="size-4 animate-spin" />
                    ) : (
                        <Fingerprint className="size-4" />
                    )}
                    Register New Passkey
                </Button>
            </div>
        </div>
    );
}
