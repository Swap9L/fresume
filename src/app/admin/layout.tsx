import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/auth/login");
    }

    const username = (session.user as any).username;

    return (
        <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Top Header */}
            <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="size-7 bg-zinc-900 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {/* {session.user.name?.[0]?.toUpperCase() ?? "U"} */}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{session.user.name}</p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">@{username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${username}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <ExternalLink className="size-3.5" />
                        View Portfolio
                    </Link>
                    <Link
                        href="/admin/dashboard"
                        className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Page Content */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
