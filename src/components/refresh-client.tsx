"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RefreshClient() {
    const router = useRouter();

    useEffect(() => {
        // Check if BroadcastChannel is supported
        if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

        const channel = new BroadcastChannel("resume-sync");

        const handleMessage = (event: MessageEvent) => {
            if (event.data === "refresh") {
                console.log("🔄 Real-time update received. Refreshing data...");
                router.refresh();
            }
        };

        channel.addEventListener("message", handleMessage);

        return () => {
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, [router]);

    return null;
}
