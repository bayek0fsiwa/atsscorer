import { Shield, User, Bell } from "lucide-react";
import { PasskeySection } from "./passkey-section";
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
                    <CardContent className="text-sm text-muted-foreground">
                        Coming soon.
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
                    <CardContent className="text-sm text-muted-foreground">
                        Coming soon.
                    </CardContent>
                </Card>
            </section>

            {/* Notifications Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <Bell className="size-4" />
                    Notifications
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Email Notifications</CardTitle>
                        <CardDescription>
                            Choose what updates you want to receive by email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Coming soon.
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
