// app/(admin)/announcements/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { AnnouncementFormData } from "@/types";

export async function createAnnouncement(data: AnnouncementFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.announcement.create({
    data: {
      title: data.title,
      location: data.location || null,
      announcementDate: new Date(data.announcementDate),
      time: data.time || null,
      category: data.category || null,
      link: data.link || null,
      description: data.description || null,
      isImportant: data.isImportant ?? false,
    },
  });

  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/announcements");
}

export async function updateAnnouncement(
  id: number | string,
  data: AnnouncementFormData,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.announcement.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      location: data.location || null,
      announcementDate: new Date(data.announcementDate),
      time: data.time || null,
      category: data.category || null,
      link: data.link || null,
      description: data.description || null,
      isImportant: data.isImportant ?? false,
    },
  });

  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/announcements");
}

export async function toggleAnnouncementImportant(
  id: number,
  currentStatus: boolean,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.announcement.update({
    where: { id: Number(id) },
    data: { isImportant: !currentStatus },
  });

  revalidatePath("/announcements");
  revalidatePath("/");
}

export async function deleteAnnouncement(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.announcement.delete({
    where: { id: Number(id) },
  });

  revalidatePath("/announcements");
  revalidatePath("/");
}
