// app/api/v1/books/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const book = await prisma.book.findFirst({
      where: { id: Number(id), isPublished: true },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverImageUrl: true,
        category: true,
        isbn: true,
        purchaseUrl: true,
        howToBuy: true,
        createdAt: true,
        reviews: {
          where: { isApproved: true },
          select: {
            id: true,
            reviewerName: true,
            reviewerLocation: true,
            rating: true,
            title: true,
            content: true,
            likesCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    const reviewCount = book.reviews.length;
    const avgRating =
      reviewCount > 0
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return NextResponse.json({
      success: true,
      data: { ...book, reviewCount, avgRating },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch book" },
      { status: 500 },
    );
  }
}
