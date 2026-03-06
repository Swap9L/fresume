"use client";

import { usePathname } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PortfolioNavbar } from "@/components/portfolio-navbar";

const KNOWN_NON_USERNAME_SEGMENTS = new Set(["admin", "auth", "api", "_next"]);

export function SmartNavbarClient({
    resumeData,
    username,
}: {
    resumeData: any;
    username?: string;
}) {
    const pathname = usePathname();

    // Detect /{username} routes: single path segment, not a known reserved word
    const segments = pathname.split("/").filter(Boolean);
    const isPortfolioPage =
        segments.length === 1 &&
        !KNOWN_NON_USERNAME_SEGMENTS.has(segments[0]);

    // Portfolio pages manage their own dock via <PortfolioNavbar>
    if (isPortfolioPage) return null;



    // Everything else (admin, landing, etc.) 
    // If the user is logged in and has resume data, show full dock with Resume button
    if (resumeData && username) {
        let socials = resumeData.contact?.socials ?? [];
        const baseNavItems = resumeData.navbar ?? [];

        // Ensure Home and Resume buttons exist
        let navbarItems = [...baseNavItems];

        const hasHomeNode = navbarItems.some((item: any) => item.href === "/");
        const hasResumeNode = navbarItems.some((item: any) => item.href === `/${username}`);

        // If Home is missing, insert it at the beginning
        if (!hasHomeNode) {
            navbarItems.unshift({ href: "/", label: "Home", iconName: "home" });
        }

        // Add "Resume" button next to Home if it doesn't already exist
        if (!hasResumeNode) {
            const homeIndex = navbarItems.findIndex((i: any) => i.href === "/");
            const resumeItem = { href: `/${username}`, label: "Resume", iconName: "notebook" };
            if (homeIndex >= 0) {
                navbarItems.splice(homeIndex + 1, 0, resumeItem);
            } else {
                navbarItems.push(resumeItem);
            }
        }

        // Specific constraint for the root landing page (home page)
        // User requested: "at home page only home resume and theme change btn should be there"
        if (pathname === "/") {
            socials = [];
            navbarItems = navbarItems.filter(item => item.href === "/" || item.href === `/${username}`);
        }

        return <PortfolioNavbar socials={socials} navbarItems={navbarItems} />;
    }

    if (pathname.startsWith("/auth")) {
        return <PortfolioNavbar navbarItems={[{ href: "/", label: "Home", iconName: "home" }]} />;
    }

    return <NavbarThemeOnly />;
}

function NavbarThemeOnly() {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
            <Dock className="z-50 pointer-events-auto relative h-12 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                            <ModeToggle className="size-full cursor-pointer" />
                        </DockIcon>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm">
                        <p>Toggle Theme</p>
                        <TooltipArrow className="fill-primary" />
                    </TooltipContent>
                </Tooltip>
            </Dock>
        </div>
    );
}
