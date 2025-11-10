CREATE TABLE "linkedin_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedin_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"expires_in" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "linkedin_token" ADD CONSTRAINT "linkedin_token_linkedin_user_id_user_id_fk" FOREIGN KEY ("linkedin_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;