// src/components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='flex h-full w-60 flex-col border-r border-[#E4DFD3] bg-white/60'>
      <div className='px-6 py-6'>
        <span
          className='text-lg'
          style={{
            fontFamily: "var(--font-fraunces, serif)",
            color: "#21262B",
          }}>
          Grace Portal
        </span>
      </div>

      <nav className='flex-1 space-y-1 px-3'>
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[#21262B] text-white"
                  : "text-[#21262B]/70 hover:bg-[#F0ECE3] hover:text-[#21262B]"
              }`}>
              <NavIcon name={item.icon} active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='border-t border-[#E4DFD3] px-6 py-4 text-[11px] uppercase tracking-wide text-[#21262B]/40'>
        Church App CMS
      </div>
    </aside>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#F7F5F0" : "#21262B";
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x='3' y='3' width='7' height='7' rx='1' />
          <rect x='14' y='3' width='7' height='7' rx='1' />
          <rect x='3' y='14' width='7' height='7' rx='1' />
          <rect x='14' y='14' width='7' height='7' rx='1' />
        </svg>
      );
    case "verse":
      return (
        <svg {...common}>
          <path d='M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8' />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d='M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5V4.5Z' />
          <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z' />
        </svg>
      );
    case "post":
      return (
        <svg {...common}>
          <path d='M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z' />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common}>
          <path d='M3 11v2a1 1 0 0 0 1 1h2l4 5V5L6 10H4a1 1 0 0 0-1 1Z' />
          <path d='M14 8a4 4 0 0 1 0 8M17 5a8 8 0 0 1 0 14' />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
          <line x1='16' y1='2' x2='16' y2='6' />
          <line x1='8' y1='2' x2='8' y2='6' />
          <line x1='3' y1='10' x2='21' y2='10' />
        </svg>
      );
    default:
      return null;
  }
}
