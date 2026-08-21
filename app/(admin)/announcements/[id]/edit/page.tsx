// app/(admin)/announcements/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import { updateAnnouncement } from "../../actions";

interface EditAnnouncementPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({
  params,
}: EditAnnouncementPageProps) {
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({
    where: { id: Number(id) },
  });

  if (!announcement) {
    notFound();
  }

  // Bind the record ID to the update Server Action
  const bindUpdateAction = updateAnnouncement.bind(null, announcement.id);

  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Edit Announcement
        </h1>
      </div>

      <AnnouncementForm
        initialData={{
          ...announcement,
          announcementDate: announcement.announcementDate
            .toISOString()
            .split("T")[0],
          isImportant: announcement.isImportant ?? false,
        }}
        onSubmit={bindUpdateAction}
        buttonText='Update Announcement'
      />
    </div>
  );
}
