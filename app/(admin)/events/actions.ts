"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface EventFormData {
  title: string;
  description?: string;
  location: string;
  eventDate: string;
  eventTime: string;
  imageUrl?: string;
  registrationUrl?: string;
  isFeatured: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createEvent(data: EventFormData) {
  const baseSlug = slugify(data.title);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  await prisma.event.create({
    data: {
      title: data.title,
      slug: uniqueSlug,
      description: data.description || null,
      location: data.location,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      imageUrl: data.imageUrl || null,
      registrationUrl: data.registrationUrl || null,
      isFeatured: data.isFeatured,
    },
  });

  revalidatePath("/events");
  revalidatePath("/api/v1/events");
  redirect("/events");
}

export async function updateEvent(id: number, data: EventFormData) {
  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      location: data.location,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      imageUrl: data.imageUrl || null,
      registrationUrl: data.registrationUrl || null,
      isFeatured: data.isFeatured,
    },
  });

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  revalidatePath("/api/v1/events");
  redirect("/events");
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/events");
  revalidatePath("/api/v1/events");
}
