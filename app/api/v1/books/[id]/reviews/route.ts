// app/api/v1/books/[id]/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reviewerName, reviewerLocation, rating, title, content } = body;

    if (!reviewerName || !rating || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    const review = await prisma.bookReview.create({
      data: {
        bookId: Number(id),
        reviewerName,
        reviewerLocation,
        rating,
        title,
        content,
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
