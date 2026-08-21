// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className='flex min-h-full flex-1 items-center justify-center bg-[#F7F5F0] px-6 py-12'>
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-sm border border-[#E4DFD3] rounded-2xl",
            headerTitle: "text-[#21262B]",
            headerSubtitle: "text-[#21262B]/60",
            formButtonPrimary:
              "bg-[#21262B] hover:bg-[#C9922F] text-sm normal-case",
            footerActionLink: "text-[#7A4E14] hover:text-[#C9922F]",
          },
        }}
      />
    </div>
  );
}
