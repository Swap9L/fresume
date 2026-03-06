/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Globe, Github, Youtube, ExternalLink, Twitter, Linkedin, Mail, Smartphone, Code, Terminal, Layers, Database, Layout, Palette, Zap, Cpu, Server, Shield, Lock, Search, Settings, Share2, MessageSquare, Heart, Star, BookOpen, Coffee, Rocket, Target, Award, Briefcase, GraduationCap, Calendar, MapPin, Eye, MousePointer2, Component, Package, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
  phone: Smartphone,
  code: Code,
  terminal: Terminal,
  layers: Layers,
  database: Database,
  layout: Layout,
  palette: Palette,
  zap: Zap,
  cpu: Cpu,
  server: Server,
  shield: Shield,
  lock: Lock,
  search: Search,
  settings: Settings,
  share: Share2,
  message: MessageSquare,
  heart: Heart,
  star: Star,
  book: BookOpen,
  coffee: Coffee,
  rocket: Rocket,
  target: Target,
  award: Award,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  calendar: Calendar,
  mapPin: MapPin,
  eye: Eye,
  mouse: MousePointer2,
  component: Component,
  package: Package,
  external: ExternalLink,
};

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon?: React.ReactNode;
    iconName?: string;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 cursor-pointer hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-48 object-cover"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <div className="w-full h-48 bg-muted" />
          )}
        </Link>
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((link, idx) => {
              const IconComponent = link.iconName ? ICON_MAP[link.iconName.toLowerCase()] || Globe : null;
              return (
                <Link
                  href={link.href}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    className="flex items-center gap-1.5 text-[10px] bg-black text-white hover:bg-black/90 py-0.5"
                    variant="default"
                  >
                    {link.icon || (IconComponent && <IconComponent className="size-3" />)}
                    {link.type}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
