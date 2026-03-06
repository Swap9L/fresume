import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { SmartNavbarServer } from "@/components/smart-navbar-server";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessionUrlHeaders = await headers();
    const session = await auth.api.getSession({
        headers: sessionUrlHeaders
    });

    if (session) {
        redirect("/admin/dashboard");
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-[300px] z-0 pointer-events-none fade-out-bottom">
                    <FlickeringGrid
                        className="w-full h-full opacity-50 dark:opacity-20"
                        squareSize={4}
                        gridGap={6}
                        color="#888888"
                        maxOpacity={0.15}
                        flickerChance={0.05}
                    />
                </div>
                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-10">
                    {children}
                </div>
                <SmartNavbarServer />
            </div>
        </ThemeProvider>
    );
}
