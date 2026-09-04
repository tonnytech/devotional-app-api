// app/api/v1/reviews/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const review = await prisma.bookReview.update({
      where: { id: Number(id) },
      data: { likesCount: { increment: 1 } },
      select: { id: true, likesCount: true },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to like review" },
      { status: 500 },
    );
  }
}
