// app/(admin)/theme-verses/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleThemeVerseActive, deleteThemeVerse } from "./actions";

export const revalidate = 0; // Disable static caching for live updates

export default async function ThemeVersesPage() {
  const verses = await prisma.themeVerse.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6'>
        <div>
          <h1
            className='text-2xl font-bold text-[#21262B]'
            style={{ fontFamily: "var(--font-fraunces, serif)" }}>
            Theme Verses
          </h1>
          <p className='text-sm text-[#21262B]/60 mt-1'>
            Manage key scripture verses featured across your application.
          </p>
        </div>
        <Link
          href='/themeverse/new'
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
          Add New Verse
        </Link>
      </div>

      {/* Verses Table Container */}
      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs overflow-hidden'>
        {verses.length === 0 ? (
          <div className='p-12 text-center space-y-3'>
            <div className='w-12 h-12 rounded-full bg-[#FAF9F5] text-[#C9922F] flex items-center justify-center mx-auto border border-[#E4DFD3]'>
              <svg
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
            </div>
            <p className='text-sm font-semibold text-[#21262B]'>
              No theme verses created yet
            </p>
            <p className='text-xs text-[#21262B]/60 max-w-sm mx-auto'>
              Get started by adding your first scripture verse to feature on the
              homepage.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse text-sm'>
              <thead>
                <tr className='border-b border-[#E4DFD3] bg-[#FAF9F5]/60 text-xs font-bold uppercase tracking-wider text-[#21262B]/70'>
                  <th className='py-3.5 px-5'>Scripture</th>
                  <th className='py-3.5 px-5'>Verse Text</th>
                  <th className='py-3.5 px-5'>Version</th>
                  <th className='py-3.5 px-5'>Status</th>
                  <th className='py-3.5 px-5 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E4DFD3]/60'>
                {verses.map((verse) => (
                  <tr
                    key={verse.id}
                    className='hover:bg-[#FAF9F5]/40 transition-colors'>
                    {/* Scripture Reference */}
                    <td className='py-4 px-5 font-bold text-[#21262B] whitespace-nowrap'>
                      {verse.verse}
                    </td>

                    {/* Verse Snippet */}
                    <td className='py-4 px-5 text-[#21262B]/80 max-w-md truncate'>
                      &ldquo;{verse.content}&rdquo;
                    </td>

                    {/* Bible Version */}
                    <td className='py-4 px-5 whitespace-nowrap'>
                      <span className='inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E4DFD3]/40 text-[#21262B] uppercase'>
                        {verse.version}
                      </span>
                    </td>

                    {/* Active Status Badge & Toggle */}
                    <td className='py-4 px-5 whitespace-nowrap'>
                      <form
                        action={toggleThemeVerseActive.bind(
                          null,
                          verse.id,
                          verse.isActive,
                        )}>
                        <button
                          type='submit'
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            verse.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              verse.isActive ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {verse.isActive ? "Active" : "Inactive"}
                        </button>
                      </form>
                    </td>

                    {/* Actions Controls */}
                    <td className='py-4 px-5 text-right whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/themeverse/${verse.id}/edit`}
                          className='px-3 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
                          Edit
                        </Link>
                        <form action={deleteThemeVerse.bind(null, verse.id)}>
                          <button
                            type='submit'
                            className='px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-red-50/50 hover:bg-red-100/80 transition-all'>
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
