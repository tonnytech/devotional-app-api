// app/(admin)/themeverse/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ThemeVerseFormData } from "@/types";

export async function createThemeVerse(data: ThemeVerseFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (data.isActive) {
    await prisma.themeVerse.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  await prisma.themeVerse.create({
    data: {
      verse: data.verse,
      content: data.content,
      version: data.version,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/themeverse");
  revalidatePath("/");
  redirect("/themeverse");
}

export async function updateThemeVerse(
  id: number | string,
  data: ThemeVerseFormData,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const numericId = Number(id);

  if (data.isActive) {
    await prisma.themeVerse.updateMany({
      where: {
        id: { not: numericId },
        isActive: true,
      },
      data: { isActive: false },
    });
  }

  await prisma.themeVerse.update({
    where: { id: numericId },
    data: {
      verse: data.verse,
      content: data.content,
      version: data.version,
      isActive: data.isActive,
    },
  });

  revalidatePath("/themeverse");
  revalidatePath("/");
  redirect("/themeverse");
}

export async function toggleThemeVerseActive(
  id: number,
  currentStatus: boolean,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.themeVerse.update({
    where: { id: Number(id) },
    data: { isActive: !currentStatus },
  });

  revalidatePath("/themeverse");
  revalidatePath("/");
}

export async function deleteThemeVerse(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.themeVerse.delete({
    where: { id: Number(id) },
  });

  revalidatePath("/themeverse");
  revalidatePath("/");
}
