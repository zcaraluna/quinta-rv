"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        console.log("Authenticating user action for:", username);

        await signIn("credentials", {
            username,
            password,
            redirectTo: "/admin",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            console.error("Auth Error Type in Action:", error.type);
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciales inválidas.";
                default:
                    return "Error de autenticación: " + error.type;
            }
        }

        // Next.js internal redirect error - MUST rethrow
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
            console.log("Redirecting to admin...");
            throw error;
        }

        console.error("Non-Auth Error in Action:", error);
        throw error;
    }
}

export async function createAdminUser() {
    const [existing] = await db.select().from(users).where(eq(users.username, "admin"));
    if (existing) return { message: "Admin user already exists." };

    await db.insert(users).values({
        username: "admin",
        password: "password123",
        role: "ADMIN"
    });
    return { message: "Admin user created successfully." };
}
