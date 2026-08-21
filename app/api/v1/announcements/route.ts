import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        announcementDate: true,
        time: true,
        category: true,
        link: true,
        description: true,
        isImportant: true,
        createdAt: true,
      },
      orderBy: [
        { isImportant: "desc" },
        { announcementDate: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 },
    );
  }
}
