"use client";

import { useState } from "react";
import { EventFormData } from "@/app/(admin)/events/actions";

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
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData?.name ?? "",
    eventDate: initialData?.eventDate ?? "",
    eventTime: initialData?.eventTime ?? "",
    location: initialData?.location ?? "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      <div>
        <label className='block text-sm font-semibold text-[#21262B] mb-1'>
          Event Name
        </label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder='e.g. Annual Prayer Conference'
          className='w-full rounded-xl border border-[#E4DFD3] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922F]'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-semibold text-[#21262B] mb-1'>
            Event Date
          </label>
          <input
            type='date'
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            required
            className='w-full rounded-xl border border-[#E4DFD3] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922F]'
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-[#21262B] mb-1'>
            Event Time
          </label>
          <input
            type='text'
            value={formData.eventTime}
            onChange={(e) =>
              setFormData({ ...formData, eventTime: e.target.value })
            }
            required
            placeholder='e.g. 10:00 AM - 1:00 PM'
            className='w-full rounded-xl border border-[#E4DFD3] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922F]'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-semibold text-[#21262B] mb-1'>
          Location
        </label>
        <input
          type='text'
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
          placeholder='e.g. Main Sanctuary / Online'
          className='w-full rounded-xl border border-[#E4DFD3] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922F]'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full sm:w-auto rounded-xl bg-[#21262B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C9922F] transition-all disabled:opacity-50'>
        {loading ? "Saving..." : buttonText}
      </button>
    </form>
  );
}
