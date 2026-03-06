"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { checkUsername } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, Check, X, Sparkles } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { motion, AnimatePresence } from "motion/react";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const router = useRouter();

    const handleCheckUsername = async (val: string) => {
        if (!val) {
            setUsernameAvailable(null);
            setSuggestions([]);
            return;
        }
        setCheckingUsername(true);
        const res = await checkUsername(val);
        setUsernameAvailable(res.available);
        if (!res.available && res.suggestions) {
            setSuggestions(res.suggestions);
        } else {
            setSuggestions([]);
        }
        setCheckingUsername(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username) return setError("Username is required");
        if (password !== retypePassword) return setError("Passwords do not match");
        if (usernameAvailable === false) return setError("Username is already taken");

        setLoading(true);
        const { data, signUpError } = await authClient.signUp.email({
            email,
            password,
            name,
            username: username.toLowerCase().trim().replace(/\s+/g, '-'),
        } as any, {
            onRequest: () => setLoading(true),
            onResponse: () => setLoading(false),
            onSuccess: () => {
                router.push("/auth/login");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "An error occurred during sign up.");
            }
        }) as any;
    };

    return (
        <BlurFade delay={0.1} className="w-full max-w-md px-4">
            <Card className="w-full border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-3 pb-6 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your details to register for the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Name</Label>
                            <Input
                                id="name"
                                placeholder="Swapnil Dahotre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Username</Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    placeholder="swapnil-dahotre"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setUsernameAvailable(null);
                                    }}
                                    onBlur={(e) => handleCheckUsername(e.target.value)}
                                    className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm pr-10"
                                    required
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                    {checkingUsername && <Loader2 className="size-4 animate-spin text-zinc-400" />}
                                    {!checkingUsername && usernameAvailable === true && <Check className="size-4 text-green-500" />}
                                    {!checkingUsername && usernameAvailable === false && <X className="size-4 text-red-500" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {usernameAvailable === false && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 mt-2"
                                    >
                                        <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                                            <Sparkles className="size-3 text-amber-500" /> Username taken. Try these:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => {
                                                        setUsername(s);
                                                        handleCheckUsername(s);
                                                    }}
                                                    className="px-2 py-1 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="retypePassword" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Retype</Label>
                                <Input
                                    id="retypePassword"
                                    type="password"
                                    value={retypePassword}
                                    onChange={(e) => setRetypePassword(e.target.value)}
                                    className="h-11 bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all text-sm"
                                    required
                                />
                            </div>
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
                            className="w-full h-11 mt-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-medium transition-all group"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Sign Up
                                    <UserPlus className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-all" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col border-t border-zinc-100 dark:border-zinc-800/50 pt-6 mt-2">
                    <p className="text-sm text-center text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline transition-all">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </BlurFade>
    );
}
