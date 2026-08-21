// src/app/(admin)/testimonies/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/admin/Header";
import { deleteTestimony, toggleApprovalStatus } from "./actions";

export const dynamic = "force-dynamic";

interface TestimoniesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function TestimoniesPage({
  searchParams,
}: TestimoniesPageProps) {
  const { status } = await searchParams;

  const whereClause =
    status === "approved"
      ? { isApproved: true }
      : status === "pending"
        ? { isApproved: false }
        : {};

  const testimonies = await prisma.testimony.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='flex-1 bg-[#FAF9F5] min-h-screen'>
      <Header title='Testimonies Moderation' />

      <main className='p-8 max-w-7xl mx-auto space-y-6'>
        {/* Top Header & Actions */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          {/* Status Filter Tabs */}
          <div className='flex items-center gap-2 bg-[#E4DFD3]/40 p-1 rounded-lg w-fit'>
            <Link
              href='/testimonies'
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !status
                  ? "bg-white text-[#21262B] shadow-sm"
                  : "text-[#21262B]/70 hover:text-[#21262B]"
              }`}>
              All
            </Link>
            <Link
              href='/testimonies?status=pending'
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                status === "pending"
                  ? "bg-white text-[#21262B] shadow-sm"
                  : "text-[#21262B]/70 hover:text-[#21262B]"
              }`}>
              Pending
            </Link>
            <Link
              href='/testimonies?status=approved'
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                status === "approved"
                  ? "bg-white text-[#21262B] shadow-sm"
                  : "text-[#21262B]/70 hover:text-[#21262B]"
              }`}>
              Approved
            </Link>
          </div>

          <Link
            href='/testimonies/new'
            className='rounded-lg bg-[#21262B] px-4 py-2 text-sm font-medium text-white hover:bg-[#C9922F] transition-colors self-start sm:self-auto'>
            + Add New Testimony
          </Link>
        </div>

        {/* Testimonies Table / List */}
        {testimonies.length === 0 ? (
          <div className='rounded-xl border border-[#E4DFD3] bg-white p-12 text-center text-[#21262B]/60'>
            No testimonies found for this filter.
          </div>
        ) : (
          <div className='space-y-4'>
            {testimonies.map((item) => {
              const testifierName =
                "testifierName" in item
                  ? (item.testifierName as string)
                  : (item as unknown as { testifier_name: string })
                      .testifier_name;

              const testifierLocation =
                "testifierLocation" in item
                  ? (item.testifierLocation as string | null)
                  : (item as unknown as { testifier_location: string | null })
                      .testifier_location;

              const toggleAction = toggleApprovalStatus.bind(
                null,
                item.id,
                item.isApproved,
              );
              const deleteAction = deleteTestimony.bind(null, item.id);

              return (
                <div
                  key={item.id}
                  className='rounded-xl border border-[#E4DFD3] bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
                  <div className='space-y-1 flex-1'>
                    <div className='flex items-center gap-3'>
                      <h3
                        className='text-base font-bold text-[#21262B]'
                        style={{ fontFamily: "var(--font-fraunces, serif)" }}>
                        {item.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.isApproved
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                        {item.isApproved ? "Approved" : "Pending Approval"}
                      </span>
                    </div>

                    <p className='text-xs text-[#21262B]/60'>
                      By <span className='font-semibold'>{testifierName}</span>
                      {testifierLocation && ` • ${testifierLocation}`} •{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <p className='text-sm text-[#21262B]/80 line-clamp-2 mt-2'>
                      {item.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-[#E4DFD3]'>
                    <form action={toggleAction}>
                      <button
                        type='submit'
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          item.isApproved
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}>
                        {item.isApproved ? "Unapprove" : "Approve"}
                      </button>
                    </form>

                    <Link
                      href={`/testimonies/${item.id}/edit`}
                      className='px-3 py-1.5 rounded-lg border border-[#E4DFD3] text-xs font-semibold text-[#21262B] hover:border-[#C9922F] transition-colors'>
                      Edit
                    </Link>

                    <form action={deleteAction}>
                      <button
                        type='submit'
                        className='px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors'>
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
