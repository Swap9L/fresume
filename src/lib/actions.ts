"use server";

import prisma from "@/lib/prisma";
import { DATA } from "@/data/resume";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getResumeData(username?: string) {
    if (username) {
        return await prisma.resumeData.findFirst({
            where: {
                user: {
                    username: username
                }
            },
            include: {
                education: true,
                projects: {
                    include: {
                        links: true
                    }
                },
                work: true,
                hackathons: {
                    include: {
                        links: true
                    }
                },
                contact: {
                    include: {
                        socials: true
                    }
                },
                navbar: true
            }
        });
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return null;

    return await prisma.resumeData.findUnique({
        where: {
            userId: session.user.id
        },
        include: {
            education: true,
            projects: {
                include: {
                    links: true
                }
            },
            work: true,
            hackathons: {
                include: {
                    links: true
                }
            },
            contact: {
                include: {
                    socials: true
                }
            },
            navbar: true
        }
    });
}

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function updateProfile(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const { education, projects, contact, navbar, work, hackathons, ...profileData } = data; // Prevent nested relations from being sent to Prisma
    await prisma.resumeData.update({
        where: { userId: session.user.id },
        data: {
            ...profileData
        }
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/profile");
}

export async function addSkill(skill: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id },
        select: { skills: true }
    });
    if (!resume) return;

    await prisma.resumeData.update({
        where: { userId: session.user.id },
        data: {
            skills: [...resume.skills, skill]
        }
    });
    revalidatePath("/", "layout");

}

export async function removeSkill(skill: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id },
        select: { skills: true }
    });
    if (!resume) return;

    await prisma.resumeData.update({
        where: { userId: session.user.id },
        data: {
            skills: resume.skills.filter((s: string) => s !== skill)
        }
    });
    revalidatePath("/", "layout");

}

// Education Actions
export async function addEducation(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id }
    });
    if (!resume) return;

    await prisma.education.create({
        data: {
            ...data,
            resumeDataId: resume.id,
        }
    });
    revalidatePath("/", "layout");
}

export async function deleteEducation(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Ensure it belongs to the user's resume
    const education = await prisma.education.findFirst({
        where: {
            id,
            resumeData: { userId: session.user.id }
        }
    });
    if (!education) throw new Error("Access denied");

    await prisma.education.delete({
        where: { id }
    });
    revalidatePath("/", "layout");
}

// Project Actions
export async function addProject(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id }
    });
    if (!resume) return;

    const { links, ...projectData } = data;
    await prisma.project.create({
        data: {
            ...projectData,
            resumeDataId: resume.id,
            links: {
                create: (links || []).map((link: any) => ({
                    type: link.type,
                    href: link.href,
                    iconName: link.iconName || "globe",
                }))
            }
        }
    });
    revalidatePath("/", "layout");
}

export async function deleteProject(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const project = await prisma.project.findFirst({
        where: {
            id,
            resumeData: { userId: session.user.id }
        }
    });
    if (!project) throw new Error("Access denied");

    await prisma.project.delete({
        where: { id }
    });
    revalidatePath("/", "layout");
}

// Work Actions
export async function addWork(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id }
    });
    if (!resume) return;

    await prisma.workExperience.create({
        data: {
            ...data,
            resumeDataId: resume.id,
        }
    });
    revalidatePath("/", "layout");
}

export async function deleteWork(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const work = await prisma.workExperience.findFirst({
        where: {
            id,
            resumeData: { userId: session.user.id }
        }
    });
    if (!work) throw new Error("Access denied");

    await prisma.workExperience.delete({
        where: { id }
    });
    revalidatePath("/", "layout");
}

// Hackathon Actions
export async function addHackathon(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id }
    });
    if (!resume) return;

    const { links, ...hackathonData } = data;
    await prisma.hackathon.create({
        data: {
            ...hackathonData,
            resumeDataId: resume.id,
            links: {
                create: (links || []).map((link: any) => ({
                    title: link.title,
                    href: link.href,
                    iconName: link.iconName || "globe",
                }))
            }
        }
    });
    revalidatePath("/", "layout");
}

export async function deleteHackathon(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const hackathon = await prisma.hackathon.findFirst({
        where: {
            id,
            resumeData: { userId: session.user.id }
        }
    });
    if (!hackathon) throw new Error("Access denied");

    await prisma.hackathon.delete({
        where: { id }
    });
    revalidatePath("/", "layout");
}

// Contact Actions
export async function upsertContact(data: { email: string; tel: string }) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id }
    });
    if (!resume) return;

    await prisma.contact.upsert({
        where: { resumeDataId: resume.id },
        create: { email: data.email, tel: data.tel, resumeDataId: resume.id },
        update: { email: data.email, tel: data.tel },
    });
    revalidatePath("/", "layout");
}

export async function addSocial(social: { name: string; url: string; iconName: string; navbar: boolean }) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const resume = await prisma.resumeData.findUnique({
        where: { userId: session.user.id },
        include: { contact: true }
    });
    if (!resume) return;

    let contact = resume.contact;
    if (!contact) {
        contact = await prisma.contact.create({
            data: { email: "", tel: "", resumeDataId: resume.id }
        });
    }

    await prisma.social.create({
        data: { ...social, contactId: contact.id }
    });
    revalidatePath("/", "layout");
}

export async function deleteSocial(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const social = await prisma.social.findUnique({
        where: { id },
        include: { contact: { include: { resumeData: true } } }
    });

    if (!social || social.contact.resumeData.userId !== session.user.id) {
        throw new Error("Access denied");
    }

    await prisma.social.delete({ where: { id } });
    revalidatePath("/", "layout");
}

export async function updateSocial(id: string, socialData: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const existing = await prisma.social.findFirst({
        where: { id, contact: { resumeData: { userId: session.user.id } } }
    });
    if (!existing) throw new Error("Access denied");

    await prisma.social.update({
        where: { id },
        data: {
            name: socialData.name,
            url: socialData.url,
            iconName: socialData.iconName,
            navbar: socialData.navbar
        }
    });
    revalidatePath("/", "layout");
}


export async function syncData() {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized" };

    console.log("Seeding data from server action...");

    try {
        const resumeData = await prisma.resumeData.upsert({
            where: { userId: session.user.id },
            update: {
                name: DATA.name,
                initials: DATA.initials,
                url: DATA.url,
                location: DATA.location,
                locationLink: DATA.locationLink,
                description: DATA.description,
                summary: DATA.summary,
                avatarUrl: DATA.avatarUrl,
                skills: [...DATA.skills],
                education: {
                    deleteMany: {}, // Clear existing education
                    create: DATA.education.map((edu: any) => ({
                        school: edu.school,
                        href: edu.href,
                        degree: edu.degree,
                        logoUrl: edu.logoUrl,
                        start: edu.start,
                        end: edu.end,
                    }))
                },
                projects: {
                    deleteMany: {}, // Clear existing projects
                    create: DATA.projects.map((project: any) => ({
                        title: project.title,
                        href: project.href,
                        dates: project.dates,
                        active: project.active,
                        description: project.description,
                        technologies: [...project.technologies],
                        image: project.image,
                        video: project.video,
                        links: {
                            create: project.links.map((link: any) => ({
                                type: link.type,
                                href: link.href,
                                iconName: "globe",
                            }))
                        }
                    }))
                },
                work: {
                    deleteMany: {}, // Clear existing work
                    create: ((DATA as any).work || []).map((w: any) => ({
                        company: w.company,
                        href: w.href,
                        badges: [...w.badges],
                        location: w.location,
                        title: w.title,
                        logoUrl: w.logoUrl,
                        start: w.start,
                        end: w.end,
                        description: w.description,
                    }))
                },
                hackathons: {
                    deleteMany: {}, // Clear existing hackathons
                    create: ((DATA as any).hackathons || []).map((h: any) => ({
                        title: h.title,
                        dates: h.dates,
                        location: h.location,
                        description: h.description,
                        image: h.image || "",
                        links: {
                            create: (h.links || []).map((l: any) => ({
                                title: l.title,
                                href: l.href,
                                iconName: "globe",
                            }))
                        }
                    }))
                },
                contact: {
                    upsert: {
                        create: {
                            email: DATA.contact.email,
                            tel: DATA.contact.tel,
                            socials: {
                                create: Object.entries(DATA.contact.social).map(([name, social]: [string, any]) => ({
                                    name: social.name,
                                    url: social.url,
                                    iconName: name.toLowerCase(),
                                    navbar: social.navbar,
                                }))
                            }
                        },
                        update: {
                            email: DATA.contact.email,
                            tel: DATA.contact.tel,
                            socials: {
                                deleteMany: {}, // Clear existing socials
                                create: Object.entries(DATA.contact.social).map(([name, social]: [string, any]) => ({
                                    name: social.name,
                                    url: social.url,
                                    iconName: name.toLowerCase(),
                                    navbar: social.navbar,
                                }))
                            }
                        }
                    }
                },
                navbar: {
                    deleteMany: {}, // Clear existing navbar items
                    create: DATA.navbar.map((nav: any) => ({
                        href: nav.href,
                        label: nav.label,
                        iconName: "home",
                    }))
                }
            },
            create: {
                userId: session.user.id,
                name: DATA.name,
                initials: DATA.initials,
                url: DATA.url,
                location: DATA.location,
                locationLink: DATA.locationLink,
                description: DATA.description,
                summary: DATA.summary,
                avatarUrl: DATA.avatarUrl,
                skills: [...DATA.skills],
                education: {
                    create: DATA.education.map((edu: any) => ({
                        school: edu.school,
                        href: edu.href,
                        degree: edu.degree,
                        logoUrl: edu.logoUrl,
                        start: edu.start,
                        end: edu.end,
                    }))
                },
                projects: {
                    create: DATA.projects.map((project: any) => ({
                        title: project.title,
                        href: project.href,
                        dates: project.dates,
                        active: project.active,
                        description: project.description,
                        technologies: [...project.technologies],
                        image: project.image,
                        video: project.video,
                        links: {
                            create: project.links.map((link: any) => ({
                                type: link.type,
                                href: link.href,
                                iconName: "globe",
                            }))
                        }
                    }))
                },
                work: {
                    create: ((DATA as any).work || []).map((w: any) => ({
                        company: w.company,
                        href: w.href,
                        badges: [...w.badges],
                        location: w.location,
                        title: w.title,
                        logoUrl: w.logoUrl,
                        start: w.start,
                        end: w.end,
                        description: w.description,
                    }))
                },
                hackathons: {
                    create: ((DATA as any).hackathons || []).map((h: any) => ({
                        title: h.title,
                        dates: h.dates,
                        location: h.location,
                        description: h.description,
                        image: h.image || "",
                        links: {
                            create: (h.links || []).map((l: any) => ({
                                title: l.title,
                                href: l.href,
                                iconName: "globe",
                            }))
                        }
                    }))
                },
                contact: {
                    create: {
                        email: DATA.contact.email,
                        tel: DATA.contact.tel,
                        socials: {
                            create: Object.entries(DATA.contact.social).map(([name, social]: [string, any]) => ({
                                name: social.name,
                                url: social.url,
                                iconName: name.toLowerCase(),
                                navbar: social.navbar,
                            }))
                        }
                    }
                },
                navbar: {
                    create: DATA.navbar.map((nav: any) => ({
                        href: nav.href,
                        label: nav.label,
                        iconName: "home",
                    }))
                }
            }
        });

        revalidatePath("/", "layout");
        return { success: true, message: "Data synced successfully!", id: resumeData.id };
    } catch (error: any) {
        console.error("Sync error:", error);
        return { success: false, message: error.message };
    }
}

export async function deleteAccount(password: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) throw new Error("User not found");

    // If user has a password, verify it
    if (user.password) {
        const result = await auth.api.verifyPassword({
            body: {
                password,
            },
            headers: await headers()
        });

        if (!result.status) {
            return { success: false, message: "Incorrect password" };
        }
    }

    // Delete user (Prisma handles cascading deletes)
    await prisma.user.delete({
        where: { id: session.user.id }
    });

    // Sessions will be cleaned up by cascade delete in DB
    redirect("/auth/login");
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    try {
        const result = await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true
            },
            headers: await headers()
        });

        return { success: true, message: "Password updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update password" };
    }
}

export async function checkUsername(username: string) {
    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, '-');
    const existing = await prisma.user.findFirst({
        where: { username: cleanUsername }
    });

    if (!existing) {
        return { available: true };
    }

    // Generate 3 suggestions
    const suggestions: string[] = [];
    let attempts = 0;
    while (suggestions.length < 3 && attempts < 15) {
        const randomNum = Math.floor(Math.random() * 999) + 1;
        const suggestion = `${cleanUsername}${randomNum}`;
        const check = await prisma.user.findFirst({
            where: { username: suggestion }
        });
        if (!check && !suggestions.includes(suggestion)) {
            suggestions.push(suggestion);
        }
        attempts++;
    }

    return { available: false, suggestions };
}
