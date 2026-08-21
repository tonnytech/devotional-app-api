// app/admin/testimonies/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { TestimonyItem } from "@/types";

export type TestimonyFormData = Omit<
  TestimonyItem,
  "id" | "createdAt" | "updatedAt"
>;

export async function createTestimony(data: TestimonyFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.testimony.create({
    data: {
      title: data.title,
      testifier_name: data.testifier_name,
      testifier_location: data.testifier_location ?? null,
      isApproved: data.isApproved ?? false,
      testimonyDate: data.testimonyDate
        ? new Date(data.testimonyDate)
        : new Date(),
      readTime: data.readTime ?? null,
      category: data.category ?? null,
      keyVerse: data.keyVerse ?? null,
      content: data.content,
    },
  });

  revalidatePath("/testimonies");
  revalidatePath("/dashboard");
  redirect("/testimonies");
}

export async function updateTestimony(
  id: string | number,
  data: TestimonyFormData,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.testimony.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      testifier_name: data.testifier_name,
      testifier_location: data.testifier_location,
      isApproved: data.isApproved,
      testimonyDate: data.testimonyDate,
      readTime: data.readTime,
      category: data.category,
      keyVerse: data.keyVerse,
      content: data.content,
    },
  });

  revalidatePath("/testimonies");
  revalidatePath("/dashboard");
  redirect("/testimonies");
}

export async function toggleApprovalStatus(
  id: string | number,
  currentStatus: boolean,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.testimony.update({
    where: { id: Number(id) },
    data: { isApproved: !currentStatus },
  });

  revalidatePath("/testimonies");
  revalidatePath("/dashboard");
}

export async function deleteTestimony(id: string | number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.testimony.delete({
    where: { id: Number(id) },
  });

  revalidatePath("/testimonies");
  revalidatePath("/dashboard");
}
