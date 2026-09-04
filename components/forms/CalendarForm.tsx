"use client";

import { useState } from "react";
import type { CalendarEventFormData } from "@/types";
import ImageUploadField from "@/components/admin/ImageUploadField";

const RECURRENCE_PRESETS = [
  { label: "Does not repeat", value: "" },
  { label: "Every week", value: "FREQ=WEEKLY" },
  { label: "Every 2 weeks", value: "FREQ=WEEKLY;INTERVAL=2" },
  { label: "Every month", value: "FREQ=MONTHLY" },
  { label: "Custom", value: "custom" },
];

const inputClasses =
  "w-full rounded-lg border border-[#E4DFD3] bg-white px-3 py-2 text-sm text-[#21262B] placeholder:text-[#21262B]/40 focus:outline-none focus:ring-2 focus:ring-[#21262B]/20";

const labelClasses = "block text-sm font-medium text-[#21262B] mb-1.5";

type CalendarFormProps = {
  initialData?: Partial<CalendarEventFormData>;
  onSubmit: (data: CalendarEventFormData) => Promise<void>;
  submitLabel?: string;
};

export default function CalendarForm({
  initialData,
  onSubmit,
  submitLabel = "Save event",
}: CalendarFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [allDay, setAllDay] = useState(initialData?.allDay ?? false);
  const [eventTime, setEventTime] = useState(initialData?.eventTime ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [color, setColor] = useState(initialData?.color ?? "#21262B");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [registrationUrl, setRegistrationUrl] = useState(
    initialData?.registrationUrl ?? "",
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? false,
  );
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring ?? false,
  );
  const [recurrencePreset, setRecurrencePreset] = useState(() => {
    const rule = initialData?.recurrenceRule ?? "";
    const known = RECURRENCE_PRESETS.find((p) => p.value === rule);
    return known ? known.value : rule ? "custom" : "";
  });
  const [customRule, setCustomRule] = useState(
    recurrencePreset === "custom" ? (initialData?.recurrenceRule ?? "") : "",
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    initialData?.recurrenceEndDate ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recurrenceRule =
    recurrencePreset === "custom" ? customRule : recurrencePreset;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !location.trim() || !startDate) {
      setError("Title, location, and start date are required.");
      return;
    }
    if (isRecurring && !recurrenceRule.trim()) {
      setError("Add a recurrence rule, or turn off repeating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description || null,
        location: location || null,
        startDate,
        endDate: endDate || null,
        allDay,
        eventTime: allDay ? null : eventTime || null,
        category: category || null,
        color: color || null,
        imageUrl: imageUrl || null,
        registrationUrl: registrationUrl || null,
        isFeatured,
        isRecurring,
        recurrenceRule: isRecurring ? recurrenceRule || null : null,
        recurrenceEndDate: isRecurring ? recurrenceEndDate || null : null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {/* Basics */}
      <div className='space-y-5'>
        <div>
          <label className={labelClasses} htmlFor='title'>
            Title
          </label>
          <input
            id='title'
            className={inputClasses}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Sunday Morning Service'
            required
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor='description'>
            Description
          </label>
          <textarea
            id='description'
            className={inputClasses}
            rows={4}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='What should people know before they come?'
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor='location'>
            Location
          </label>
          <input
            id='location'
            className={inputClasses}
            value={location ?? ""}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Main Sanctuary'
            required
          />
        </div>
      </div>

      {/* Date & time */}
      <div className='space-y-5 border-t border-[#E4DFD3] pt-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClasses} htmlFor='startDate'>
              Start date
            </label>
            <input
              id='startDate'
              type='date'
              className={inputClasses}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor='endDate'>
              End date
            </label>
            <input
              id='endDate'
              type='date'
              className={inputClasses}
              value={endDate ?? ""}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
            <p className='text-xs text-[#21262B]/50 mt-1'>
              Leave blank for a single-day event.
            </p>
          </div>
        </div>

        <label className='flex items-center gap-2 text-sm text-[#21262B]'>
          <input
            type='checkbox'
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className='rounded border-[#E4DFD3]'
          />
          All day
        </label>

        {!allDay && (
          <div>
            <label className={labelClasses} htmlFor='eventTime'>
              Time
            </label>
            <input
              id='eventTime'
              className={inputClasses}
              value={eventTime ?? ""}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder='10:00 AM - 1:00 PM'
            />
          </div>
        )}
      </div>

      {/* Recurrence */}
      <div className='space-y-5 border-t border-[#E4DFD3] pt-6'>
        <label className='flex items-center gap-2 text-sm text-[#21262B]'>
          <input
            type='checkbox'
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className='rounded border-[#E4DFD3]'
          />
          Repeats
        </label>

        {isRecurring && (
          <div className='space-y-4 pl-6'>
            <div>
              <label className={labelClasses} htmlFor='recurrencePreset'>
                Repeats
              </label>
              <select
                id='recurrencePreset'
                className={inputClasses}
                value={recurrencePreset}
                onChange={(e) => setRecurrencePreset(e.target.value)}>
                {RECURRENCE_PRESETS.filter((p) => p.value !== "").map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {recurrencePreset === "custom" && (
              <div>
                <label className={labelClasses} htmlFor='customRule'>
                  Recurrence rule
                </label>
                <input
                  id='customRule'
                  className={inputClasses}
                  value={customRule}
                  onChange={(e) => setCustomRule(e.target.value)}
                  placeholder='FREQ=WEEKLY;BYDAY=SU'
                />
                <p className='text-xs text-[#21262B]/50 mt-1'>
                  iCal RRULE format.
                </p>
              </div>
            )}

            <div>
              <label className={labelClasses} htmlFor='recurrenceEndDate'>
                Repeat until
              </label>
              <input
                id='recurrenceEndDate'
                type='date'
                className={inputClasses}
                value={recurrenceEndDate ?? ""}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                min={startDate || undefined}
              />
              <p className='text-xs text-[#21262B]/50 mt-1'>
                Leave blank to repeat indefinitely.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className='space-y-5 border-t border-[#E4DFD3] pt-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClasses} htmlFor='category'>
              Category
            </label>
            <input
              id='category'
              className={inputClasses}
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value)}
              placeholder='Service, Youth, Outreach...'
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor='color'>
              Calendar color
            </label>
            <input
              id='color'
              type='color'
              className='h-10 w-full rounded-lg border border-[#E4DFD3] bg-white px-1'
              value={color ?? "#21262B"}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <ImageUploadField
          label='Event image'
          value={imageUrl ?? ""}
          onChange={setImageUrl}
          folder='calendar-events'
        />

        <div>
          <label className={labelClasses} htmlFor='registrationUrl'>
            Registration link
          </label>
          <input
            id='registrationUrl'
            className={inputClasses}
            value={registrationUrl ?? ""}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder='https://...'
          />
        </div>

        <label className='flex items-center gap-2 text-sm text-[#21262B]'>
          <input
            type='checkbox'
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className='rounded border-[#E4DFD3]'
          />
          Feature this event
        </label>
      </div>

      <div className='border-t border-[#E4DFD3] pt-6'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='rounded-full bg-[#21262B] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
