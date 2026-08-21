// app/(admin)/announcements/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleAnnouncementImportant, deleteAnnouncement } from "./actions";

export const revalidate = 0;

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { announcementDate: "desc" },
  });

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6'>
        <div>
          <h1
            className='text-2xl font-bold text-[#21262B]'
            style={{ fontFamily: "var(--font-fraunces, serif)" }}>
            Announcements
          </h1>
          <p className='text-sm text-[#21262B]/60 mt-1'>
            Manage events, notices, and community updates across the platform.
          </p>
        </div>
        <Link
          href='/announcements/new'
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
          Add Announcement
        </Link>
      </div>

      {/* Announcements Table Card */}
      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs overflow-hidden'>
        {announcements.length === 0 ? (
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
                  d='M11 5.882T19.24 5a1.76 1.76 0 013.417.592l-2.147 6.15M18 13a3 3 0 100 6 3 3 0 000-6zM3 13h10'
                />
              </svg>
            </div>
            <p className='text-sm font-semibold text-[#21262B]'>
              No announcements found
            </p>
            <p className='text-xs text-[#21262B]/60 max-w-sm mx-auto'>
              Create your first announcement to display upcoming schedule
              details and updates.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse text-sm'>
              <thead>
                <tr className='border-b border-[#E4DFD3] bg-[#FAF9F5]/60 text-xs font-bold uppercase tracking-wider text-[#21262B]/70'>
                  <th className='py-3.5 px-5'>Title & Location</th>
                  <th className='py-3.5 px-5'>Date & Time</th>
                  <th className='py-3.5 px-5'>Category</th>
                  <th className='py-3.5 px-5'>Priority</th>
                  <th className='py-3.5 px-5 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E4DFD3]/60'>
                {announcements.map((item) => {
                  const formattedDate = new Date(
                    item.announcementDate,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={item.id}
                      className='hover:bg-[#FAF9F5]/40 transition-colors'>
                      {/* Title & Location */}
                      <td className='py-4 px-5'>
                        <div className='font-bold text-[#21262B]'>
                          {item.title}
                        </div>
                        {item.location && (
                          <div className='text-xs text-[#21262B]/60 mt-0.5 flex items-center gap-1'>
                            <svg
                              className='w-3 h-3 text-[#C9922F]'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                              />
                            </svg>
                            {item.location}
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className='py-4 px-5 whitespace-nowrap'>
                        <div className='font-medium text-[#21262B]'>
                          {formattedDate}
                        </div>
                        {item.time && (
                          <div className='text-xs text-[#21262B]/60 mt-0.5'>
                            {item.time}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className='py-4 px-5 whitespace-nowrap'>
                        <span className='inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E4DFD3]/40 text-[#21262B]'>
                          {item.category ?? "General"}
                        </span>
                      </td>

                      {/* Priority Toggle */}
                      <td className='py-4 px-5 whitespace-nowrap'>
                        <form
                          action={toggleAnnouncementImportant.bind(
                            null,
                            item.id,
                            item.isImportant ?? false,
                          )}>
                          <button
                            type='submit'
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              item.isImportant
                                ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                            }`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isImportant
                                  ? "bg-[#C9922F]"
                                  : "bg-gray-400"
                              }`}
                            />
                            {item.isImportant ? "Important" : "Normal"}
                          </button>
                        </form>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          {item.link && (
                            <a
                              href={item.link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='px-2.5 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B]/70 hover:bg-[#FAF9F5] hover:text-[#21262B] transition-all'
                              title='Open External Link'>
                              <svg
                                className='w-3.5 h-3.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                                />
                              </svg>
                            </a>
                          )}
                          <Link
                            href={`/announcements/${item.id}/edit`}
                            className='px-3 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
                            Edit
                          </Link>
                          <form action={deleteAnnouncement.bind(null, item.id)}>
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
