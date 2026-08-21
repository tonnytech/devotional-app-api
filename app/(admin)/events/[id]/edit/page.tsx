import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";
import { updateEvent, EventFormData } from "../../actions";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const eventId = Number(id);

  if (isNaN(eventId)) notFound();

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) notFound();

  const handleUpdate = async (data: EventFormData) => {
    "use server";
    await updateEvent(eventId, data);
  };

  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Edit Event
        </h1>
      </div>

      <EventForm
        initialData={{
          name: event.name,
          eventDate: event.eventDate.toISOString().split("T")[0],
          eventTime: event.eventTime,
          location: event.location,
        }}
        onSubmit={handleUpdate}
        buttonText='Save Changes'
      />
    </div>
  );
}
