// app/api/v1/calendar-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const events = await prisma.calendarEvent.findMany({
      where: {
        AND: [
          category ? { category } : {},
          featured === "true" ? { isFeatured: true } : {},
          {
            OR: [
              // Non-recurring events that haven't ended yet
              {
                isRecurring: false,
                OR: [
                  { endDate: { gte: startOfToday } },
                  { endDate: null, startDate: { gte: startOfToday } },
                ],
              },
              // Recurring events that haven't passed their recurrence end date
              {
                isRecurring: true,
                OR: [
                  { recurrenceEndDate: { gte: startOfToday } },
                  { recurrenceEndDate: null },
                ],
              },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error("[GET /api/v1/calendar-events]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}
