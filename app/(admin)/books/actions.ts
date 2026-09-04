// app/(admin)/books/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBook(data: {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  category?: string;
  isbn?: string;
  purchaseUrl?: string;
  howToBuy?: string;
}) {
  const book = await prisma.book.create({ data });
  revalidatePath("/books");
  return book;
}

export async function updateBook(
  id: number,
  data: {
    title: string;
    author: string;
    description?: string;
    coverImageUrl?: string;
    category?: string;
    isbn?: string;
    purchaseUrl?: string;
    howToBuy?: string;
  },
) {
  const book = await prisma.book.update({ where: { id }, data });
  revalidatePath("/books");
  return book;
}

export async function togglePublish(id: number, isPublished: boolean) {
  await prisma.book.update({
    where: { id },
    data: { isPublished },
  });
  revalidatePath("/books");
}

export async function deleteBook(id: number) {
  // onDelete: Cascade on BookReview handles the reviews
  await prisma.book.delete({ where: { id } });
  revalidatePath("/books");
}

export async function approveReview(id: number) {
  await prisma.bookReview.update({
    where: { id },
    data: { isApproved: true },
  });
  revalidatePath("/books");
}

export async function deleteReview(id: number) {
  await prisma.bookReview.delete({ where: { id } });
  revalidatePath("/books");
}
