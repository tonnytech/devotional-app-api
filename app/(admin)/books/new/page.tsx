// app/(admin)/books/new/page.tsx
import BookForm from "@/components/forms/BookForm";
import { createBook } from "../actions";

export default function NewBookPage() {
  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-6'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Add Book
        </h1>
        <p className='text-sm text-[#21262B]/60 mt-1'>
          Add a new book for the congregation to read and review.
        </p>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs p-6 md:p-8'>
        <BookForm
          onSubmit={async (data) => {
            "use server";
            await createBook(data);
          }}
        />
      </div>
    </div>
  );
}
