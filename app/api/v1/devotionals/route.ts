import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const devotionals = await prisma.devotional.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        month: true,
        year: true,
        imageUrl: true,
        description: true,
        isPaid: true,
        _count: {
          select: { readings: true },
        },
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: devotionals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devotionals" },
      { status: 500 },
    );
  }
}
