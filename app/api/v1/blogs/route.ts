import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const blogs = await prisma.blog.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        title: true,
        snippet: true,
        author: true,
        authorRole: true,
        blogDate: true,
        readTime: true,
        category: true,
        imageUrl: true,
        takeaways: true,
        content: true,
        createdAt: true,
      },
      orderBy: [{ blogDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}
