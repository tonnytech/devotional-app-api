// app/(admin)/blogs/new/page.tsx
import BlogForm from "@/components/admin/BlogForm";
import { createBlog } from "../actions";

export default function NewBlogPage() {
  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Create Blog Post
        </h1>
      </div>

      <BlogForm onSubmit={createBlog} buttonText='Create Post' />
    </div>
  );
}
