// src/app/(admin)/devotionals/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/admin/Header";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteDevotional, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

export default async function DevotionalsPage() {
  const devotionals = await prisma.devotional.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { readings: true } } },
  });

  return (
    <div>
      <Header title='Devotionals' />

      <div className='p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <p className='text-sm text-[#21262B]/60'>
            {devotionals.length} volume{devotionals.length === 1 ? "" : "s"}
          </p>
          <Link
            href='/devotionals/new'
            className='rounded-lg bg-[#21262B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#C9922F]'>
            New Devotional
          </Link>
        </div>

        {devotionals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='overflow-hidden rounded-xl border border-[#E4DFD3] bg-white/70'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-b border-[#E4DFD3] text-[11px] uppercase tracking-wide text-[#21262B]/50'>
                  <th className='px-5 py-3 font-medium'>Title</th>
                  <th className='px-5 py-3 font-medium'>Period</th>
                  <th className='px-5 py-3 font-medium'>Readings</th>
                  <th className='px-5 py-3 font-medium'>Paid</th>
                  <th className='px-5 py-3 font-medium'>Status</th>
                  <th className='px-5 py-3 font-medium text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devotionals.map((d) => (
                  <tr
                    key={d.id}
                    className='border-b border-[#E4DFD3] last:border-0 hover:bg-[#F7F5F0]'>
                    <td className='px-5 py-4'>
                      <p className='font-medium text-[#21262B]'>{d.title}</p>
                      {d.description && (
                        <p className='mt-0.5 line-clamp-1 text-xs text-[#21262B]/50'>
                          {d.description}
                        </p>
                      )}
                    </td>
                    <td className='px-5 py-4 text-[#21262B]/70'>
                      {d.month} {d.year}
                    </td>
                    <td className='px-5 py-4 text-[#21262B]/70'>
                      {d._count.readings}
                    </td>
                    <td className='px-5 py-4'>
                      {d.isPaid ? (
                        <Badge tone='gold'>Paid</Badge>
                      ) : (
                        <Badge tone='neutral'>Free</Badge>
                      )}
                    </td>
                    <td className='px-5 py-4'>
                      <form action={togglePublish}>
                        <input type='hidden' name='id' value={d.id} />
                        <input
                          type='hidden'
                          name='current'
                          value={String(d.isPublished)}
                        />
                        <button type='submit'>
                          {d.isPublished ? (
                            <Badge tone='green'>Published</Badge>
                          ) : (
                            <Badge tone='neutral'>Draft</Badge>
                          )}
                        </button>
                      </form>
                    </td>
                    <td className='px-5 py-4'>
                      <div className='flex items-center justify-end gap-3'>
                        <Link
                          href={`/devotionals/${d.id}`}
                          className='text-[#7A4E14] hover:text-[#C9922F]'>
                          Edit
                        </Link>
                        <DeleteButton
                          id={d.id}
                          action={deleteDevotional}
                          itemLabel={d.title}
                          description={
                            d._count.readings > 0
                              ? `This will also delete all ${d._count.readings} daily reading${d._count.readings === 1 ? "" : "s"} in this volume. This can't be undone.`
                              : undefined
                          }
                        />
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

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "gold" | "neutral" | "green";
}) {
  const styles = {
    gold: "bg-[#C9922F]/15 text-[#7A4E14]",
    neutral: "bg-[#21262B]/8 text-[#21262B]/60",
    green: "bg-emerald-600/10 text-emerald-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <div className='rounded-xl border border-dashed border-[#E4DFD3] bg-white/40 px-8 py-16 text-center'>
      <p className='text-sm text-[#21262B]/60'>No devotionals yet.</p>
      <Link
        href='/devotionals/new'
        className='mt-3 inline-block text-sm font-medium text-[#7A4E14] hover:text-[#C9922F]'>
        Create your first one →
      </Link>
    </div>
  );
}
