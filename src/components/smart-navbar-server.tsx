import { SmartNavbarClient } from "./smart-navbar-client";
import { getResumeData } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function SmartNavbarServer() {
    // Attempt to get session
    const sessionUrlHeaders = await headers();
    const session = await auth.api.getSession({
        headers: sessionUrlHeaders
    });

    let resumeData = null;
    if (session?.user?.username) {
        resumeData = await getResumeData(session.user.username as string);
    }

    return (
        <SmartNavbarClient
            resumeData={resumeData}
            username={session?.user?.username as string | undefined}
        />
    );
}
