ALTER TABLE "passkey" ALTER COLUMN "counter" SET DATA TYPE integer USING counter::integer;--> statement-breakpoint
ALTER TABLE "passkey" ADD COLUMN "credential_id" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "passkey" ADD COLUMN "aaguid" text;