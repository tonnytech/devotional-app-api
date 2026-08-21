import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import MonthlyDevotionalForm from "@/components/forms/MonthlyDevotionalForm";
import MonthlyDevotionalForm from "@/components/forms/MonthlyDevotionalForm";

interface DailyBibleRef {
  reference: string;
  isCompleted: boolean;
}

interface DailyDevotionalInput {
  day: number;
  title: string;
  scriptureRef: string;
  reflection: string;
  prayer: string;
  bibleReadings: DailyBibleRef[];
}

async function createMonthlyDevotional(formData: FormData) {
  "use server";

  const rawReadings = formData.get("dailyReadings") as string;
  let parsedReadings: DailyDevotionalInput[] = [];

  try {
    parsedReadings = rawReadings ? JSON.parse(rawReadings) : [];
  } catch {
    parsedReadings = [];
  }

  await prisma.devotional.create({
    data: {
      title: formData.get("title") as string,
      month: formData.get("month") as string,
      year: Number(formData.get("year")),
      imageUrl: (formData.get("imageUrl") as string) || null,
      description: (formData.get("description") as string) || null,
      isPaid: formData.get("isPaid") === "on",
      readings: {
        create: parsedReadings.map((dayItem) => ({
          day: dayItem.day,
          title: dayItem.title,
          scriptureRef: dayItem.scriptureRef ?? "",
          reflection: dayItem.reflection ?? "",
          prayer: dayItem.prayer ?? "",
          bibleReadings: {
            create: dayItem.bibleReadings
              .filter((r) => r.reference.trim() !== "")
              .map((r) => ({
                reference: r.reference,
                isCompleted: r.isCompleted,
              })),
          },
        })),
      },
    },
  });

  redirect("/devotionals");
}

export default function NewDevotionalPage() {
  return (
    <div className='p-8 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>
        New Monthly Devotional
      </h1>
      <MonthlyDevotionalForm action={createMonthlyDevotional} />
    </div>
  );
}
