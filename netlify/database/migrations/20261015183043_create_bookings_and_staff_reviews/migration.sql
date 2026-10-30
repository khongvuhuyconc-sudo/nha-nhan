CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY,
	"reference" text NOT NULL UNIQUE,
	"service" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"hours" integer NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"phone_key" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"preferred_staff" text,
	"subtotal" integer NOT NULL,
	"discount_percent" integer DEFAULT 0 NOT NULL,
	"voucher_code" text,
	"price" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_reviews" (
	"id" serial PRIMARY KEY,
	"staff_slug" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"reviewer_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bookings_phone_key_idx" ON "bookings" ("phone_key");--> statement-breakpoint
CREATE INDEX "staff_reviews_staff_slug_idx" ON "staff_reviews" ("staff_slug");