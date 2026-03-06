"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (!token) {
            alert("Invalid or missing token");
            return;
        }

        setLoading(true);
        const { data, error } = await (authClient as any).resetPassword({
            newPassword: password,
            token: token,
        }, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onSuccess: () => {
                alert("Password reset successfully");
                router.push("/auth/login");
            },
            onError: (ctx: any) => { // Modified onError callback
                setError(ctx.error.message);
            }
        });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
