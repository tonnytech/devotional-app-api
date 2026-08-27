// src/components/admin/AnnouncementForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AnnouncementFormData } from "@/types";

interface AnnouncementFormProps {
  initialData?: AnnouncementFormData & { id?: number };
  onSubmit: (data: AnnouncementFormData) => Promise<void>;
  buttonText: string;
}

const CATEGORIES = [
  "General",
  "Evangelism",
  "Weddings",
  "community service",
  "Ministry Update",
];

export default function AnnouncementForm({
  initialData,
  onSubmit,
  buttonText,
}: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImportant, setIsImportant] = useState(
    initialData?.isImportant ?? false,
  );

  const defaultDate = initialData?.announcementDate
    ? new Date(initialData.announcementDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data: AnnouncementFormData = {
      title: (formData.get("title") as string).trim(),
      location: (formData.get("location") as string)?.trim() || null,
      announcementDate: formData.get("announcementDate") as string,
      time: (formData.get("time") as string)?.trim() || null,
      category: (formData.get("category") as string)?.trim() || null,
      link: (formData.get("link") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      isImportant,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Announcement Action Error:", err);
      setError("Failed to save announcement. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl'>
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800'>
          {error}
        </div>
      )}

      <div className='rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 space-y-6 shadow-xs'>
        <h2
          className='text-xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Announcement Details
        </h2>

        {/* Title */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
            Title <span className='text-red-500'>*</span>
          </label>
          <input
            name='title'
            defaultValue={initialData?.title ?? ""}
            required
            placeholder='e.g. Mid-Week Prayer & Fellowship'
            className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
          />
        </div>

        {/* Date & Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Date <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              name='announcementDate'
              defaultValue={defaultDate}
              required
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Time{" "}
              <span className='text-xs font-normal text-[#21262B]/50'>
                (optional)
              </span>
            </label>
            <input
              name='time'
              defaultValue={initialData?.time ?? ""}
              placeholder='e.g. 5:00 PM - 7:00 PM'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
            />
          </div>
        </div>

        {/* Location & Category */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Location{" "}
              <span className='text-xs font-normal text-[#21262B]/50'>
                (optional)
              </span>
            </label>
            <input
              name='location'
              defaultValue={initialData?.location ?? ""}
              placeholder='e.g. Main Sanctuary / Online'
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
              Category
            </label>
            <select
              name='category'
              defaultValue={initialData?.category ?? "General"}
              className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
            Description / Details
          </label>
          <textarea
            name='description'
            rows={4}
            defaultValue={initialData?.description ?? ""}
            placeholder='Provide additional details regarding this announcement...'
            className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm leading-relaxed text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
          />
        </div>

        {/* Link */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-bold text-[#21262B] uppercase tracking-wider'>
            Link / URL{" "}
            <span className='text-xs font-normal text-[#21262B]/50'>
              (optional)
            </span>
          </label>
          <input
            name='link'
            type='url'
            defaultValue={initialData?.link ?? ""}
            placeholder='https://example.com'
            className='w-full rounded-xl border border-[#E4DFD3] bg-[#FAF9F5]/40 px-3.5 py-2.5 text-sm text-[#21262B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9922F]/20 focus:border-[#C9922F]'
          />
        </div>

        {/* Important Checkbox */}
        <div className='rounded-xl border border-[#E4DFD3]/80 bg-[#FAF9F5]/80 p-4 transition-colors hover:bg-[#FAF9F5]'>
          <label className='flex items-start gap-3 cursor-pointer select-none'>
            <input
              type='checkbox'
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className='mt-0.5 h-4 w-4 rounded border-[#E4DFD3] text-[#C9922F] focus:ring-[#C9922F] accent-[#C9922F] cursor-pointer'
            />
            <div className='space-y-0.5'>
              <span className='text-sm font-semibold text-[#21262B] block'>
                Mark as Important
              </span>
              <p className='text-xs text-[#21262B]/60'>
                Highlights this announcement visually across the site to draw
                user attention.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Action Controls */}
      <div className='flex items-center justify-end gap-3'>
        <Link
          href='/announcements'
          className='px-5 py-2.5 rounded-xl border border-[#E4DFD3] text-sm font-semibold text-[#21262B] bg-white hover:bg-[#FAF9F5]'>
          Cancel
        </Link>
        <button
          type='submit'
          disabled={loading}
          className='rounded-xl bg-[#21262B] px-7 py-2.5 text-sm font-semibold text-white hover:bg-[#C9922F] disabled:opacity-50 transition-all'>
          {loading ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
}
