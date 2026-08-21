/*
  Warnings:

  - You are about to drop the column `author` on the `Testimony` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Testimony` table. All the data in the column will be lost.
  - Added the required column `testifier_name` to the `Testimony` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimony" DROP COLUMN "author",
DROP COLUMN "location",
ADD COLUMN     "testifier_location" TEXT,
ADD COLUMN     "testifier_name" TEXT NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "testimonyDate" DROP NOT NULL;
