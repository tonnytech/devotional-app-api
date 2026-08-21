// src/components/admin/ThemeVerseForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeVerseFormData } from "@/types";

interface ThemeVerseFormProps {
  initialData?: ThemeVerseFormData & { id?: number };
  onSubmit: (data: ThemeVerseFormData) => Promise<void>;
  buttonText: string;
}

const BIBLE_VERSIONS = [
  "NIV",
  "NKJV",
  "KJV",
  "ESV",
  "NLT",
  "MSG",
  "AMP",
  "CSB",
];

export default function ThemeVerseForm({
  initialData,
  onSubmit,
  buttonText,
}: ThemeVerseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [content, setContent] = useState(initialData?.content ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data: ThemeVerseFormData = {
      verse: (formData.get("verse") as string).trim(),
      version: (formData.get("version") as string).trim(),
      content: content.trim(),
      isActive,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Theme Verse Error:", err);
      setError(
        "Failed to save theme verse. Please verify inputs and try again.",
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl'>
      {error && (
        <div className='flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm'>
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

      <div className='rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 space-y-6 shadow-sm'>
        <div className='border-b border-[#E4DFD3]/60 pb-4 flex items-center justify-between'>
          <div>
            <h2
              className='text-xl font-bold text-[#21262B]'
              style={{ fontFamily: "var(--font-fraunces, serif)" }}>
              Theme Verse Details
            </h2>
            <p className='text-xs text-[#21262B]/60 mt-0.5'>
              Enter scripture reference, translation version, and full verse
              text.
            </p>
          </div>
          <span className='hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4DFD3]/30 text-[#21262B]/80'>
            <span className='w-2 h-2 rounded-full bg-[#C9922F]' />
            Scripture
          </span>
        </div>

        {/* Verse Reference & Bible Version */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='md:col-span-2 space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Scripture Reference <span className='text-red-500'>*</span>
            </label>
            <input
              name='verse'
              defaultValue={initialData?.verse ?? ""}
              required
              placeholder='e.g. John 3:16'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Bible Version <span className='text-red-500'>*</span>
            </label>
            <input
              name='version'
              list='bible-versions'
              defaultValue={initialData?.version ?? "NIV"}
              required
              placeholder='e.g. NIV'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all uppercase'
            />
            <datalist id='bible-versions'>
              {BIBLE_VERSIONS.map((ver) => (
                <option key={ver} value={ver} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Verse Content */}
        <div className='space-y-1.5'>
          <div className='flex justify-between items-center'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Verse Text / Content <span className='text-red-500'>*</span>
            </label>
            <span className='text-[11px] font-medium text-[#21262B]/50'>
              {content.length} characters
            </span>
          </div>
          <textarea
            name='content'
            rows={4}
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            placeholder='e.g. "For God so loved the world that he gave his one and only Son..."'
            className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm leading-relaxed text-[#21262B] placeholder:text-[#21262B]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F] transition-all'
          />
        </div>

        {/* Active Banner */}
        <div className='rounded-xl border border-[#E4DFD3]/80 bg-[#FAF9F5]/80 p-4 transition-colors hover:bg-[#FAF9F5]'>
          <label className='flex items-start gap-3 cursor-pointer select-none'>
            <input
              type='checkbox'
              id='isActive'
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className='mt-0.5 h-4 w-4 rounded border-[#E4DFD3] text-[#C9922F] focus:ring-[#C9922F] accent-[#C9922F] cursor-pointer'
            />
            <div className='space-y-0.5'>
              <span className='text-sm font-semibold text-[#21262B] block'>
                Set as Active Theme Verse
              </span>
              <p className='text-xs text-[#21262B]/60'>
                When active, this entry will be prioritized for display on main
                app sections.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className='flex items-center justify-end gap-3 pt-2'>
        <Link
          href='/themeverse'
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
