// app/(admin)/announcements/new/page.tsx
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import { createAnnouncement } from "../actions";

export default function NewAnnouncementPage() {
  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Add New Announcement
        </h1>
        <p className='text-xs text-[#21262B]/60 mt-0.5'>
          Publish a new notice or event to display across your application.
        </p>
      </div>

      <AnnouncementForm
        onSubmit={createAnnouncement}
        buttonText='Create Announcement'
      />
    </div>
  );
}
