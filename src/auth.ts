import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize attempt in callback:", credentials?.username);
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const [user] = await db.select().from(users).where(eq(users.username, username));

                    if (!user) {
                        console.log("User not found in DB");
                        return null;
                    }

                    const passwordsMatch = password === user.password;
                    console.log("Password match:", passwordsMatch);

                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials or parsing failed");
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.username = user.username as string;
                token.role = user.role as string;
                token.requiresPasswordChange = (user as any).requiresPasswordChange as boolean;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.role = token.role as string;
                (session.user as any).requiresPasswordChange = token.requiresPasswordChange as boolean;
            }
            return session;
        },
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            let requiresPasswordChange = (auth?.user as any)?.requiresPasswordChange;

            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isChangingPassword = nextUrl.pathname === "/admin/cambiar-contrasena";

            if (isOnAdmin) {
                if (!isLoggedIn) return false;

                // If the session says we need a change, double check with the DB to handle real-time updates
                if (requiresPasswordChange) {
                    const [user] = await db.select({ requiresPasswordChange: users.requiresPasswordChange })
                        .from(users)
                        .where(eq(users.id, (auth.user as any).id));
                    if (user) {
                        requiresPasswordChange = user.requiresPasswordChange;
                    }
                }

                if (requiresPasswordChange && !isChangingPassword) {
                    return Response.redirect(new URL("/admin/cambiar-contrasena", nextUrl));
                }
                return true;
            }
            return true;
        },
    },
});
