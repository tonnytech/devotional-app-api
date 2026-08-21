import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 },
      );
    }

    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
        isPublished: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}
