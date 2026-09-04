// app/(admin)/books/[id]/reviews/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { approveReview, deleteReview } from "../../actions";
import DeleteButton from "@/components/ui/DeleteButton";

export const revalidate = 0;

export default async function BookReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!book) notFound();

  const pending = book.reviews.filter((r) => !r.isApproved);
  const approved = book.reviews.filter((r) => r.isApproved);

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6'>
        <div>
          <Link
            href='/books'
            className='text-xs font-semibold text-[#21262B]/60 hover:text-[#C9922F] transition-colors'>
            ← Back to Books
          </Link>
          <h1
            className='text-2xl font-bold text-[#21262B] mt-2'
            style={{ fontFamily: "var(--font-fraunces, serif)" }}>
            {book.title}
          </h1>
          <p className='text-sm text-[#21262B]/60 mt-1'>
            By {book.author} · {book.reviews.length} review
            {book.reviews.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className='space-y-3'>
          <h2 className='text-sm font-bold uppercase tracking-wider text-[#21262B]/70'>
            Pending ({pending.length})
          </h2>
          <div className='space-y-3'>
            {pending.map((review) => (
              <div
                key={review.id}
                className='rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs p-5'>
                <div className='flex items-start justify-between gap-4 mb-2'>
                  <div>
                    <div className='font-bold text-[#21262B]'>
                      {review.reviewerName}
                      {review.reviewerLocation && (
                        <span className='font-normal text-[#21262B]/60'>
                          {" "}
                          · {review.reviewerLocation}
                        </span>
                      )}
                    </div>
                    <div className='text-[#C9922F] text-sm mt-0.5'>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className='shrink-0 inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200'>
                    Pending
                  </span>
                </div>

                {review.title && (
                  <p className='font-semibold text-[#21262B] text-sm mb-1'>
                    {review.title}
                  </p>
                )}
                <p className='text-sm text-[#21262B]/80 mb-4'>
                  {review.content}
                </p>

                <div className='flex items-center gap-2'>
                  <form action={approveReview.bind(null, review.id)}>
                    <button
                      type='submit'
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all'>
                      Approve
                    </button>
                  </form>
                  <DeleteButton
                    id={review.id}
                    action={deleteReview}
                    itemLabel={`review by ${review.reviewerName}`}
                    description="This can't be undone. The review will be permanently removed."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='space-y-3'>
        <h2 className='text-sm font-bold uppercase tracking-wider text-[#21262B]/70'>
          Approved ({approved.length})
        </h2>

        {approved.length === 0 ? (
          <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs p-8 text-center'>
            <p className='text-sm text-[#21262B]/60'>
              No approved reviews yet.
            </p>
          </div>
        ) : (
          <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs divide-y divide-[#E4DFD3]/60'>
            {approved.map((review) => (
              <div key={review.id} className='p-5'>
                <div className='flex items-start justify-between gap-4 mb-2'>
                  <div>
                    <div className='font-bold text-[#21262B]'>
                      {review.reviewerName}
                      {review.reviewerLocation && (
                        <span className='font-normal text-[#21262B]/60'>
                          {" "}
                          · {review.reviewerLocation}
                        </span>
                      )}
                    </div>
                    <div className='text-[#C9922F] text-sm mt-0.5'>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className='shrink-0 text-xs text-[#21262B]/50'>
                    {review.likesCount} likes
                  </span>
                </div>

                {review.title && (
                  <p className='font-semibold text-[#21262B] text-sm mb-1'>
                    {review.title}
                  </p>
                )}
                <p className='text-sm text-[#21262B]/80 mb-3'>
                  {review.content}
                </p>

                <DeleteButton
                  id={review.id}
                  action={deleteReview}
                  itemLabel={`review by ${review.reviewerName}`}
                  description="This can't be undone. The review will be permanently removed."
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
