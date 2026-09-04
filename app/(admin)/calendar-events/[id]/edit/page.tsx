// app/(admin)/calendar-events/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CalendarForm from "@/components/forms/CalendarForm";
import { updateCalendarEvent } from "../../actions";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditCalendarEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);

  if (Number.isNaN(eventId)) {
    notFound();
  }

  const event = await prisma.calendarEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-6'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Edit Event
        </h1>
        <p className='text-sm text-[#21262B]/60 mt-1'>
          Update this service or event on the calendar.
        </p>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs p-6 md:p-8'>
        <CalendarForm
          submitLabel='Save changes'
          initialData={{
            title: event.title,
            description: event.description,
            location: event.location,
            startDate: toDateInputValue(event.startDate),
            endDate: toDateInputValue(event.endDate),
            allDay: event.allDay,
            eventTime: event.eventTime,
            category: event.category,
            color: event.color,
            imageUrl: event.imageUrl,
            registrationUrl: event.registrationUrl,
            isFeatured: event.isFeatured,
            isRecurring: event.isRecurring,
            recurrenceRule: event.recurrenceRule,
            recurrenceEndDate: toDateInputValue(event.recurrenceEndDate),
          }}
          onSubmit={async (data) => {
            "use server";
            await updateCalendarEvent(eventId, data);
          }}
        />
      </div>
    </div>
  );
}
