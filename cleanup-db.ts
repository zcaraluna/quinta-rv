import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
    const { db } = await import("./src/lib/db");
    const { bookings } = await import("./src/lib/schema");

    console.log("Cleaning database...");
    try {
        await db.delete(bookings);
        console.log("All bookings deleted successfully!");
    } catch (error) {
        console.error("Database error:", error);
    }
}

run().then(() => process.exit());
