"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import BlurFade from "@/components/magicui/blur-fade";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data, loginError } = await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onSuccess: () => {
                router.push("/admin/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "An unexpected error occurred.");
            }
        }) as any;
    };

    return (
        <BlurFade delay={0.1} className="w-full max-w-md px-4">
            <Card className="w-full border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-3 pb-6 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your credentials to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Password</Label>

                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-medium transition-all group"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Log in
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </Button>
                    </form>

                </CardContent>
                <div className="flex items-center justify-center mt-5">
                    <Link href="/auth/forgot-password" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline transition-all">
                        Forgot password?
                    </Link>
                </div>

                <CardFooter className="flex flex-col border-t border-zinc-100 dark:border-zinc-800/50 pt-6 mt-2">

                    <p className="text-sm text-center text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline transition-all">
                            Create one
                        </Link>

                    </p>

                </CardFooter>

            </Card>

        </BlurFade>
    );
}
