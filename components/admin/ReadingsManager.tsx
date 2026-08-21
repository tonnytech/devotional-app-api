// src/components/admin/ReadingsManager.tsx
"use client";

import { useState, useTransition } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Reading = {
  id: number;
  day: number;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  prayer: string;
};

type ReadingsManagerProps = {
  devotionalId: number;
  readings: Reading[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: number, devotionalId: number) => Promise<void>;
};

export default function ReadingsManager({
  devotionalId,
  readings,
  upsertAction,
  deleteAction,
}: ReadingsManagerProps) {
  const [expandedId, setExpandedId] = useState<number | "new" | null>(null);
  const sorted = [...readings].sort((a, b) => a.day - b.day);

  return (
    <div className='mt-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2
          className='text-lg text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Daily Readings
        </h2>
        <span className='text-sm text-[#21262B]/50'>{sorted.length} days</span>
      </div>

      <div className='space-y-3'>
        {sorted.map((reading) => (
          <ReadingRow
            key={reading.id}
            devotionalId={devotionalId}
            reading={reading}
            expanded={expandedId === reading.id}
            onToggle={() =>
              setExpandedId(expandedId === reading.id ? null : reading.id)
            }
            upsertAction={upsertAction}
            deleteAction={deleteAction}
          />
        ))}

        {expandedId === "new" ? (
          <ReadingEditor
            devotionalId={devotionalId}
            upsertAction={upsertAction}
            onDone={() => setExpandedId(null)}
            suggestedDay={sorted.length ? sorted[sorted.length - 1].day + 1 : 1}
          />
        ) : (
          <button
            type='button'
            onClick={() => setExpandedId("new")}
            className='w-full rounded-lg border border-dashed border-[#E4DFD3] py-3 text-sm font-medium text-[#7A4E14] hover:border-[#C9922F] hover:bg-[#C9922F]/5'>
            + Add day
          </button>
        )}
      </div>
    </div>
  );
}

function ReadingRow({
  devotionalId,
  reading,
  expanded,
  onToggle,
  upsertAction,
  deleteAction,
}: {
  devotionalId: number;
  reading: Reading;
  expanded: boolean;
  onToggle: () => void;
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: number, devotionalId: number) => Promise<void>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteAction(reading.id, devotionalId);
      setConfirmOpen(false);
    });
  }

  return (
    <div className='rounded-lg border border-[#E4DFD3] bg-white/70'>
      <div className='flex items-center justify-between px-4 py-3'>
        <button
          type='button'
          onClick={onToggle}
          className='flex flex-1 items-center gap-3 text-left'>
          <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#21262B]/8 text-xs font-medium text-[#21262B]'>
            {reading.day}
          </span>
          <span className='text-sm font-medium text-[#21262B]'>
            {reading.title}
          </span>
          <span className='text-xs text-[#21262B]/40'>
            {reading.scriptureRef}
          </span>
        </button>

        <div className='flex items-center gap-3 pl-3'>
          <button
            type='button'
            onClick={onToggle}
            className='text-xs font-medium text-[#7A4E14] hover:text-[#C9922F]'>
            {expanded ? "Close" : "Edit"}
          </button>
          <button
            type='button'
            onClick={() => setConfirmOpen(true)}
            className='text-xs font-medium text-red-600/70 hover:text-red-600'>
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className='border-t border-[#E4DFD3] p-4'>
          <ReadingEditor
            devotionalId={devotionalId}
            reading={reading}
            upsertAction={upsertAction}
            onDone={onToggle}
          />
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={`Delete day ${reading.day}?`}
        description={`"${reading.title}" will be permanently removed from this devotional.`}
        confirmLabel='Delete'
        tone='danger'
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function ReadingEditor({
  devotionalId,
  reading,
  suggestedDay,
  upsertAction,
  onDone,
}: {
  devotionalId: number;
  reading?: Reading;
  suggestedDay?: number;
  upsertAction: (formData: FormData) => Promise<void>;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await upsertAction(formData);
      onDone();
    });
  }

  return (
    <form
      action={handleSubmit}
      className={
        reading ? "" : "rounded-lg border border-[#E4DFD3] bg-white/70 p-4"
      }>
      <input type='hidden' name='devotionalId' value={devotionalId} />
      {reading && <input type='hidden' name='readingId' value={reading.id} />}

      <div className='grid grid-cols-[100px_1fr] gap-3'>
        <div>
          <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
            Day
          </label>
          <input
            name='day'
            type='number'
            required
            defaultValue={reading?.day ?? suggestedDay}
            className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
            Title
          </label>
          <input
            name='title'
            type='text'
            required
            defaultValue={reading?.title}
            className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
            placeholder='The Source of True Wisdom'
          />
        </div>
      </div>

      <div className='mt-3'>
        <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
          Scripture Reference
        </label>
        <input
          name='scriptureRef'
          type='text'
          required
          defaultValue={reading?.scriptureRef}
          className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
          placeholder='Proverbs 2:6'
        />
      </div>

      <div className='mt-3'>
        <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
          Scripture Text
        </label>
        <textarea
          name='scriptureText'
          rows={2}
          required
          defaultValue={reading?.scriptureText}
          className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
        />
      </div>

      <div className='mt-3'>
        <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
          Reflection
        </label>
        <textarea
          name='reflection'
          rows={3}
          required
          defaultValue={reading?.reflection}
          className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
        />
      </div>

      <div className='mt-3'>
        <label className='block text-xs font-medium mb-1 text-[#21262B]/60'>
          Prayer
        </label>
        <textarea
          name='prayer'
          rows={2}
          required
          defaultValue={reading?.prayer}
          className='w-full rounded-md border border-[#E4DFD3] px-3 py-2 text-sm'
        />
      </div>

      <div className='mt-4 flex gap-3'>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-md bg-[#21262B] px-4 py-2 text-sm font-medium text-white hover:bg-[#C9922F] disabled:opacity-50'>
          {isPending ? "Saving…" : reading ? "Save day" : "Add day"}
        </button>
        <button
          type='button'
          onClick={onDone}
          className='rounded-md px-4 py-2 text-sm font-medium text-[#21262B]/60 hover:bg-[#21262B]/5'>
          Cancel
        </button>
      </div>
    </form>
  );
}
