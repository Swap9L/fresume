import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
            }
        }
    }
})
