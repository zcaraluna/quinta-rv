import { pgTable, text, timestamp, decimal, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "PENDING_PAYMENT",
    "RESERVED",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "MAINTENANCE",
]);

export const slotEnum = pgEnum("slot", [
    "DAY",
    "NIGHT",
]);

export const roleEnum = pgEnum("role", [
    "ADMIN",
    "STAFF",
]);

export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email").notNull(),
    guestWhatsapp: text("guest_whatsapp").notNull(),
    bookingDate: timestamp("booking_date").notNull(), // The selected day
    slot: slotEnum("slot").notNull(),
    isCouplePromo: text("is_couple_promo").default("false"), // Simple flag
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    status: statusEnum("status").notNull().default("PENDING_PAYMENT"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    adminNotes: text("admin_notes"),
    startDate: timestamp("start_date"), // Actual start time (calculated)
    endDate: timestamp("end_date"),     // Actual end time (calculated)
    deletedAt: timestamp("deleted_at"),
});

export const settings = pgTable("settings", {
    key: text("key").primaryKey(), // e.g., 'price_per_night'
    value: text("value").notNull(), // JSON or String
});

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: roleEnum("role").notNull().default("ADMIN"),
    requiresPasswordChange: boolean("requires_password_change").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
