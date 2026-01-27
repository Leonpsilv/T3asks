ALTER TABLE "tasks" ADD COLUMN "resolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "deadline" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "priorirty" varchar(24);--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "category" varchar(48);