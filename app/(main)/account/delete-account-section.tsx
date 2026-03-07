"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LoaderPinwheel, Trash2 } from "lucide-react";

export function DeleteAccountSection() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [password, setPassword] = useState("");

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent dialog from closing automatically
        if (!password) {
            toast.error("Please enter your password to confirm.");
            return;
        }

        setIsDeleting(true);
        try {
            const { error } = await authClient.deleteUser({
                password,
                callbackURL: "/auth/signup",
            });
            if (error) {
                toast.error(error.message ?? "Failed to delete account. Please check your password.");
                return;
            }
            setIsOpen(false);
            router.push("/");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
            </div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="shrink-0">
                        <Trash2 className="size-4" />
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your account and remove all your data
                            from our servers. This action <strong>cannot be undone</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-2 py-4">
                        <Label htmlFor="delete-password">Confirm Password</Label>
                        <Input
                            id="delete-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isDeleting}
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} onClick={() => setPassword("")}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <LoaderPinwheel className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
