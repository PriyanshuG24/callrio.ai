ALTER TABLE "linkedin_token" DROP CONSTRAINT "linkedin_token_linkedin_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "linkedin_token" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "linkedin_token" ADD CONSTRAINT "linkedin_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_token" ADD CONSTRAINT "linkedin_token_linkedin_user_id_unique" UNIQUE("linkedin_user_id");