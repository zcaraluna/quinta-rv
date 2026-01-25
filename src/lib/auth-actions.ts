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
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciales inválidas.";
                default:
                    return "Algo salió mal.";
            }
        }
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
