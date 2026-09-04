// app/(admin)/books/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookForm from "@/components/forms/BookForm";
import { updateBook } from "../../actions";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book) notFound();

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-6'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Edit Book
        </h1>
        <p className='text-sm text-[#21262B]/60 mt-1'>
          Update the details for &ldquo;{book.title}&rdquo;.
        </p>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs p-6 md:p-8'>
        <BookForm
          initialValues={{
            title: book.title,
            author: book.author,
            description: book.description ?? "",
            coverImageUrl: book.coverImageUrl ?? "",
            category: book.category ?? "",
            isbn: book.isbn ?? "",
            purchaseUrl: book.purchaseUrl ?? "",
            howToBuy: book.howToBuy ?? "",
          }}
          submitLabel='Update Book'
          onSubmit={async (data) => {
            "use server";
            await updateBook(book.id, data);
          }}
        />
      </div>
    </div>
  );
}
