// src/app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className='flex min-h-full flex-1 items-center justify-center bg-[#F7F5F0] px-6'>
      <div className='relative w-full max-w-sm'>
        {/* signature glow */}
        <div
          aria-hidden
          className='pointer-events-none absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full opacity-40 blur-3xl'
          style={{
            background: "radial-gradient(circle, #C9922F 0%, transparent 70%)",
          }}
        />

        <div className='relative rounded-2xl border border-[#E4DFD3] bg-white/70 px-8 py-10 text-center shadow-sm backdrop-blur-sm'>
          <p className='mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#7A4E14]'>
            Content Studio
          </p>

          <h1
            className={`${fraunces.variable} mb-3 text-3xl text-[#21262B]`}
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Grace Portal
          </h1>

          <p className='mb-8 text-sm leading-relaxed text-[#21262B]/70'>
            Manage devotionals, blogs, testimonies, and announcements for the
            church app in one place.
          </p>

          <SignInButton mode='modal'>
            <button
              type='button'
              className='w-full rounded-lg bg-[#21262B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C9922F]'>
              Sign in to continue
            </button>
          </SignInButton>

          <div className='mt-6 flex items-center gap-3'>
            <span className='h-px flex-1 bg-[#E4DFD3]' />
            <span className='text-[11px] uppercase tracking-wide text-[#21262B]/40'>
              Staff access only
            </span>
            <span className='h-px flex-1 bg-[#E4DFD3]' />
          </div>
        </div>
      </div>
    </main>
  );
}
