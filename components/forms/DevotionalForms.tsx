"use client";

import { useState } from "react";

interface ScriptureItem {
  reference: string;
  isCompleted: boolean;
}

interface InitialData {
  title?: string;
  month?: string;
  year?: number;
  description?: string;
  isPaid?: boolean;
  prayer?: string;
  bibleReadings?: ScriptureItem[];
}

interface DevotionalFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: InitialData;
  buttonText?: string;
}

export default function DevotionalForm({
  action,
  initialData,
  buttonText = "Save Devotional",
}: DevotionalFormProps) {
  const [readings, setReadings] = useState<ScriptureItem[]>(
    initialData?.bibleReadings && initialData.bibleReadings.length > 0
      ? initialData.bibleReadings
      : [{ reference: "", isCompleted: false }],
  );

  const addReadingField = () => {
    setReadings((prev) => [...prev, { reference: "", isCompleted: false }]);
  };

  const updateReference = (index: number, val: string) => {
    const updated = [...readings];
    updated[index].reference = val;
    setReadings(updated);
  };

  const toggleCompleted = (index: number) => {
    const updated = [...readings];
    updated[index].isCompleted = !updated[index].isCompleted;
    setReadings(updated);
  };

  const removeField = (index: number) => {
    setReadings((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={action} className='space-y-6'>
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

      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='isPaid'
          name='isPaid'
          defaultChecked={initialData?.isPaid ?? false}
        />
        <label htmlFor='isPaid' className='text-sm font-medium'>
          Paid Content
        </label>
      </div>

      <div>
        <label className='block text-sm font-medium'>Prayer</label>
        <textarea
          name='prayer'
          defaultValue={initialData?.prayer ?? ""}
          className='w-full border p-2 rounded'
        />
      </div>

      {/* Daily Bible Reading Section */}
      <div className='border-t pt-4 space-y-3'>
        <label className='block text-sm font-semibold'>
          Daily Bible Readings
        </label>

        {readings.map((item, index) => (
          <div key={index} className='flex items-center gap-3'>
            <input
              type='text'
              placeholder='e.g., Psalm 119:1-18'
              value={item.reference}
              onChange={(e) => updateReference(index, e.target.value)}
              className='flex-1 border p-2 rounded text-sm'
            />
            <label className='flex items-center gap-1.5 text-xs'>
              <input
                type='checkbox'
                checked={item.isCompleted}
                onChange={() => toggleCompleted(index)}
              />
              Read
            </label>
            {readings.length > 1 && (
              <button
                type='button'
                onClick={() => removeField(index)}
                className='text-xs text-red-500 hover:underline'>
                Remove
              </button>
            )}
          </div>
        ))}

        <input
          type='hidden'
          name='bibleReadings'
          value={JSON.stringify(
            readings.filter((r) => r.reference.trim() !== ""),
          )}
        />

        <button
          type='button'
          onClick={addReadingField}
          className='text-xs text-blue-600 hover:underline'>
          + Add another passage
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
