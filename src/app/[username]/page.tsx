/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getResumeData } from "@/lib/actions";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import HackathonsSection from "@/components/section/hackathons-section";
import { ArrowUpRight, Mail } from "lucide-react";
import { DATA as STATIC_DATA } from "@/data/resume";
import { notFound } from "next/navigation";
import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { RefreshClient } from "@/components/refresh-client";

export const dynamic = "force-dynamic";

const BLUR_FADE_DELAY = 0.04;

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const sessionUrlHeaders = await headers();
  const [resumeData, session] = await Promise.all([
    getResumeData(username),
    auth.api.getSession({ headers: sessionUrlHeaders })
  ]);

  if (!resumeData) return notFound();

  const isOwner = session?.user?.username === username;

  const DATA: any = resumeData;

  const hasWork = DATA.work?.length > 0;
  const hasEducation = DATA.education?.length > 0;
  const hasSkills = DATA.skills?.length > 0;
  const hasProjects = DATA.projects?.length > 0;
  const hasContact = DATA.contact != null;
  const hasHackathons = DATA.hackathons?.length > 0;
  const hasSummary = !!DATA.summary?.trim();

  return (
    <>
      <RefreshClient />
      <main className="min-h-dvh relative py-12 pt-24 pb-24 px-6">
        {isOwner && (
          <div className="absolute top-4 right-4 z-50">
            <Link
              href="/admin/dashboard"
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              Dashboard
            </Link>
          </div>
        )}
        <div className="max-w-2xl mx-auto w-full space-y-16">

          {/* ── Hero (always shown) ── */}
          <section id="hero">
            <div className="mx-auto w-full max-w-2xl space-y-8">
              <div className="gap-2 flex justify-between">
                <div className="flex-col flex flex-1 space-y-1.5">
                  <BlurFadeText
                    delay={BLUR_FADE_DELAY}
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    yOffset={8}
                    text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
                  />
                  <BlurFadeText
                    className="max-w-[600px] md:text-xl text-muted-foreground"
                    delay={BLUR_FADE_DELAY * 2}
                    text={DATA.description}
                  />
                  {DATA.contact?.email && (
                    <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
                      <Link
                        href={`mailto:${DATA.contact.email}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline transition-all mt-2"
                      >
                        <Mail className="size-4" />
                        {DATA.contact.email}
                      </Link>
                    </BlurFade>
                  )}
                </div>
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <Avatar className="size-32 sm:size-36 border flex-shrink-0">
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                    <AvatarFallback>{DATA.initials}</AvatarFallback>
                  </Avatar>
                </BlurFade>
              </div>
            </div>
          </section>

          {/* ── About ── */}
          {hasSummary && (
            <section id="about">
              <div className="flex min-h-0 flex-col gap-y-4">
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                  <h2 className="text-xl font-bold">About</h2>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                  <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                    <Markdown>{DATA.summary}</Markdown>
                  </div>
                </BlurFade>
              </div>
            </section>
          )}

          {/* ── Work ── */}
          {hasWork && (
            <section id="work">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                  <h2 className="text-xl font-bold">Work Experience</h2>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 6}>
                  <WorkSection work={DATA.work} />
                </BlurFade>
              </div>
            </section>
          )}

          {/* ── Education ── */}
          {hasEducation && (
            <section id="education">
              <div className="flex min-h-0 flex-col gap-y-6">
                <BlurFade delay={BLUR_FADE_DELAY * 7}>
                  <h2 className="text-xl font-bold">Education</h2>
                </BlurFade>
                <div className="flex flex-col gap-8">
                  {DATA.education.map((education: any, index: number) => (
                    <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + index * 0.05}>
                      <Link
                        href={education.href || "#"}
                        target={education.href ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-x-3 justify-between group"
                      >
                        <div className="flex items-center gap-x-3 flex-1 min-w-0">
                          {education.logoUrl ? (
                            <img
                              src={education.logoUrl}
                              alt={education.school}
                              className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                            />
                          ) : (
                            <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                          )}
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <div className="font-semibold leading-none flex items-center gap-2">
                              {education.school}
                              {education.href && (
                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                              )}
                            </div>
                            <div className="font-sans text-sm text-muted-foreground">
                              {education.degree}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                          <span>{education.start} - {education.end}</span>
                        </div>
                      </Link>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Skills ── */}
          {hasSkills && (
            <section id="skills">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={BLUR_FADE_DELAY * 9}>
                  <h2 className="text-xl font-bold">Skills</h2>
                </BlurFade>
                <div className="flex flex-wrap gap-1">
                  {DATA.skills.map((skill: string, id: number) => (
                    <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                      <Badge>{skill}</Badge>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Projects ── */}
          {hasProjects && (
            <section id="projects">
              <BlurFade delay={BLUR_FADE_DELAY * 11}>
                <ProjectsSection projects={DATA.projects} />
              </BlurFade>
            </section>
          )}

          {/* ── Contact ── */}
          {hasContact && (
            <section id="contact">
              <BlurFade delay={BLUR_FADE_DELAY * 16}>
                <ContactSection contact={DATA.contact} />
              </BlurFade>
            </section>
          )}

          {/* ── Hackathons ── */}
          {hasHackathons && (
            <section id="hackathons">
              <BlurFade delay={BLUR_FADE_DELAY * 17}>
                <HackathonsSection hackathons={DATA.hackathons} />
              </BlurFade>
            </section>
          )}

        </div>
      </main>

      {(() => {
        let navbarItems = [...(DATA.navbar ?? [])];
        const hasHomeNode = navbarItems.some((item: any) => item.href === "/");
        if (!hasHomeNode) {
          navbarItems.unshift({ href: "/", label: "Home", iconName: "home" });
        }

        return (
          <PortfolioNavbar
            socials={DATA.contact?.socials ?? []}
            navbarItems={navbarItems}
          />
        );
      })()}

    </>
  );
}
