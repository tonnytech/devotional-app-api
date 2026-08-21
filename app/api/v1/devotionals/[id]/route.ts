import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const devotionalId = Number(id);

    if (isNaN(devotionalId)) {
      return NextResponse.json(
        { success: false, error: "Invalid devotional ID" },
        { status: 400 },
      );
    }

    const devotional = await prisma.devotional.findUnique({
      where: { id: devotionalId, isPublished: true },
      include: {
        readings: {
          orderBy: { day: "asc" },
          include: {
            bibleReadings: true,
          },
        },
      },
    });

    if (!devotional) {
      return NextResponse.json(
        { success: false, error: "Devotional not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: devotional });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devotional details" },
      { status: 500 },
    );
  }
}
