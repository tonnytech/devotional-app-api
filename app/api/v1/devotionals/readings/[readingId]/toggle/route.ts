import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{ readingId: string }>;
}

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { readingId } = await params;
    const refId = Number(readingId);

    if (isNaN(refId)) {
      return NextResponse.json(
        { success: false, error: "Invalid reading reference ID" },
        { status: 400 },
      );
    }

    // 1. Check current state
    const currentRef = await prisma.dailyReadingRef.findUnique({
      where: { id: refId },
    });

    if (!currentRef) {
      return NextResponse.json(
        { success: false, error: "Reading reference not found" },
        { status: 404 },
      );
    }

    // 2. Toggle status
    const updatedRef = await prisma.dailyReadingRef.update({
      where: { id: refId },
      data: { isCompleted: !currentRef.isCompleted },
    });

    return NextResponse.json({ success: true, data: updatedRef });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update completion status" },
      { status: 500 },
    );
  }
}
