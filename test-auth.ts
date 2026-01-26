import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testAuth() {
    const { db } = await import("./src/lib/db");
    const { users } = await import("./src/lib/schema");
    const { eq } = await import("drizzle-orm");
    const { z } = await import("zod");

    const username = "admin";
    const password = "password123";

    console.log("Testing auth for:", username);

    try {
        const [user] = await db.select().from(users).where(eq(users.username, username));

        if (!user) {
            console.log("FAILED: User not found in DB");
            return;
        }

        console.log("User found in DB:", !!user);
        console.log("Stored password:", user.password);
        console.log("Attempted password:", password);

        const matches = password === user.password;
        console.log("Matches:", matches);

        const schema = z.object({ username: z.string(), password: z.string().min(6) });
        const parsed = schema.safeParse({ username, password });
        console.log("Zod validation:", parsed.success);

    } catch (error) {
        console.error("Test error:", error);
    }
}

testAuth().then(() => process.exit());
