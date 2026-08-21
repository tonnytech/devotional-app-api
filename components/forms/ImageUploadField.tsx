// src/components/forms/ImageUploadField.tsx
"use client";

import { useState } from "react";

type ImageUploadFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  folder?: string;
};

export default function ImageUploadField({
  name,
  label = "Image",
  defaultValue,
  folder = "church-cms",
}: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!signRes.ok) throw new Error("Could not get upload signature");
      const {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder: signedFolder,
      } = await signRes.json();

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", apiKey);
      uploadForm.append("timestamp", timestamp);
      uploadForm.append("signature", signature);
      uploadForm.append("folder", signedFolder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadForm },
      );
      if (!uploadRes.ok) throw new Error("Upload failed");

      const data = await uploadRes.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className='block text-sm font-medium mb-1 text-[#21262B]'>
        {label}
      </label>

      <input type='hidden' name={name} value={imageUrl} />

      {imageUrl && (
        <div className='mb-3 overflow-hidden rounded-lg border border-[#E4DFD3]'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt='' className='h-40 w-full object-cover' />
        </div>
      )}

      <label className='flex cursor-pointer items-center justify-center rounded-md border border-dashed border-[#E4DFD3] px-4 py-3 text-sm text-[#7A4E14] hover:border-[#C9922F] hover:bg-[#C9922F]/5'>
        {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          disabled={uploading}
          className='hidden'
        />
      </label>

      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  );
}
