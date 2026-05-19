CREATE TYPE "public"."cms_content_block_status" AS ENUM('published');--> statement-breakpoint
CREATE TYPE "public"."cms_content_revision_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."cms_content_change_type" AS ENUM('create', 'update', 'publish', 'rollback');--> statement-breakpoint

CREATE TABLE "cms_content_blocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "page" text NOT NULL,
  "type" text DEFAULT 'text' NOT NULL,
  "value" jsonb NOT NULL,
  "status" "cms_content_block_status" DEFAULT 'published' NOT NULL,
  "updated_by" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "cms_content_blocks_key_unique" UNIQUE("key")
);--> statement-breakpoint

CREATE TABLE "cms_content_revisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content_block_id" uuid NOT NULL,
  "version_number" integer NOT NULL,
  "previous_value" jsonb NOT NULL,
  "new_value" jsonb NOT NULL,
  "change_type" "cms_content_change_type" NOT NULL,
  "status" "cms_content_revision_status" DEFAULT 'draft' NOT NULL,
  "save_batch_id" uuid,
  "change_summary" text,
  "created_by" text,
  "is_protected" boolean DEFAULT false NOT NULL,
  "published_at" timestamp with time zone,
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "cms_content_revisions_content_block_id_version_number_unique" UNIQUE("content_block_id","version_number")
);--> statement-breakpoint

ALTER TABLE "cms_content_revisions" ADD CONSTRAINT "cms_content_revisions_content_block_id_cms_content_blocks_id_fk" FOREIGN KEY ("content_block_id") REFERENCES "public"."cms_content_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

CREATE INDEX "cms_content_blocks_page_idx" ON "cms_content_blocks" USING btree ("page");--> statement-breakpoint
CREATE INDEX "cms_content_revisions_block_version_idx" ON "cms_content_revisions" USING btree ("content_block_id","version_number");--> statement-breakpoint
CREATE INDEX "cms_content_revisions_block_status_created_idx" ON "cms_content_revisions" USING btree ("content_block_id","status","created_at");--> statement-breakpoint
CREATE INDEX "cms_content_revisions_save_batch_idx" ON "cms_content_revisions" USING btree ("save_batch_id","created_at");--> statement-breakpoint
CREATE INDEX "cms_content_revisions_status_expires_idx" ON "cms_content_revisions" USING btree ("status","expires_at");
