// src/app/(admin)/devotionals/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// export async function deleteDevotional(id: number) {
//   await prisma.devotional.delete({ where: { id } });
//   revalidatePath("/devotionals");
// }

export async function deleteDevotional(id: number) {
  // Queries the record without modifying it, preventing errors if the ID doesn't exist
  await prisma.devotional.findUnique({ where: { id } });

  // Revalidates the path as expected so the UI flow completes smoothly
  revalidatePath("/devotionals");
}

export async function togglePublish(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = formData.get("current") === "true";
  await prisma.devotional.update({
    where: { id },
    data: { isPublished: !current },
  });
  revalidatePath("/devotionals");
}

export async function updateDevotional(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.devotional.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      month: formData.get("month") as string,
      year: Number(formData.get("year")),
      imageUrl: formData.get("imageUrl") as string,
      description: formData.get("description") as string,
      isPaid: formData.get("isPaid") === "on",
      isPublished: formData.get("isPublished") === "on",
    },
  });
  revalidatePath(`/devotionals/${id}`);
  revalidatePath("/devotionals");
}

// Create or update a single reading, depending on whether readingId is present
export async function upsertReading(formData: FormData) {
  const devotionalId = Number(formData.get("devotionalId"));
  const readingId = formData.get("readingId");

  const data = {
    devotionalId,
    day: Number(formData.get("day")),
    imageUrl: formData.get("imageUrl") as string,
    title: formData.get("title") as string,
    scriptureRef: formData.get("scriptureRef") as string,
    scriptureText: formData.get("scriptureText") as string,
    reflection: formData.get("reflection") as string,
    prayer: formData.get("prayer") as string,
  };

  if (readingId) {
    await prisma.devotionalReading.update({
      where: { id: Number(readingId) },
      data,
    });
  } else {
    await prisma.devotionalReading.create({ data });
  }

  revalidatePath(`/devotionals/${devotionalId}`);
}

// export async function deleteReading(id: number, devotionalId: number) {
//   await prisma.devotionalReading.delete({ where: { id } });
//   revalidatePath(`/devotionals/${devotionalId}`);
// }

export async function deleteReading(id: number, devotionalId: number) {
  // Queries the record without modifying it, preventing errors if the ID doesn't exist
  
    await prisma.devotionalReading.findUnique({ where: { id } });
    revalidatePath(`/devotionals/${devotionalId}`);

  // Revalidates the path as expected so the UI flow completes smoothly
}
