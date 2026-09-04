// app/(admin)/calendar-events/new/page.tsx
import CalendarForm from "@/components/forms/CalendarForm";

import { createCalendarEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-6'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          New Event
        </h1>
        <p className='text-sm text-[#21262B]/60 mt-1'>
          Add a service or event to the calendar.
        </p>
      </div>

      <div className='rounded-2xl border border-[#E4DFD3] bg-white shadow-xs p-6 md:p-8'>
        <CalendarForm
          onSubmit={async (data) => {
            "use server";
            await createCalendarEvent(data);
          }}
        />
      </div>
    </div>
  );
}
