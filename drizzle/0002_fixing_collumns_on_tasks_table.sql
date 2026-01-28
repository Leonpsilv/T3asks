ALTER TABLE "tasks" RENAME COLUMN "priorirty" TO "priority";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "started_at" timestamp;