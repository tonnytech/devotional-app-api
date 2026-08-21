// src/app/api/cloudinary/sign/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folder } = await req.json();
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = { timestamp, folder: folder ?? "church-cms" };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
  });
}
