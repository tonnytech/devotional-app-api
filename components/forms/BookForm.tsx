// components/forms/BookForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";

type BookFormValues = {
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  category: string;
  isbn: string;
  purchaseUrl: string;
  howToBuy: string;
};

export default function BookForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Book",
}: {
  initialValues?: Partial<BookFormValues>;
  onSubmit: (data: BookFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BookFormValues>({
    title: initialValues?.title ?? "",
    author: initialValues?.author ?? "",
    description: initialValues?.description ?? "",
    coverImageUrl: initialValues?.coverImageUrl ?? "",
    category: initialValues?.category ?? "",
    isbn: initialValues?.isbn ?? "",
    purchaseUrl: initialValues?.purchaseUrl ?? "",
    howToBuy: initialValues?.howToBuy ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit(values);
      router.push("/books");
      router.refresh();
    } catch (err) {
      setError("Something went wrong saving this book. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
          Title
        </label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
        />
      </div>

      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
          Author
        </label>
        <input
          required
          value={values.author}
          onChange={(e) => setValues({ ...values, author: e.target.value })}
          className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
        />
      </div>

      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
          Description
        </label>
        <textarea
          rows={5}
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
            Category
          </label>
          <input
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
            className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
          />
        </div>

        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
            ISBN
          </label>
          <input
            value={values.isbn}
            onChange={(e) => setValues({ ...values, isbn: e.target.value })}
            className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
          />
        </div>
      </div>

      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
          Cover Image
        </label>
        <ImageUploadField
          label='Cover Image'
          value={values.coverImageUrl}
          onChange={(url: string) =>
            setValues({ ...values, coverImageUrl: url })
          }
          folder='church-cms/books'
        />
      </div>

      <div className='border-t border-[#E4DFD3] pt-6'>
        <p className='text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
          Where to Buy
        </p>
        <p className='text-xs text-[#21262B]/50 mb-4'>
          Add a purchase link if the book is available online, or describe how
          to get a copy if it isn&apos;t (e.g. church bookstore, contact the
          office). You can fill in either or both.
        </p>

        <div className='space-y-4'>
          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
              Purchase Link
            </label>
            <input
              type='url'
              placeholder='https://...'
              value={values.purchaseUrl}
              onChange={(e) =>
                setValues({ ...values, purchaseUrl: e.target.value })
              }
              className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B]/70 mb-1.5'>
              How to Buy
            </label>
            <textarea
              rows={3}
              placeholder='e.g. Available at the church bookstore after Sunday service.'
              value={values.howToBuy}
              onChange={(e) =>
                setValues({ ...values, howToBuy: e.target.value })
              }
              className='w-full rounded-xl border border-[#E4DFD3] px-3.5 py-2.5 text-sm text-[#21262B] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/40'
            />
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3 pt-2'>
        <button
          type='submit'
          disabled={saving}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#21262B] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#C9922F] transition-all disabled:opacity-50'>
          {saving ? "Saving..." : submitLabel}
        </button>
        <button
          type='button'
          onClick={() => router.push("/books")}
          className='px-5 py-2.5 rounded-xl border border-[#E4DFD3] text-sm font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
          Cancel
        </button>
      </div>
    </form>
  );
}
