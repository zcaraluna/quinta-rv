import "dotenv/config";
import { db } from "./src/lib/db";
import { users } from "./src/lib/schema";

async function seed() {
    console.log("Seeding initial admin user...");
    try {
        await db.insert(users).values({
            username: "admin",
            password: "password123", // In a real app, hash this with bcrypt before inserting
            role: "ADMIN",
        });
        console.log("Admin user created successfully!");
    } catch (error) {
        console.error("Error seeding user (maybe already exists?):", error);
    }
}

seed().then(() => process.exit());
