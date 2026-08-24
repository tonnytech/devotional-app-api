// src/app/(admin)/devotionals/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MonthlyDevotionalForm from "@/components/forms/MonthlyDevotionalForm";

interface EditDevotionalPageProps {
  params: Promise<{ id: string }>;
}

interface BibleRefPayload {
  reference: string;
  isCompleted: boolean;
}

interface DayPayload {
  readingId?: number;
  day: number;
  title: string;
  scriptureRef: string;
  reflection: string;
  prayer: string;
  bibleReadings: BibleRefPayload[];
}

export default async function EditDevotionalPage({
  params,
}: EditDevotionalPageProps) {
  const { id } = await params;
  const devotionalId = Number(id);
  if (isNaN(devotionalId)) notFound();

  const devotional = await prisma.devotional.findUnique({
    where: { id: devotionalId },
    include: {
      readings: {
        include: { bibleReadings: true },
        orderBy: { day: "asc" },
      },
    },
  });

  if (!devotional) notFound();

  async function updateDevotional(formData: FormData) {
    "use server";

    const rawDays = formData.get("dailyReadings") as string;
    let parsedDays: DayPayload[] = [];
    try {
      parsedDays = rawDays ? JSON.parse(rawDays) : [];
    } catch {
      parsedDays = [];
    }

    await prisma.$transaction(async (tx) => {
      await tx.devotional.update({
        where: { id: devotionalId },
        data: {
          title: formData.get("title") as string,
          month: formData.get("month") as string,
          year: Number(formData.get("year")),
          description: (formData.get("description") as string) || null,
          imageUrl: (formData.get("imageUrl") as string) || null,
          isPaid: formData.get("isPaid") === "on",
          isPublished: formData.get("isPublished") === "on",
        },
      });

      const existingReadingIds = (
        await tx.devotionalReading.findMany({
          where: { devotionalId },
          select: { id: true },
        })
      ).map((r) => r.id);

      const keptReadingIds: number[] = [];

      for (const day of parsedDays) {
        if (day.readingId) {
          keptReadingIds.push(day.readingId);

          await tx.devotionalReading.update({
            where: { id: day.readingId },
            data: {
              day: day.day,
              title: day.title,
              scriptureRef: day.scriptureRef,
              reflection: day.reflection,
              prayer: day.prayer,
            },
          });

          await tx.dailyReadingRef.deleteMany({
            where: { devotionalReadingId: day.readingId },
          });

          if (day.bibleReadings.length > 0) {
            await tx.dailyReadingRef.createMany({
              data: day.bibleReadings.map((r) => ({
                devotionalReadingId: day.readingId!,
                reference: r.reference,
                isCompleted: r.isCompleted,
              })),
            });
          }
        } else {
          const created = await tx.devotionalReading.create({
            data: {
              devotionalId,
              day: day.day,
              title: day.title,
              scriptureRef: day.scriptureRef,
              reflection: day.reflection,
              prayer: day.prayer,
              bibleReadings: {
                create: day.bibleReadings.map((r) => ({
                  reference: r.reference,
                  isCompleted: r.isCompleted,
                })),
              },
            },
          });
          keptReadingIds.push(created.id);
        }
      }

      const readingIdsToDelete = existingReadingIds.filter(
        (rid) => !keptReadingIds.includes(rid),
      );
      if (readingIdsToDelete.length > 0) {
        await tx.devotionalReading.deleteMany({
          where: { id: { in: readingIdsToDelete } },
        });
      }
    });

    redirect("/devotionals");
  }

  return (
    <div className='p-8 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>Edit Devotional</h1>

      <MonthlyDevotionalForm
        action={updateDevotional}
        initialData={{
          title: devotional.title,
          month: devotional.month,
          year: devotional.year,
          description: devotional.description ?? "",
          imageUrl: devotional.imageUrl ?? "",
          isPaid: devotional.isPaid,
          isPublished: devotional.isPublished,
          days: devotional.readings.map((r) => ({
            readingId: r.id,
            day: r.day,
            title: r.title,
            scriptureRef: r.scriptureRef,
            reflection: r.reflection ?? "",
            prayer: r.prayer ?? "",
            bibleReadings: r.bibleReadings.map((br) => ({
              reference: br.reference,
              isCompleted: br.isCompleted,
            })),
          })),
        }}
        buttonText='Save Changes'
      />
    </div>
  );
}
