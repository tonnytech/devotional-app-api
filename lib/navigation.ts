// src/lib/navigation.ts
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Theme Verse", href: "/themeverse", icon: "verse" },
  { label: "Devotionals", href: "/devotionals", icon: "book" },
  { label: "Books", href: "/books", icon: "library" },
  { label: "Testimonies", href: "/testimonies", icon: "message" },
  { label: "Announcements", href: "/announcements", icon: "megaphone" },
  { label: "Services", href: "/events", icon: "church" },
  { label: "Calendar Events", href: "/calendar-events", icon: "calendar" },
];
