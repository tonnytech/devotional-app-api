// components/admin/EventForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { EventFormData } from "@/app/(admin)/events/actions";
import ImageUploadField from "./ImageUploadField";

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  buttonText?: string;
}

export default function EventForm({
  initialData,
  onSubmit,
  buttonText = "Save Event",
}: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    location: initialData?.location ?? "",
    eventDate: initialData?.eventDate
      ? new Date(initialData.eventDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    eventTime: initialData?.eventTime ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    registrationUrl: initialData?.registrationUrl ?? "",
    isFeatured: initialData?.isFeatured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        imageUrl: formData.imageUrl || undefined,
        registrationUrl: formData.registrationUrl || undefined,
        isFeatured: formData.isFeatured,
      });
    } catch (err) {
      console.error("Event Submission Error:", err);
      setError(
        "Failed to save event. Please check required fields and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#E4DFD3] shadow-xs'>
      {error && (
        <div className='p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700'>
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Event Title *
        </label>
        <input
          type='text'
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='e.g. Annual Prayer Conference'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Date & Time */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Event Date *
          </label>
          <input
            type='date'
            required
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Event Time *
          </label>
          <input
            type='text'
            required
            value={formData.eventTime}
            onChange={(e) =>
              setFormData({ ...formData, eventTime: e.target.value })
            }
            placeholder='e.g. 10:00 AM - 1:00 PM'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Location *
        </label>
        <input
          type='text'
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder='e.g. Main Sanctuary / Online'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Image Upload */}
      <ImageUploadField
        label='Cover Image'
        value={formData.imageUrl}
        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        folder='church-cms/events'
      />

      {/* Description */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Description
        </label>
        <textarea
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Provide overview details about the event...'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* External Registration URL */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Registration Link (Optional)
        </label>
        <input
          type='url'
          value={formData.registrationUrl}
          onChange={(e) =>
            setFormData({ ...formData, registrationUrl: e.target.value })
          }
          placeholder='https://eventbrite.com/...'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Featured Toggle */}
      <div className='flex items-center gap-3 pt-2'>
        <input
          type='checkbox'
          id='isFeatured'
          checked={formData.isFeatured}
          onChange={(e) =>
            setFormData({ ...formData, isFeatured: e.target.checked })
          }
          className='w-4 h-4 accent-[#C9922F] rounded-xs cursor-pointer'
        />
        <label
          htmlFor='isFeatured'
          className='text-sm font-medium text-[#21262B] cursor-pointer'>
          Feature this event on the mobile app banner
        </label>
      </div>

      {/* Form Controls */}
      <div className='flex items-center justify-end gap-3 border-t border-[#E4DFD3] pt-6'>
        <Link
          href='/events'
          className='px-5 py-2.5 rounded-xl border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
          Cancel
        </Link>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-2.5 rounded-xl bg-[#21262B] text-xs font-semibold text-white shadow-xs hover:bg-[#C9922F] transition-all disabled:opacity-50'>
          {loading ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
}
