// app/api/v1/calendar-events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        { success: false, error: "Invalid event id" },
        { status: 400 },
      );
    }

    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("[GET /api/v1/calendar-events/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calendar event" },
      { status: 500 },
    );
  }
}
