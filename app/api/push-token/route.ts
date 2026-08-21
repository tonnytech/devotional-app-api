// src/app/api/push-token/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token } = await req.json();
  await prisma.pushToken.upsert({
    where: { token },
    update: {},
    create: { token },
  });
  return NextResponse.json({ success: true });
}
