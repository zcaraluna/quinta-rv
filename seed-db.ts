import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
    // Dynamically import to ensure process.env is populated first
    const { db } = await import("./src/lib/db");
    const { users } = await import("./src/lib/schema");
    const { eq } = await import("drizzle-orm");

    console.log("Checking for admin user...");
    try {
        const existing = await db.select().from(users).where(eq(users.username, "admin"));

        if (existing.length > 0) {
            console.log("Admin user already exists:", existing[0].username);
        } else {
            console.log("Admin user not found. Creating...");
            await db.insert(users).values({
                username: "admin",
                password: "password123",
                role: "ADMIN",
            });
            console.log("Admin user created successfully!");
        }
    } catch (error) {
        console.error("Database error:", error);
    }
}

run().then(() => process.exit());
