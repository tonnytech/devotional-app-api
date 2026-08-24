// src/components/forms/MonthlyDevotionalForm.tsx
"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface BibleRefInput {
  reference: string;
  isCompleted: boolean;
}

interface DayInput {
  readingId?: number; // present only when editing an existing day
  day: number;
  title: string;
  scriptureRef: string;
  reflection: string;
  prayer: string;
  bibleReadings: BibleRefInput[];
}

interface InitialData {
  title?: string;
  month?: string;
  year?: number;
  description?: string;
  imageUrl?: string;
  isPaid?: boolean;
  isPublished?: boolean;
  days?: DayInput[];
}

interface MonthlyDevotionalFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: InitialData;
  buttonText?: string;
}

const emptyDay = (dayNumber: number): DayInput => ({
  day: dayNumber,
  title: "",
  scriptureRef: "",
  reflection: "",
  prayer: "",
  bibleReadings: [{ reference: "", isCompleted: false }],
});

export default function MonthlyDevotionalForm({
  action,
  initialData,
  buttonText = "Save Devotional",
}: MonthlyDevotionalFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [days, setDays] = useState<DayInput[]>(
    initialData?.days && initialData.days.length > 0
      ? initialData.days
      : [emptyDay(1)],
  );
  const [expandedDay, setExpandedDay] = useState<number>(-1);

  const addDay = () => {
    const nextDayNumber = days.length
      ? Math.max(...days.map((d) => d.day)) + 1
      : 1;
    setExpandedDay(days.length);
    setDays((prev) => [...prev, emptyDay(nextDayNumber)]);
  };

  const removeDay = (index: number) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
    if (expandedDay === index) setExpandedDay(-1);
  };

  const updateDay = (index: number, patch: Partial<DayInput>) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
  };

  const addBibleRef = (dayIndex: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              bibleReadings: [
                ...d.bibleReadings,
                { reference: "", isCompleted: false },
              ],
            }
          : d,
      ),
    );
  };

  const updateBibleRef = (
    dayIndex: number,
    refIndex: number,
    patch: Partial<BibleRefInput>,
  ) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== dayIndex) return d;
        const updated = [...d.bibleReadings];
        updated[refIndex] = { ...updated[refIndex], ...patch };
        return { ...d, bibleReadings: updated };
      }),
    );
  };

  const removeBibleRef = (dayIndex: number, refIndex: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              bibleReadings: d.bibleReadings.filter((_, r) => r !== refIndex),
            }
          : d,
      ),
    );
  };

  return (
    <form action={action} className='space-y-8'>
      <input type='hidden' name='imageUrl' value={imageUrl} />
      <input
        type='hidden'
        name='dailyReadings'
        value={JSON.stringify(
          days.map((d) => ({
            ...d,
            bibleReadings: d.bibleReadings.filter(
              (r) => r.reference.trim() !== "",
            ),
          })),
        )}
      />

      <ImageUploadField
        label='Cover Image'
        value={imageUrl}
        onChange={setImageUrl}
        folder='church-cms/devotionals'
      />

      <div>
        <label className='block text-sm font-medium'>Title</label>
        <input
          name='title'
          type='text'
          defaultValue={initialData?.title ?? ""}
          required
          className='w-full border p-2 rounded'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium'>Month</label>
          <input
            name='month'
            type='text'
            defaultValue={initialData?.month ?? ""}
            required
            className='w-full border p-2 rounded'
          />
        </div>
        <div>
          <label className='block text-sm font-medium'>Year</label>
          <input
            name='year'
            type='number'
            defaultValue={initialData?.year ?? new Date().getFullYear()}
            required
            className='w-full border p-2 rounded'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium'>Description</label>
        <textarea
          name='description'
          defaultValue={initialData?.description ?? ""}
          className='w-full border p-2 rounded'
        />
      </div>

      <div className='flex items-center gap-6'>
        <label className='flex items-center gap-2 text-sm font-medium'>
          <input
            type='checkbox'
            name='isPaid'
            defaultChecked={initialData?.isPaid ?? false}
          />
          Paid Content
        </label>
        <label className='flex items-center gap-2 text-sm font-medium'>
          <input
            type='checkbox'
            name='isPublished'
            defaultChecked={initialData?.isPublished ?? false}
          />
          Published
        </label>
      </div>

      {/* Daily readings */}
      <div className='border-t pt-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Daily Readings</h2>
          <span className='text-sm text-gray-500'>{days.length} days</span>
        </div>

        <div className='space-y-3'>
          {days.map((dayItem, dayIndex) => (
            <div key={dayIndex} className='border rounded-lg'>
              <div className='flex items-center justify-between px-4 py-3'>
                <button
                  type='button'
                  onClick={() =>
                    setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)
                  }
                  className='flex-1 text-left text-sm font-medium'>
                  Day {dayItem.day}: {dayItem.title || "Untitled"}
                </button>
                <div className='flex items-center gap-3'>
                  <button
                    type='button'
                    onClick={() =>
                      setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)
                    }
                    className='text-xs text-blue-600 hover:underline'>
                    {expandedDay === dayIndex ? "Close" : "Edit"}
                  </button>
                  {days.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeDay(dayIndex)}
                      className='text-xs text-red-500 hover:underline'>
                      Remove day
                    </button>
                  )}
                </div>
              </div>

              {expandedDay === dayIndex && (
                <div className='border-t px-4 py-4 space-y-3'>
                  <div className='grid grid-cols-[80px_1fr] gap-3'>
                    <div>
                      <label className='block text-xs font-medium mb-1'>
                        Day #
                      </label>
                      <input
                        type='number'
                        value={dayItem.day}
                        onChange={(e) =>
                          updateDay(dayIndex, { day: Number(e.target.value) })
                        }
                        className='w-full border p-2 rounded text-sm'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1'>
                        Title
                      </label>
                      <input
                        type='text'
                        value={dayItem.title}
                        onChange={(e) =>
                          updateDay(dayIndex, { title: e.target.value })
                        }
                        className='w-full border p-2 rounded text-sm'
                        placeholder='The Source of True Wisdom'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Scripture Reference
                    </label>
                    <input
                      type='text'
                      value={dayItem.scriptureRef}
                      onChange={(e) =>
                        updateDay(dayIndex, { scriptureRef: e.target.value })
                      }
                      className='w-full border p-2 rounded text-sm'
                      placeholder='Proverbs 2:6'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Reflection
                    </label>
                    <textarea
                      value={dayItem.reflection}
                      onChange={(e) =>
                        updateDay(dayIndex, { reflection: e.target.value })
                      }
                      className='w-full border p-2 rounded text-sm'
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Prayer
                    </label>
                    <textarea
                      value={dayItem.prayer}
                      onChange={(e) =>
                        updateDay(dayIndex, { prayer: e.target.value })
                      }
                      className='w-full border p-2 rounded text-sm'
                      rows={2}
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-xs font-semibold'>
                      Daily Bible Readings
                    </label>
                    {dayItem.bibleReadings.map((ref, refIndex) => (
                      <div key={refIndex} className='flex items-center gap-3'>
                        <input
                          type='text'
                          placeholder='e.g., Psalm 119:1-18'
                          value={ref.reference}
                          onChange={(e) =>
                            updateBibleRef(dayIndex, refIndex, {
                              reference: e.target.value,
                            })
                          }
                          className='flex-1 border p-2 rounded text-sm'
                        />
                        <label className='flex items-center gap-1.5 text-xs'>
                          <input
                            type='checkbox'
                            checked={ref.isCompleted}
                            onChange={() =>
                              updateBibleRef(dayIndex, refIndex, {
                                isCompleted: !ref.isCompleted,
                              })
                            }
                          />
                          Read
                        </label>
                        {dayItem.bibleReadings.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeBibleRef(dayIndex, refIndex)}
                            className='text-xs text-red-500 hover:underline'>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => addBibleRef(dayIndex)}
                      className='text-xs text-blue-600 hover:underline'>
                      + Add passage
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type='button'
          onClick={addDay}
          className='w-full border border-dashed rounded-lg py-3 text-sm font-medium text-blue-600 hover:bg-blue-50'>
          + Add day
        </button>
      </div>

      <button
        type='submit'
        className='bg-black text-white px-4 py-2 rounded font-medium'>
        {buttonText}
      </button>
    </form>
  );
}
