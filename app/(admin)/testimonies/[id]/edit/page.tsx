// app/(admin)/testimonies/[id]/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/admin/Header";
import TestimonyForm from "@/components/admin/TestimonyForm";
import { updateTestimony } from "../../actions";

interface EditTestimonyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonyPage({
  params,
}: EditTestimonyPageProps) {
  const { id } = await params;
  const testimonyId = Number(id);

  if (isNaN(testimonyId)) {
    notFound();
  }

  const testimony = await prisma.testimony.findUnique({
    where: { id: testimonyId },
  });

  if (!testimony) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (data: any) => {
    "use server";
    await updateTestimony(testimonyId, data);
  };

  return (
    <div className='flex-1 bg-[#FAF9F5] min-h-screen'>
      <Header title='Edit Testimony' />

      <main className='p-8 max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1
              className='text-2xl font-bold text-[#21262B]'
              style={{ fontFamily: "var(--font-fraunces, serif)" }}>
              Edit Testimony Entry
            </h1>
            <p className='text-sm text-[#21262B]/60 mt-1'>
              Update testifier details, text, or publication status.
            </p>
          </div>

          <Link
            href='/testimonies'
            className='text-xs font-semibold text-[#21262B]/70 hover:text-[#21262B] underline'>
            ← Back to Testimonies
          </Link>
        </div>

        <TestimonyForm
          initialData={{
            ...testimony,
            id: testimony.id,
            title: testimony.title ?? "",
            testifier_location: testimony.testifier_location ?? "",
            testimonyDate: testimony.testimonyDate
              ? testimony.testimonyDate.toISOString().split("T")[0]
              : "",
            readTime: testimony.readTime ?? "",
            category: testimony.category ?? "",
            keyVerse: testimony.keyVerse ?? "",
          }}
          onSubmit={handleUpdate}
          buttonText='Save Changes'
        />
      </main>
    </div>
  );
}
