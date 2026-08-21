import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const testimonyId = Number(id);

    if (isNaN(testimonyId)) {
      return NextResponse.json(
        { success: false, error: "Invalid testimony ID" },
        { status: 400 },
      );
    }

    const testimony = await prisma.testimony.findFirst({
      where: {
        id: testimonyId,
        isApproved: true,
      },
    });

    if (!testimony) {
      return NextResponse.json(
        { success: false, error: "Testimony not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: testimony,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimony" },
      { status: 500 },
    );
  }
}
