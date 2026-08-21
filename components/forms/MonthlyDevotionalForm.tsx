"use client";

import { useState } from "react";

interface DailyBibleRef {
  reference: string;
  isCompleted: boolean;
}

interface DailyDevotionalInput {
  day: number;
  title: string;
  scriptureRef: string;
  reflection: string;
  prayer: string;
  bibleReadings: DailyBibleRef[];
}

export default function MonthlyDevotionalForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [days, setDays] = useState<DailyDevotionalInput[]>([
    {
      day: 1,
      title: "",
      scriptureRef: "",
      reflection: "",
      prayer: "",
      bibleReadings: [{ reference: "", isCompleted: false }],
    },
  ]);

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        title: "",
        scriptureRef: "",
        reflection: "",
        prayer: "",
        bibleReadings: [{ reference: "", isCompleted: false }],
      },
    ]);
  };

  const removeDay = (index: number) => {
    setDays((prev) =>
      prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })),
    );
  };

  const updateDayField = <K extends keyof DailyDevotionalInput>(
    index: number,
    field: K,
    value: DailyDevotionalInput[K],
  ) => {
    const updated = [...days];
    updated[index] = { ...updated[index], [field]: value };
    setDays(updated);
  };

  const addBibleRef = (dayIndex: number) => {
    const updated = [...days];
    updated[dayIndex].bibleReadings.push({ reference: "", isCompleted: false });
    setDays(updated);
  };

const updateBibleRef = <K extends keyof DailyBibleRef>(
  dayIndex: number,
  refIndex: number,
  field: K,
  value: DailyBibleRef[K],
) => {
  const updated = [...days];
  updated[dayIndex].bibleReadings[refIndex] = {
    ...updated[dayIndex].bibleReadings[refIndex],
    [field]: value,
  };
  setDays(updated);
};

  const removeBibleRef = (dayIndex: number, refIndex: number) => {
    const updated = [...days];
    updated[dayIndex].bibleReadings = updated[dayIndex].bibleReadings.filter(
      (_, i) => i !== refIndex,
    );
    setDays(updated);
  };

  return (
    <form action={action} className='space-y-8 max-w-4xl'>
      {/* Month Metadata Section */}
      <div className='bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4'>
        <h2 className='text-lg font-bold text-gray-900'>Monthly Details</h2>

        <div>
          <label className='block text-sm font-medium'>Month Title</label>
          <input
            name='title'
            type='text'
            placeholder='e.g. Walking in Grace'
            required
            className='w-full border p-2 rounded bg-white'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium'>Month</label>
            <input
              name='month'
              type='text'
              placeholder='e.g. April'
              required
              className='w-full border p-2 rounded bg-white'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Year</label>
            <input
              name='year'
              type='number'
              defaultValue={new Date().getFullYear()}
              required
              className='w-full border p-2 rounded bg-white'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium'>Image URL</label>
          <input
            name='imageUrl'
            type='text'
            placeholder='https://...'
            className='w-full border p-2 rounded bg-white'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>
            Monthly Description
          </label>
          <textarea
            name='description'
            rows={3}
            className='w-full border p-2 rounded bg-white'
          />
        </div>

        <div className='flex items-center gap-2'>
          <input type='checkbox' id='isPaid' name='isPaid' />
          <label htmlFor='isPaid' className='text-sm font-medium'>
            Requires Subscription (Paid)
          </label>
        </div>
      </div>

      {/* Daily Devotionals Section */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between border-b pb-2'>
          <h2 className='text-lg font-bold text-gray-900'>Daily Devotionals</h2>
          <button
            type='button'
            onClick={addDay}
            className='px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800'>
            + Add Day {days.length + 1}
          </button>
        </div>

        {days.map((dayItem, dIdx) => (
          <div
            key={dIdx}
            className='p-5 border border-gray-200 rounded-xl space-y-4 bg-white shadow-xs'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='font-bold text-sm text-gray-700'>
                Day {dayItem.day}
              </span>
              {days.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeDay(dIdx)}
                  className='text-xs text-red-600 font-semibold hover:underline'>
                  Remove Day
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-medium mb-1'>
                  Day Title
                </label>
                <input
                  type='text'
                  value={dayItem.title}
                  onChange={(e) =>
                    updateDayField(dIdx, "title", e.target.value)
                  }
                  placeholder='e.g. The Power of Faith'
                  className='w-full border p-2 rounded text-sm'
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>
                  Key Scripture Reference
                </label>
                <input
                  type='text'
                  value={dayItem.scriptureRef}
                  onChange={(e) =>
                    updateDayField(dIdx, "scriptureRef", e.target.value)
                  }
                  placeholder='e.g. Hebrews 11:1'
                  className='w-full border p-2 rounded text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-medium mb-1'>
                Reflection / Message
              </label>
              <textarea
                value={dayItem.reflection}
                onChange={(e) =>
                  updateDayField(dIdx, "reflection", e.target.value)
                }
                rows={3}
                className='w-full border p-2 rounded text-sm'
              />
            </div>

            <div>
              <label className='block text-xs font-medium mb-1'>Prayer</label>
              <textarea
                value={dayItem.prayer}
                onChange={(e) => updateDayField(dIdx, "prayer", e.target.value)}
                rows={2}
                className='w-full border p-2 rounded text-sm'
              />
            </div>

            {/* Sub-section: Daily Reading References */}
            <div className='bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2'>
              <label className='block text-xs font-bold text-gray-600'>
                Daily Bible Reading References
              </label>

              {dayItem.bibleReadings.map((refItem, rIdx) => (
                <div key={rIdx} className='flex items-center gap-2'>
                  <input
                    type='text'
                    placeholder='e.g. Genesis 1-3'
                    value={refItem.reference}
                    onChange={(e) =>
                      updateBibleRef(dIdx, rIdx, "reference", e.target.value)
                    }
                    className='flex-1 border p-1.5 rounded text-xs bg-white'
                  />
                  <label className='flex items-center gap-1 text-xs'>
                    <input
                      type='checkbox'
                      checked={refItem.isCompleted}
                      onChange={(e) =>
                        updateBibleRef(
                          dIdx,
                          rIdx,
                          "isCompleted",
                          e.target.checked,
                        )
                      }
                    />
                    Completed
                  </label>
                  {dayItem.bibleReadings.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeBibleRef(dIdx, rIdx)}
                      className='text-xs text-red-500 font-semibold'>
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type='button'
                onClick={() => addBibleRef(dIdx)}
                className='text-xs text-blue-600 font-medium hover:underline mt-1 inline-block'>
                + Add Passage
              </button>
            </div>
          </div>
        ))}
      </div>

      <input type='hidden' name='dailyReadings' value={JSON.stringify(days)} />

      <button
        type='submit'
        className='w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all'>
        Create Monthly Devotional
      </button>
    </form>
  );
}
