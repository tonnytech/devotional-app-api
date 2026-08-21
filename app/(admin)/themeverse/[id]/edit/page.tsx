// app/(admin)/theme-verses/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ThemeVerseForm from "@/components/admin/ThemeVerseForm";
import { updateThemeVerse } from "../../actions";

interface EditThemeVersePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditThemeVersePage({
  params,
}: EditThemeVersePageProps) {
  const { id } = await params;

  const verse = await prisma.themeVerse.findUnique({
    where: { id: Number(id) },
  });

  if (!verse) {
    notFound();
  }

  const bindUpdateAction = updateThemeVerse.bind(null, verse.id);

  return (
    <main className='p-8 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold text-[#21262B]'>Edit Theme Verse</h1>
      <ThemeVerseForm
        initialData={verse}
        onSubmit={bindUpdateAction}
        buttonText='Update Verse'
      />
    </main>
  );
}
