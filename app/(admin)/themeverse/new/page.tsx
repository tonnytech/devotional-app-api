// app/(admin)/theme-verses/new/page.tsx
import ThemeVerseForm from "@/components/admin/ThemeVerseForm";
import { createThemeVerse } from "../actions";

export default function NewThemeVersePage() {
  return (
    <div className='p-8 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold text-[#21262B]'>Add New Theme Verse</h1>
      <ThemeVerseForm onSubmit={createThemeVerse} buttonText='Create Verse' />
    </div>
  );
}
