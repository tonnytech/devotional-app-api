// app/(admin)/blogs/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleBlogPublication, deleteBlog } from "./actions";

export const revalidate = 0;

export default async function BlogsAdminPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { blogDate: "desc" },
  });

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6'>
        <div>
          <h1
            className='text-2xl font-bold text-[#21262B]'
            style={{ fontFamily: "var(--font-fraunces, serif)" }}>
            Blog Posts
          </h1>
          <p className='text-sm text-[#21262B]/60 mt-1'>
            Manage articles, authors, and publication statuses.
          </p>
        </div>
        <Link
          href='/blogs/new'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#21262B] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#C9922F] transition-all shrink-0'>
          <svg
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          New Post
        </Link>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs overflow-hidden'>
        {blogs.length === 0 ? (
          <div className='p-12 text-center space-y-3'>
            <p className='text-sm font-semibold text-[#21262B]'>
              No blog posts found
            </p>
            <p className='text-xs text-[#21262B]/60 max-w-sm mx-auto'>
              Create your first article to share devotions and announcements.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse text-sm'>
              <thead>
                <tr className='border-b border-[#E4DFD3] bg-[#FAF9F5]/60 text-xs font-bold uppercase tracking-wider text-[#21262B]/70'>
                  <th className='py-3.5 px-5'>Title & Author</th>
                  <th className='py-3.5 px-5'>Date & Read Time</th>
                  <th className='py-3.5 px-5'>Category</th>
                  <th className='py-3.5 px-5'>Status</th>
                  <th className='py-3.5 px-5 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E4DFD3]/60'>
                {blogs.map((post) => {
                  const formattedDate = new Date(
                    post.blogDate,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={post.id}
                      className='hover:bg-[#FAF9F5]/40 transition-colors'>
                      <td className='py-4 px-5'>
                        <div className='font-bold text-[#21262B]'>
                          {post.title}
                        </div>
                        <div className='text-xs text-[#21262B]/60 mt-0.5'>
                          By {post.author}{" "}
                          {post.authorRole ? `(${post.authorRole})` : ""}
                        </div>
                      </td>

                      <td className='py-4 px-5 whitespace-nowrap'>
                        <div className='font-medium text-[#21262B]'>
                          {formattedDate}
                        </div>
                        {post.readTime && (
                          <div className='text-xs text-[#21262B]/60 mt-0.5'>
                            {post.readTime}
                          </div>
                        )}
                      </td>

                      <td className='py-4 px-5 whitespace-nowrap'>
                        <span className='inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E4DFD3]/40 text-[#21262B]'>
                          {post.category ?? "General"}
                        </span>
                      </td>

                      <td className='py-4 px-5 whitespace-nowrap'>
                        <form
                          action={toggleBlogPublication.bind(
                            null,
                            post.id,
                            post.isPublished,
                          )}>
                          <button
                            type='submit'
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              post.isPublished
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            }`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.isPublished
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {post.isPublished ? "Published" : "Draft"}
                          </button>
                        </form>
                      </td>

                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            href={`/blogs/${post.id}/edit`}
                            className='px-3 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
                            Edit
                          </Link>
                          <form action={deleteBlog.bind(null, post.id)}>
                            <button
                              type='submit'
                              className='px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-red-50/50 hover:bg-red-100/80 transition-all'>
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
