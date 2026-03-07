import { Shield, User, TriangleAlert } from "lucide-react";
import { PasskeySection } from "./passkey-section";
import { ProfileSection } from "./profile-section";
import { PasswordSection } from "./password-section";
import { SessionsSection } from "./sessions-section";
import { DeleteAccountSection } from "./delete-account-section";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "Account | ATS Scorer",
};

export default function AccountPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Separator />

            {/* Profile Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <User className="size-4" />
                    Profile
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Personal Information</CardTitle>
                        <CardDescription>
                            Your name and email address associated with your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileSection />
                    </CardContent>
                </Card>
            </section>

            {/* Security Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <Shield className="size-4" />
                    Security
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Passkeys</CardTitle>
                        <CardDescription>
                            Add a passkey to sign in without a password using Face ID, fingerprint, or Windows Hello.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasskeySection />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Password</CardTitle>
                        <CardDescription>
                            Change your account password.
                        </CardDescription>
                    </CardHeader>
                    <PasswordSection />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Active Sessions</CardTitle>
                        <CardDescription>
                            Manage devices currently signed in to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SessionsSection />
                    </CardContent>
                </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive uppercase tracking-wider">
                    <TriangleAlert className="size-4" />
                    Danger Zone
                </div>
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <DeleteAccountSection />
                    </CardContent>
                </Card>
            </section>

        </div>
    );
}
