import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        eventDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today onwards
        },
      },
      orderBy: [{ isFeatured: "desc" }, { eventDate: "asc" }],
    });

    // Match mobile app string ID expectation
    const formattedEvents = events.map((event) => ({
      ...event,
      id: event.id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedEvents,
      count: formattedEvents.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
