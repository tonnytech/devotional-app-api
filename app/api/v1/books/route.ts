// app/api/v1/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const books = await prisma.book.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverImageUrl: true,
        category: true,
        isbn: true,
        createdAt: true,
        _count: {
          select: { reviews: { where: { isApproved: true } } },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const ratings = await prisma.bookReview.groupBy({
      by: ["bookId"],
      where: {
        isApproved: true,
        bookId: { in: books.map((b) => b.id) },
      },
      _avg: { rating: true },
    });
    const ratingMap = new Map(
      ratings.map((r) => [r.bookId, r._avg.rating ?? 0]),
    );

    const data = books.map(({ _count, ...book }) => ({
      ...book,
      reviewCount: _count.reviews,
      avgRating: ratingMap.get(book.id) ?? 0,
    }));

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}
