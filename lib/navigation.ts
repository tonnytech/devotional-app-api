// src/lib/navigation.ts
export type NavItem = {
  label: string;
  href: string;
  icon: "grid" | "verse" | "book" | "message" | "post" | "megaphone"| "calendar";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Theme Verse", href: "/themeverse", icon: "verse" },
  { label: "Devotionals", href: "/devotionals", icon: "book" },
  { label: "Testimonies", href: "/testimonies", icon: "message" },
  { label: "Blogs", href: "/blogs", icon: "post" },
  { label: "Announcements", href: "/announcements", icon: "megaphone" },
  { label: "Events", href: "/events", icon: "calendar" },
];
