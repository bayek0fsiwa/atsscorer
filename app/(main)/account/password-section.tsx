"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderPinwheel } from "lucide-react";

export function PasswordSection() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                toast.error(error.message ?? "Failed to change password.");
                return;
            }

            toast.success("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter a new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <LoaderPinwheel className="size-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
        </form>
    );
}
