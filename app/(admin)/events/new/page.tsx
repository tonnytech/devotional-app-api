// app/(admin)/events/new/page.tsx
import EventForm from "@/components/admin/EventForm";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto space-y-6'>
      <div className='border-b border-[#E4DFD3] pb-4'>
        <h1
          className='text-2xl font-bold text-[#21262B]'
          style={{ fontFamily: "var(--font-fraunces, serif)" }}>
          Create New Event
        </h1>
      </div>
      <EventForm onSubmit={createEvent} buttonText='Create Event' />
    </div>
  );
}
