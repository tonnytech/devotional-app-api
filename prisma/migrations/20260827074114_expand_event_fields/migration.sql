/*
  Warnings:

  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "isImportant" BOOLEAN,
ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "takeaways" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DevotionalReading" ALTER COLUMN "scriptureText" DROP NOT NULL,
ALTER COLUMN "reflection" DROP NOT NULL,
ALTER COLUMN "prayer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationUrl" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "DailyReadingRef" (
    "id" SERIAL NOT NULL,
    "devotionalReadingId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailyReadingRef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- AddForeignKey
ALTER TABLE "DailyReadingRef" ADD CONSTRAINT "DailyReadingRef_devotionalReadingId_fkey" FOREIGN KEY ("devotionalReadingId") REFERENCES "DevotionalReading"("id") ON DELETE CASCADE ON UPDATE CASCADE;
