-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "eventTime" TEXT,
    "category" TEXT,
    "color" TEXT,
    "imageUrl" TEXT,
    "registrationUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "recurrenceEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_slug_key" ON "CalendarEvent"("slug");
