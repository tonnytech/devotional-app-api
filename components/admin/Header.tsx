// src/components/admin/Header.tsx
import { UserButton } from "@clerk/nextjs";

export default function Header({ title }: { title: string }) {
  return (
    <header className='flex items-center justify-between border-b border-[#E4DFD3] bg-white/60 px-8 py-4'>
      <h1
        className='text-xl text-[#21262B]'
        style={{ fontFamily: "var(--font-fraunces, serif)" }}>
        {title}
      </h1>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "h-8 w-8",
          },
        }}
      />
    </header>
  );
}
