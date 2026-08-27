// app/(admin)/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import Header from "@/components/admin/Header";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    devotionals,
    blogs,
    testimonies,
    announcements,
    events,
    pendingTestimonies,
  ] = await Promise.all([
    prisma.devotional.count(),
    prisma.blog.count(),
    prisma.testimony.count(),
    prisma.announcement.count(),
    prisma.event.count(),
    prisma.testimony.count({ where: { isApproved: false } }),
  ]);

  return {
    devotionals,
    blogs,
    testimonies,
    announcements,
    events,
    pendingTestimonies,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Devotionals", value: stats.devotionals },
    { label: "Blog posts", value: stats.blogs },
    { label: "Testimonies", value: stats.testimonies },
    { label: "Announcements", value: stats.announcements },
    { label: "Services", value: stats.events },
  ];

  return (
    <div>
      <Header title='Dashboard' />

      <div className='p-8'>
        {stats.pendingTestimonies > 0 && (
          <div className='mb-6 rounded-lg border border-[#C9922F]/30 bg-[#C9922F]/10 px-4 py-3 text-sm text-[#7A4E14]'>
            {stats.pendingTestimonies} testimon
            {stats.pendingTestimonies === 1 ? "y" : "ies"} awaiting review.
          </div>
        )}

        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
          {cards.map((card) => (
            <div
              key={card.label}
              className='rounded-xl border border-[#E4DFD3] bg-white/70 px-5 py-6'>
              <p
                className='text-3xl text-[#21262B]'
                style={{ fontFamily: "var(--font-fraunces, serif)" }}>
                {card.value}
              </p>
              <p className='mt-1 text-sm text-[#21262B]/60'>{card.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
