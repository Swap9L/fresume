import { PrismaClient } from "@prisma/client";
import { DATA } from "./src/data/resume";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding data...");

    const user = await prisma.user.create({
        data: {
            username: "admin-seed",
            email: "admin@example.com",
            name: DATA.name,
        }
    });

    const resumeData = await prisma.resumeData.create({
        data: {
            userId: user.id,
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

    console.log("Seeded successfully:", resumeData.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
