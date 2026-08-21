// src/app/(admin)/devotionals/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DevotionalForm from "@/components/forms/MonthlyDevotionalForm";

interface EditDevotionalPageProps {
  params: Promise<{ id: string }>;
}

interface ReadingPayload {
  reference: string;
  isCompleted: boolean;
}

export default async function EditDevotionalPage({
  params,
}: EditDevotionalPageProps) {
  const { id } = await params;
  const devotionalId = Number(id);

  if (isNaN(devotionalId)) {
    notFound();
  }

  // 1. Fetch existing devotional with nested readings
  const devotional = await prisma.devotional.findUnique({
    where: { id: devotionalId },
    include: {
      readings: {
        include: {
          bibleReadings: true,
        },
      },
    },
  });

  if (!devotional) {
    notFound();
  }

  const primaryReading = devotional.readings[0];

  // 2. Server action to perform transaction updates
  const updateDevotional = async (formData: FormData) => {
    "use server";

    const rawReadings = formData.get("bibleReadings") as string;
    let parsedReadings: ReadingPayload[] = [];

    try {
      parsedReadings = rawReadings ? JSON.parse(rawReadings) : [];
    } catch {
      parsedReadings = [];
    }

    // Use a transaction to update parent and replace child nested references cleanly
    await prisma.$transaction(async (tx) => {
      // Update main devotional record
      await tx.devotional.update({
        where: { id: devotionalId },
        data: {
          title: formData.get("title") as string,
          month: formData.get("month") as string,
          year: Number(formData.get("year")),
          description: (formData.get("description") as string) || null,
          isPaid: formData.get("isPaid") === "on",
        },
      });

      if (primaryReading) {
        // Update primary DevotionalReading (prayer, etc.)
        await tx.devotionalReading.update({
          where: { id: primaryReading.id },
          data: {
            prayer: (formData.get("prayer") as string) ?? "",
          },
        });

        // Delete existing daily Bible references for this reading and recreate them
        await tx.dailyReadingRef.deleteMany({
          where: { devotionalReadingId: primaryReading.id },
        });

        if (parsedReadings.length > 0) {
          await tx.dailyReadingRef.createMany({
            data: parsedReadings.map((r) => ({
              devotionalReadingId: primaryReading.id,
              reference: r.reference,
              isCompleted: r.isCompleted,
            })),
          });
        }
      }
    });

    redirect("/devotionals");
  };

  return (
    <div className='p-8 max-w-2xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>Edit Devotional</h1>

      <DevotionalForm
        action={updateDevotional}
        initialData={{
          title: devotional.title,
          month: devotional.month,
          year: devotional.year,
          description: devotional.description ?? "",
          isPaid: devotional.isPaid,
          prayer: primaryReading?.prayer ?? "",
          bibleReadings:
            primaryReading?.bibleReadings.map((br) => ({
              reference: br.reference,
              isCompleted: br.isCompleted,
            })) ?? [],
        }}
        buttonText='Save Changes'
      />
    </div>
  );
}
