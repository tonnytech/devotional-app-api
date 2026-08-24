// src/components/admin/ImageUploadField.tsx
"use client";

import { useState } from "react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "church-cms",
  required = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onChange(data.secure_url);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
        {label} {required && "*"}
      </label>

      {value && (
        <div className='mb-3 relative w-full h-40 rounded-xl overflow-hidden border border-[#E4DFD3]'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt='' className='w-full h-full object-cover' />
          <button
            type='button'
            onClick={() => onChange("")}
            className='absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/90 text-xs font-semibold text-red-600 hover:bg-white'>
            Remove
          </button>
        </div>
      )}

      <label className='flex items-center justify-center px-4 py-2.5 rounded-xl border border-dashed border-[#E4DFD3] text-xs font-semibold text-[#7A4E14] hover:border-[#C9922F] hover:bg-[#C9922F]/5 cursor-pointer transition-all'>
        {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          disabled={uploading}
          className='hidden'
        />
      </label>

      {error && <p className='mt-1.5 text-xs text-red-600'>{error}</p>}
    </div>
  );
}
