// components/admin/BlogForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BlogFormData } from "@/types";
import ImageUploadField from "./ImageUploadField";

interface BlogFormProps {
  initialData?: BlogFormData & { id?: number };
  onSubmit: (data: BlogFormData) => Promise<void>;
  buttonText: string;
}

export default function BlogForm({
  initialData,
  onSubmit,
  buttonText,
}: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    snippet: initialData?.snippet ?? "",
    author: initialData?.author ?? "",
    authorRole: initialData?.authorRole ?? "",
    blogDate: initialData?.blogDate
      ? new Date(initialData.blogDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    readTime: initialData?.readTime ?? "",
    category: initialData?.category ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    takeawaysText: Array.isArray(initialData?.takeaways)
      ? initialData.takeaways.join("\n")
      : "",
    content: initialData?.content ?? "",
    isPublished: initialData?.isPublished ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convert newlines into string array for JSON takeaways column
    const takeawaysList = formData.takeawaysText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      await onSubmit({
        title: formData.title,
        snippet: formData.snippet || null,
        author: formData.author,
        authorRole: formData.authorRole || null,
        blogDate: formData.blogDate,
        readTime: formData.readTime || null,
        category: formData.category || null,
        imageUrl: formData.imageUrl || null,
        takeaways: takeawaysList,
        content: formData.content,
        isPublished: formData.isPublished,
      });
    } catch (err) {
      console.error("Blog Submission Error:", err);
      setError(
        "Failed to save post. Please check required fields and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#E4DFD3] shadow-xs'>
      {error && (
        <div className='p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700'>
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Post Title *
        </label>
        <input
          type='text'
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='e.g. Walking in Grace: A Daily Devotional'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Author & Role */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Author Name *
          </label>
          <input
            type='text'
            required
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            placeholder='e.g. Pastor John Doe'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Author Role
          </label>
          <input
            type='text'
            value={formData.authorRole}
            onChange={(e) =>
              setFormData({ ...formData, authorRole: e.target.value })
            }
            placeholder='e.g. Senior Pastor'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>
      </div>

      {/* Date, Read Time, Category */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Blog Date *
          </label>
          <input
            type='date'
            required
            value={formData.blogDate}
            onChange={(e) =>
              setFormData({ ...formData, blogDate: e.target.value })
            }
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Read Time
          </label>
          <input
            type='text'
            value={formData.readTime}
            onChange={(e) =>
              setFormData({ ...formData, readTime: e.target.value })
            }
            placeholder='e.g. 5 min read'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
            Category
          </label>
          <input
            type='text'
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder='e.g. Faith, Leadership'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
          />
        </div>
      </div>

      {/* Image URL & Snippet */}
      {/* ADD this instead */}
      <ImageUploadField
        label='Cover Image'
        value={formData.imageUrl}
        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        folder='church-cms/blogs'
      />

      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Short Snippet / Excerpt
        </label>
        <input
          type='text'
          value={formData.snippet}
          onChange={(e) =>
            setFormData({ ...formData, snippet: e.target.value })
          }
          placeholder='Brief summary displayed on cards...'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Key Takeaways (Array input) */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-1'>
          Key Takeaways (One per line)
        </label>
        <p className='text-xs text-[#21262B]/50 mb-2'>
          Each new line becomes a distinct bullet point in the article summary.
        </p>
        <textarea
          rows={3}
          value={formData.takeawaysText}
          onChange={(e) =>
            setFormData({ ...formData, takeawaysText: e.target.value })
          }
          placeholder={"- Faith requires action\n- Grace covers all flaws"}
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm font-mono'
        />
      </div>

      {/* Main Content */}
      <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-[#21262B] mb-2'>
          Content *
        </label>
        <textarea
          required
          rows={10}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder='Write full article body...'
          className='w-full px-4 py-2.5 rounded-xl border border-[#E4DFD3] focus:border-[#C9922F] focus:outline-hidden text-sm'
        />
      </div>

      {/* Publication Toggle */}
      <div className='flex items-center gap-3 pt-2'>
        <input
          type='checkbox'
          id='isPublished'
          checked={formData.isPublished}
          onChange={(e) =>
            setFormData({ ...formData, isPublished: e.target.checked })
          }
          className='w-4 h-4 accent-[#C9922F] rounded-xs cursor-pointer'
        />
        <label
          htmlFor='isPublished'
          className='text-sm font-medium text-[#21262B] cursor-pointer'>
          Publish this post immediately
        </label>
      </div>

      {/* Form Controls */}
      <div className='flex items-center justify-end gap-3 border-t border-[#E4DFD3] pt-6'>
        <Link
          href='/blogs'
          className='px-5 py-2.5 rounded-xl border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
          Cancel
        </Link>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-2.5 rounded-xl bg-[#21262B] text-xs font-semibold text-white shadow-xs hover:bg-[#C9922F] transition-all disabled:opacity-50'>
          {loading ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
}
