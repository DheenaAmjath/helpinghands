CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` text PRIMARY KEY NOT NULL,
	`donor_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`item_type` text NOT NULL,
	`quantity` integer NOT NULL,
	`condition` text NOT NULL,
	`location` text NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `needs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`item_type` text NOT NULL,
	`quantity_required` integer NOT NULL,
	`quantity_fulfilled` integer DEFAULT 0 NOT NULL,
	`location` text NOT NULL,
	`priority` text NOT NULL,
	`deadline` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`donation_id` text NOT NULL,
	`need_id` text NOT NULL,
	`donor_id` text NOT NULL,
	`offered_quantity` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`matching_score` integer NOT NULL,
	`matching_reasons` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`verified_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'donor' NOT NULL,
	`created_at` integer NOT NULL
);
