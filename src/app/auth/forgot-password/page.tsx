"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleForgotPassword = async () => {
        setLoading(true);
        // Using forgetPassword which usually sends an email via a plugin
        const { data, error } = await (authClient as any).forgetPassword({
            email,
            redirectTo: "/auth/reset-password",
        }, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onSuccess: () => {
                setSuccess(true);
            },
            onError: (ctx: any) => { // Modified onError callback
                setError(ctx.error.message);
            }
        });
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a password reset link to <strong>{email}</strong>.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" asChild>
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleForgotPassword} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
