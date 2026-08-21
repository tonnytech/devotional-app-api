// src/components/ui/ConfirmModal.tsx
"use client";

import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#21262B]/40 px-4'
      role='presentation'
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}>
      <div
        ref={dialogRef}
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='confirm-modal-title'
        className='w-full max-w-sm rounded-2xl border border-[#E4DFD3] bg-[#F7F5F0] p-6 shadow-lg'>
        <h2
          id='confirm-modal-title'
          className='text-lg text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          {title}
        </h2>

        {description && (
          <p className='mt-2 text-sm leading-relaxed text-[#21262B]/70'>
            {description}
          </p>
        )}

        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            disabled={pending}
            className='rounded-lg px-4 py-2 text-sm font-medium text-[#21262B]/70 hover:bg-[#21262B]/5 disabled:opacity-50'>
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={pending}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#21262B] hover:bg-[#C9922F]"
            }`}>
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
