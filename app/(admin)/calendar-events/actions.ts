// app/(admin)/calendar-events/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import type { CalendarEventFormData } from "@/types";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Cloudinary URLs look like:
// https://res.cloudinary.com/<cloud>/image/upload/v169.../calendar-events/abc123.jpg
// The public_id is everything after /upload/v<version>/, minus the extension.
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function deleteCloudinaryImage(url: string | null | undefined) {
  if (!url) return;
  const publicId = extractPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Don't let a failed cleanup block the DB operation
    console.error("Failed to delete Cloudinary image:", publicId, err);
  }
}

export async function createCalendarEvent(data: CalendarEventFormData) {
  const event = await prisma.calendarEvent.create({
    data: {
      ...data,
      slug: `${slugify(data.title)}-${Date.now()}`,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      recurrenceEndDate: data.recurrenceEndDate
        ? new Date(data.recurrenceEndDate)
        : null,
    },
  });
  revalidatePath("/calendar-events");
  return event;
}

export async function updateCalendarEvent(
  id: number,
  data: CalendarEventFormData,
) {
  const existing = await prisma.calendarEvent.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  const event = await prisma.calendarEvent.update({
    where: { id },
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      recurrenceEndDate: data.recurrenceEndDate
        ? new Date(data.recurrenceEndDate)
        : null,
    },
  });

  // If the image changed (replaced or removed), clean up the old one
  if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
    await deleteCloudinaryImage(existing.imageUrl);
  }

  revalidatePath("/calendar-events");
  return event;
}

export async function toggleCalendarEventFeatured(
  id: number,
  isFeatured: boolean,
) {
  await prisma.calendarEvent.update({
    where: { id },
    data: { isFeatured },
  });
  revalidatePath("/calendar-events");
}

export async function deleteCalendarEvent(id: number) {
  const event = await prisma.calendarEvent.delete({ where: { id } });

  if (event.imageUrl) {
    await deleteCloudinaryImage(event.imageUrl);
  }

  revalidatePath("/calendar-events");
}
