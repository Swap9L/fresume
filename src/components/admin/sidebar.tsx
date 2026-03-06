"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User as UserIcon,
    Briefcase,
    GraduationCap,
    Code2,
    MessageSquare,
    LogOut,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/profile", label: "Profile", icon: UserIcon },
    { href: "/admin/skills", label: "Skills", icon: Code2 },
    { href: "/admin/education", label: "Education", icon: GraduationCap },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
];

export function Sidebar({ username }: { username: string }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/auth/login";
                }
            }
        });
    };

    return (
        <aside className="w-64 border-r bg-muted/30 hidden md:flex flex-col">
            <div className="p-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <div className="size-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                        SD
                    </div>
                    Portfolio
                </Link>
            </div>
            <Separator />
            <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                            pathname === link.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <link.icon className="size-4" />
                        {link.label}
                    </Link>
                ))}
            </nav>
            <Separator />
            <div className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                    <Link href={`/${username}`} target="_blank">
                        <ExternalLink className="size-4" />
                        View Site
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="size-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
