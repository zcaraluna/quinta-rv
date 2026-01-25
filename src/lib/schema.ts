import { pgTable, text, timestamp, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "MAINTENANCE",
]);

export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email").notNull(),
    guestWhatsapp: text("guest_whatsapp").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    status: statusEnum("status").notNull().default("PENDING_PAYMENT"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"), // Calculated in logic, but good to store
    adminNotes: text("admin_notes"),
});

export const settings = pgTable("settings", {
    key: text("key").primaryKey(), // e.g., 'price_per_night'
    value: text("value").notNull(), // JSON or String
});
