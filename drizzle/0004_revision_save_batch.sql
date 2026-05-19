ALTER TABLE "cms_content_revisions" ADD COLUMN "save_batch_id" uuid;--> statement-breakpoint
CREATE INDEX "cms_content_revisions_save_batch_idx" ON "cms_content_revisions" USING btree ("save_batch_id","created_at");
