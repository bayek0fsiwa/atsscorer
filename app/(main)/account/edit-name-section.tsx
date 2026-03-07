"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderPinwheel, Pencil, X, Check } from "lucide-react";

export function EditNameSection() {
    const { data: session, isPending, refetch } = authClient.useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (isPending || !session) return null;

    const handleEdit = () => {
        setName(session.user.name);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName("");
    };

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed) {
            toast.error("Name cannot be empty.");
            return;
        }
        if (trimmed === session.user.name) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await authClient.updateUser({ name: trimmed });
            if (error) {
                toast.error(error.message ?? "Failed to update name.");
                return;
            }
            toast.success("Name updated successfully.");
            refetch();
            setIsEditing(false);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-1.5">
            <Label htmlFor="display-name">Full Name</Label>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <Input
                        id="display-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        autoFocus
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSave}
                        disabled={isLoading}
                        aria-label="Save name"
                    >
                        {isLoading ? (
                            <LoaderPinwheel className="size-4 animate-spin" />
                        ) : (
                            <Check className="size-4 text-green-600" />
                        )}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isLoading}
                        aria-label="Cancel"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={handleEdit}
                        aria-label="Edit name"
                    >
                        <Pencil className="size-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
