import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/v1/testimonies - Fetch all approved testimonies
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const testimonies = await prisma.testimony.findMany({
      where: {
        isApproved: true,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        title: true,
        testifier_name: true,
        testifier_location: true,
        testimonyDate: true,
        readTime: true,
        category: true,
        keyVerse: true,
        content: true,
        likesCount: true,
        createdAt: true,
      },
      orderBy: [{ testimonyDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      count: testimonies.length,
      data: testimonies,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonies" },
      { status: 500 },
    );
  }
}

// POST /api/v1/testimonies - Allow mobile users to submit a testimony (Pending Approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      testifier_name,
      testifier_location,
      category,
      keyVerse,
      content,
      readTime,
      testimonyDate,
    } = body;

    if (!testifier_name || !content) {
      return NextResponse.json(
        { success: false, error: "Name and content are required." },
        { status: 400 },
      );
    }

    const newTestimony = await prisma.testimony.create({
      data: {
        title: title || null,
        testifier_name,
        testifier_location: testifier_location || null,
        category: category || null,
        keyVerse: keyVerse || null,
        content,
        readTime: readTime || null,
        testimonyDate: testimonyDate ? new Date(testimonyDate) : new Date(),
        isApproved: false, // Stays false until approved in admin panel
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Testimony submitted successfully! It will appear once reviewed.",
        data: newTestimony,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit testimony" },
      { status: 500 },
    );
  }
}
