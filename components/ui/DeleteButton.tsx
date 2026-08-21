// src/components/ui/DeleteButton.tsx
"use client";

import { useState, useTransition } from "react";
import ConfirmModal from "./ConfirmModal";

type DeleteButtonProps = {
  id: number;
  action: (id: number) => Promise<void>;
  itemLabel: string;
  description?: string;
};

export default function DeleteButton({
  id,
  action,
  itemLabel,
  description,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action(id);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='text-red-600/70 hover:text-red-600'>
        Delete
      </button>

      <ConfirmModal
        open={open}
        title={`Delete "${itemLabel}"?`}
        description={
          description ??
          "This can't be undone. All associated content will be permanently removed."
        }
        confirmLabel='Delete'
        tone='danger'
        pending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
