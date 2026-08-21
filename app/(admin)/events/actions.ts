"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface EventFormData {
  name: string;
  eventDate: string;
  eventTime: string;
  location: string;
}

export async function createEvent(data: EventFormData) {
  await prisma.event.create({
    data: {
      name: data.name,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      location: data.location,
    },
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function updateEvent(id: number, data: EventFormData) {
  await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      location: data.location,
    },
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/events");
}
