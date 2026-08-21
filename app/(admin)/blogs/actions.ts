// app/(admin)/blogs/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { BlogFormData } from "@/types";

export async function createBlog(data: BlogFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.blog.create({
    data: {
      title: data.title,
      snippet: data.snippet || null,
      author: data.author,
      authorRole: data.authorRole || null,
      blogDate: new Date(data.blogDate),
      readTime: data.readTime || null,
      category: data.category || null,
      imageUrl: data.imageUrl || null,
      takeaways: data.takeaways ?? [],
      content: data.content,
      isPublished: data.isPublished ?? false,
    },
  });

  revalidatePath("/blogs");
  revalidatePath("/blog");
  redirect("/blogs");
}

export async function updateBlog(id: number, data: BlogFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      snippet: data.snippet || null,
      author: data.author,
      authorRole: data.authorRole || null,
      blogDate: new Date(data.blogDate),
      readTime: data.readTime || null,
      category: data.category || null,
      imageUrl: data.imageUrl || null,
      takeaways: data.takeaways ?? [],
      content: data.content,
      isPublished: data.isPublished ?? false,
    },
  });

  revalidatePath("/blogs");
  revalidatePath("/blog");
  redirect("/blogs");
}

export async function toggleBlogPublication(
  id: number,
  currentStatus: boolean,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.blog.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}

export async function deleteBlog(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.blog.delete({ where: { id } });

  revalidatePath("/blogs");
  revalidatePath("/blog");
}
