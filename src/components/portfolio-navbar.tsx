"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Github,
    Linkedin,
    Calendar,
    Globe,
    Youtube,
    Instagram,
    Home,
    ExternalLink,
} from "lucide-react";
import { Icons } from "@/components/icons";

// Map known icon keys to lucide/custom components
const ICON_MAP: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    x: Icons.x,
    twitter: Icons.x,
    calendar: Calendar,
    globe: Globe,
    youtube: Youtube,
    instagram: Instagram,
    home: Home,
    externallink: ExternalLink,
};

function getIcon(iconName: string): React.ElementType {
    const key = iconName?.toLowerCase?.() ?? "";
    return ICON_MAP[key] ?? Globe;
}

type SocialLink = {
    id: string;
    name: string;
    url: string;
    iconName: string;
    navbar: boolean;
};

type NavbarItem = {
    href: string;
    label: string;
    iconName?: string;
};

interface PortfolioNavbarProps {
    socials?: SocialLink[];
    navbarItems?: NavbarItem[];
}

const dockIconClass =
    "rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors";

const tooltipContentClass =
    "rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

export function PortfolioNavbar({ socials = [], navbarItems = [] }: PortfolioNavbarProps) {
    const navSocials = socials.filter((s) => s.navbar);
    const hasNavItems = navbarItems.length > 0;
    const hasNavSocials = navSocials.length > 0;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
            <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">

                {/* Nav Items (e.g. Home link) */}
                {hasNavItems && navbarItems.map((item) => {
                    const Icon = getIcon(item.iconName ?? "home");
                    const isExternal = item.href.startsWith("http");
                    return (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <a href={item.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                                    <DockIcon className={dockIconClass}>
                                        <Icon className="size-full rounded-sm overflow-hidden object-contain" />
                                    </DockIcon>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={8} className={tooltipContentClass}>
                                <p>{item.label}</p>
                                <TooltipArrow className="fill-primary" />
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {/* Separator between nav items and socials */}
                {(hasNavItems && hasNavSocials) && (
                    <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-border" />
                )}

                {/* Social Links (only those marked navbar: true) */}
                {navSocials.map((social) => {
                    const Icon = getIcon(social.iconName);
                    const isExternal = social.url.startsWith("http");
                    return (
                        <Tooltip key={social.id}>
                            <TooltipTrigger asChild>
                                <a href={social.url} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                                    <DockIcon className={dockIconClass}>
                                        <Icon className="size-full rounded-sm overflow-hidden object-contain" />
                                    </DockIcon>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={8} className={tooltipContentClass}>
                                <p>{social.name}</p>
                                <TooltipArrow className="fill-primary" />
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {/* Separator before theme toggle */}
                {(hasNavItems || hasNavSocials) && (
                    <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-border" />
                )}

                {/* Theme Toggle — always present */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DockIcon className={dockIconClass}>
                            <ModeToggle className="size-full cursor-pointer" />
                        </DockIcon>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8} className={tooltipContentClass}>
                        <p>Theme</p>
                        <TooltipArrow className="fill-primary" />
                    </TooltipContent>
                </Tooltip>

            </Dock>
        </div>
    );
}
