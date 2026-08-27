// app/(admin)/events/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteEvent } from "./actions";

export const revalidate = 0;

export default async function EventsAdminPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
  });

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6'>
        <div>
          <h1
            className='text-2xl font-bold text-[#21262B]'
            style={{ fontFamily: "var(--font-fraunces, serif)" }}>
            Services
          </h1>
          <p className='text-sm text-[#21262B]/60 mt-1'>
            Manage upcoming church gatherings and conferences.
          </p>
        </div>
        <Link
          href='/events/new'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#21262B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C9922F] transition-all shrink-0'>
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
          New Event
        </Link>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs overflow-hidden'>
        {events.length === 0 ? (
          <div className='p-12 text-center space-y-3'>
            <p className='text-sm font-semibold text-[#21262B]'>
              No events found
            </p>
            <p className='text-xs text-[#21262B]/60 max-w-sm mx-auto'>
              Create your first event to inform congregation members.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse text-sm'>
              <thead>
                <tr className='border-b border-[#E4DFD3] bg-[#FAF9F5]/60 text-xs font-bold uppercase tracking-wider text-[#21262B]/70'>
                  <th className='py-3.5 px-5'>Event Details</th>
                  <th className='py-3.5 px-5'>Date & Time</th>
                  <th className='py-3.5 px-5'>Location</th>
                  <th className='py-3.5 px-5'>Status</th>
                  <th className='py-3.5 px-5 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E4DFD3]/60'>
                {events.map((event) => {
                  const formattedDate = new Date(
                    event.eventDate,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={event.id}
                      className='hover:bg-[#FAF9F5]/40 transition-colors'>
                      <td className='py-4 px-5'>
                        <div className='flex items-center gap-3'>
                          {event.imageUrl ? (
                            <div className='relative w-12 h-12 rounded-lg overflow-hidden border border-[#E4DFD3] shrink-0 bg-gray-50'>
                              <Image
                                src={event.imageUrl}
                                alt={event.title}
                                fill
                                className='object-cover'
                              />
                            </div>
                          ) : (
                            <div className='w-12 h-12 rounded-lg border border-[#E4DFD3] bg-[#FAF9F5] flex items-center justify-center shrink-0 text-xs font-bold text-[#21262B]/40'>
                              No IMG
                            </div>
                          )}
                          <div>
                            <div className='font-bold text-[#21262B] line-clamp-1'>
                              {event.title}
                            </div>
                            {event.registrationUrl && (
                              <a
                                href={event.registrationUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-xs text-[#C9922F] hover:underline font-medium inline-block mt-0.5'>
                                Registration Link ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-5 whitespace-nowrap'>
                        <div className='font-medium text-[#21262B]'>
                          {formattedDate}
                        </div>
                        <div className='text-xs text-[#21262B]/60 mt-0.5'>
                          {event.eventTime}
                        </div>
                      </td>
                      <td className='py-4 px-5 text-[#21262B]/80 font-medium'>
                        {event.location}
                      </td>
                      <td className='py-4 px-5 whitespace-nowrap'>
                        {event.isFeatured ? (
                          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C9922F]/10 text-[#C9922F] border border-[#C9922F]/20'>
                            Featured
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                            Standard
                          </span>
                        )}
                      </td>
                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            href={`/events/${event.id}/edit`}
                            className='px-3 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:bg-[#FAF9F5] transition-all'>
                            Edit
                          </Link>
                          <form action={deleteEvent.bind(null, event.id)}>
                            <button
                              type='submit'
                              className='px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-red-50/50 hover:bg-red-100/80 transition-all cursor-pointer'>
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
