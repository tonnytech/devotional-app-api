-- Announcement: columns may already exist in production, guard against it
ALTER TABLE "Announcement" ADD COLUMN IF NOT EXISTS "isImportant" BOOLEAN;
ALTER TABLE "Announcement" ADD COLUMN IF NOT EXISTS "link" TEXT;

-- Blog: safe no-op if already nullable
ALTER TABLE "Blog" ALTER COLUMN "takeaways" DROP NOT NULL;

-- DevotionalReading: safe no-op if already nullable
ALTER TABLE "DevotionalReading"
  ALTER COLUMN "scriptureText" DROP NOT NULL,
  ALTER COLUMN "reflection" DROP NOT NULL,
  ALTER COLUMN "prayer" DROP NOT NULL;

-- Event: add new columns as nullable first
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "title" TEXT;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

-- Backfill existing rows before enforcing NOT NULL
UPDATE "Event" SET "title" = "name" WHERE "title" IS NULL;
UPDATE "Event" SET "updatedAt" = COALESCE("updatedAt", "createdAt", now()) WHERE "updatedAt" IS NULL;
UPDATE "Event" SET "slug" = lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g')) WHERE "slug" IS NULL;

-- Now safe to enforce NOT NULL and drop the old column
ALTER TABLE "Event" ALTER COLUMN "title" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Event" DROP COLUMN IF EXISTS "name";

-- Unique index, only if not already present
CREATE UNIQUE INDEX IF NOT EXISTS "Event_slug_key" ON "Event"("slug");

-- DailyReadingRef: table likely already exists, guard creation + FK
CREATE TABLE IF NOT EXISTS "DailyReadingRef" (
    "id" SERIAL NOT NULL,
    "devotionalReadingId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DailyReadingRef_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'DailyReadingRef_devotionalReadingId_fkey'
  ) THEN
    ALTER TABLE "DailyReadingRef"
      ADD CONSTRAINT "DailyReadingRef_devotionalReadingId_fkey"
      FOREIGN KEY ("devotionalReadingId") REFERENCES "DevotionalReading"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
