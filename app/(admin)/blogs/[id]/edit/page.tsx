// app/(admin)/blogs/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";
import { updateBlog } from "../../actions";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) notFound();

  const blog = await prisma.blog.findUnique({ where: { id: postId } });
  if (!blog) notFound();

  const bindUpdateAction = updateBlog.bind(null, blog.id);

  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Edit Blog Post
        </h1>
      </div>

      <BlogForm
        initialData={{
          ...blog,
          blogDate: blog.blogDate.toISOString().split("T")[0],
          takeaways: Array.isArray(blog.takeaways)
            ? (blog.takeaways as string[])
            : [],
        }}
        onSubmit={bindUpdateAction}
        buttonText='Save Changes'
      />
    </div>
  );
}
