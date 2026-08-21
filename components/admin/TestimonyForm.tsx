// src/components/admin/TestimonyForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { TestimonyFormData } from "@/app/(admin)/testimonies/actions";

interface TestimonyFormProps {
  initialData?: TestimonyFormData & { id?: string | number };
  onSubmit: (data: TestimonyFormData) => Promise<void>;
  buttonText: string;
}

const CATEGORY_OPTIONS = [
  "Healing & Restoration",
  "Financial Breakthrough",
  "Salvation & Faith",
  "Family & Relationships",
  "Deliverance & Protection",
  "Career & Academic",
  "Other",
];

export default function TestimonyForm({
  initialData,
  onSubmit,
  buttonText,
}: TestimonyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(initialData?.isApproved ?? true);

  const [content, setContent] = useState(initialData?.content ?? "");

  // Format Date for HTML type="date" input
  const defaultDateString = initialData?.testimonyDate
    ? new Date(initialData.testimonyDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const rawDate = formData.get("testimonyDate") as string;

    const data: TestimonyFormData = {
      title: (formData.get("title") as string).trim(),
      testifier_name: (formData.get("testifier_name") as string).trim(),
      testifier_location:
        (formData.get("testifier_location") as string)?.trim() || null,
      isApproved,
      testimonyDate: rawDate ? new Date(rawDate) : new Date(),
      readTime: (formData.get("readTime") as string)?.trim() || null,
      category: (formData.get("category") as string)?.trim() || null,
      keyVerse: (formData.get("keyVerse") as string)?.trim() || null,
      content: content.trim(),
    };

    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Testimony Submission Error:", err);
      setError(
        "Failed to save the testimony. Please review the form and try again.",
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl'>
      {error && (
        <div className='flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800 shadow-sm animate-in fade-in duration-200'>
          <svg
            className='w-5 h-5 text-red-600 shrink-0'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span className='font-medium'>{error}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className='rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 space-y-6 shadow-sm transition-all'>
        <div className='border-b border-[#E4DFD3]/60 pb-4 flex items-center justify-between'>
          <div>
            <h2
              className='text-xl font-bold text-[#21262B]'
              style={{ fontFamily: "var(--font-fraunces, serif)" }}>
              Testimony Details
            </h2>
            <p className='text-xs text-[#21262B]/60 mt-0.5'>
              Fill in testifier information, scripture references, and story
              content.
            </p>
          </div>
          <span className='hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4DFD3]/30 text-[#21262B]/80'>
            <span className='w-2 h-2 rounded-full bg-[#C9922F]' />
            Moderation Entry
          </span>
        </div>

        {/* Section 1: Testifier Information */}
        <div className='space-y-4'>
          <h3 className='text-xs font-bold text-[#C9922F] uppercase tracking-wider'>
            1. Testifier Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Testifier Name <span className='text-red-500'>*</span>
              </label>
              <input
                name='testifier_name'
                defaultValue={initialData?.testifier_name ?? ""}
                required
                placeholder='e.g. Grace Wanjiru'
                className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Location{" "}
                <span className='text-xs font-normal lowercase text-[#21262B]/50'>
                  (optional)
                </span>
              </label>
              <input
                name='testifier_location'
                defaultValue={initialData?.testifier_location ?? ""}
                placeholder='e.g. Nairobi, Kenya'
                className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
              />
            </div>
          </div>
        </div>

        {/* Section 2: Metadata & Details */}
        <div className='space-y-4 pt-2'>
          <h3 className='text-xs font-bold text-[#C9922F] uppercase tracking-wider'>
            2. Details & Metadata
          </h3>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Testimony Title / Subject <span className='text-red-500'>*</span>
            </label>
            <input
              name='title'
              defaultValue={initialData?.title ?? ""}
              required
              placeholder='e.g. Divine Healing and Restoration'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Testimony Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                name='testimonyDate'
                defaultValue={defaultDateString}
                required
                className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Category{" "}
                <span className='text-xs font-normal lowercase text-[#21262B]/50'>
                  (optional)
                </span>
              </label>
              <select
                name='category'
                defaultValue={initialData?.category ?? ""}
                className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'>
                <option value=''>Select Category...</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Read Time{" "}
                <span className='text-xs font-normal lowercase text-[#21262B]/50'>
                  (optional)
                </span>
              </label>
              <input
                name='readTime'
                defaultValue={initialData?.readTime ?? ""}
                placeholder='e.g. 3 min read'
                className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Key Verse Reference{" "}
              <span className='text-xs font-normal lowercase text-[#21262B]/50'>
                (optional)
              </span>
            </label>
            <input
              name='keyVerse'
              defaultValue={initialData?.keyVerse ?? ""}
              placeholder='e.g. Psalm 34:4'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
            />
          </div>
        </div>

        {/* Section 3: Narrative Content */}
        <div className='space-y-4 pt-2'>
          <h3 className='text-xs font-bold text-[#C9922F] uppercase tracking-wider'>
            3. Story Content
          </h3>

          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
                Testimony Content <span className='text-red-500'>*</span>
              </label>
              <span className='text-[11px] font-medium text-[#21262B]/50'>
                {content.length} characters
              </span>
            </div>
            <textarea
              name='content'
              rows={7}
              value={content}
              required
              onChange={(e) => setContent(e.target.value)}
              placeholder='Write or paste the full testimony content here...'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm leading-relaxed text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
            />
          </div>
        </div>

        {/* Section 4: Approval Status Banner */}
        <div className='rounded-xl border border-[#E4DFD3]/80 bg-[#FAF9F5]/80 p-4 transition-colors hover:bg-[#FAF9F5]'>
          <label className='flex items-start gap-3 cursor-pointer select-none'>
            <input
              type='checkbox'
              id='isApproved'
              checked={isApproved}
              onChange={(e) => setIsApproved(e.target.checked)}
              className='mt-0.5 h-4 w-4 rounded border-[#E4DFD3] text-[#C9922F] focus:ring-[#C9922F] accent-[#C9922F] cursor-pointer'
            />
            <div className='space-y-0.5'>
              <span className='text-sm font-semibold text-[#21262B] block'>
                Approve & Publish Immediately
              </span>
              <p className='text-xs text-[#21262B]/60'>
                When checked, this testimony will be visible to the public
                immediately upon saving.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className='flex items-center justify-end gap-3 pt-2'>
        <Link
          href='/testimonies'
          className='px-5 py-2.5 rounded-xl border border-[#E4DFD3] text-sm font-semibold text-[#21262B] bg-white hover:bg-[#FAF9F5] hover:border-[#21262B]/20 transition-all shadow-xs'>
          Cancel
        </Link>
        <button
          type='submit'
          disabled={loading}
          className='flex items-center justify-center gap-2 rounded-xl bg-[#21262B] px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C9922F] focus:outline-none focus:ring-2 focus:ring-[#C9922F]/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
          {loading && (
            <svg
              className='animate-spin h-4 w-4 text-white'
              viewBox='0 0 24 24'
              fill='none'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          )}
          {loading ? "Saving Entry..." : buttonText}
        </button>
      </div>
    </form>
  );
}
