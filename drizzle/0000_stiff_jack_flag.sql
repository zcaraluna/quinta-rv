CREATE TYPE "public"."role" AS ENUM('ADMIN', 'STAFF');--> statement-breakpoint
CREATE TYPE "public"."slot" AS ENUM('DAY', 'NIGHT');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'MAINTENANCE');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_whatsapp" text NOT NULL,
	"booking_date" timestamp NOT NULL,
	"slot" "slot" NOT NULL,
	"is_couple_promo" text DEFAULT 'false',
	"total_price" numeric(10, 2) NOT NULL,
	"status" "status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"admin_notes" text,
	"start_date" timestamp,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'ADMIN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
