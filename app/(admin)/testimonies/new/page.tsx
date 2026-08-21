// app/(admin)/testimonies/new/page.tsx
import Link from "next/link";
import Header from "@/components/admin/Header";
import TestimonyForm from "@/components/admin/TestimonyForm";
import { createTestimony } from "../actions";

export default function NewTestimonyPage() {
  return (
    <div className='flex-1 bg-[#FAF9F5] min-h-screen'>
      <Header title='Add New Testimony' />

      <main className='p-8 max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1
              className='text-2xl font-bold text-[#21262B]'
              style={{ fontFamily: "var(--font-fraunces, serif)" }}>
              Create Testimony Entry
            </h1>
            <p className='text-sm text-[#21262B]/60 mt-1'>
              Add a new testimony manually to the platform database.
            </p>
          </div>

          <Link
            href='/testimonies'
            className='text-xs font-semibold text-[#21262B]/70 hover:text-[#21262B] underline'>
            ← Back to Testimonies
          </Link>
        </div>

        <TestimonyForm
          onSubmit={createTestimony}
          buttonText='Create Testimony'
        />
      </main>
    </div>
  );
}
