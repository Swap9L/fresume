import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
                input: true,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            console.log("Reset password requested for", data.user.email, "token:", data.token);
            // In production, use Resend or another provider
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await prisma.resumeData.create({
                        data: {
                            userId: user.id,
                            name: user.name || "Anonymous",
                            initials: user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "A",
                            url: "",
                            location: "",
                            locationLink: "",
                            description: "Professional Portfolio",
                            summary: "Welcome to my portfolio.",
                            avatarUrl: user.image || "",
                            skills: [],
                            contact: {
                                create: {
                                    email: user.email || "",
                                    tel: "",
                                    socials: {
                                        create: [
                                            { name: "GitHub", url: "", iconName: "github", navbar: true },
                                            { name: "LinkedIn", url: "", iconName: "linkedin", navbar: true },
                                            { name: "X", url: "", iconName: "x", navbar: true },
                                            { name: "Calendar", url: "", iconName: "calendar", navbar: true }
                                        ]
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }
});
