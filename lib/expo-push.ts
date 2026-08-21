// src/lib/expo-push.ts
import { prisma } from "./prisma";

export async function sendPushToAll(title: string, body: string) {
  const tokens = await prisma.pushToken.findMany();
  const messages = tokens.map((t) => ({
    to: t.token,
    sound: "default",
    title,
    body,
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(messages),
  });
}
