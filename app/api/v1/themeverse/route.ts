import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get("all") === "true";

    if (fetchAll) {
      const allVerses = await prisma.themeVerse.findMany({
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        count: allVerses.length,
        data: allVerses,
      });
    }

    // Default: Return the most recent active theme verse
    const activeVerse = await prisma.themeVerse.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeVerse) {
      return NextResponse.json(
        { success: false, error: "No active theme verse found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: activeVerse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch theme verse" },
      { status: 500 },
    );
  }
}
