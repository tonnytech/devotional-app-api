// src/app/(admin)/layout.tsx
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-full bg-[#F7F5F0]'>
      <Sidebar />
      <div className='flex-1'>{children}</div>
    </div>
  );
}
