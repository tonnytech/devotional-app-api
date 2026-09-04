// types/index.ts

export interface CalendarEventItem {
  id: number;
  title: string;
  slug: string | null;
  description: string | null;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  allDay: boolean;
  eventTime: string | null;
  category: string | null;
  color: string | null;
  imageUrl: string | null;
  registrationUrl: string | null;
  isFeatured: boolean;
  isRecurring: boolean;
  recurrenceRule: string | null;
  recurrenceEndDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CalendarEventFormData = {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string; // "YYYY-MM-DD" string for HTML date inputs
  endDate?: string | null;
  allDay?: boolean;
  eventTime?: string | null;
  category?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  isFeatured?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: string | null;
  recurrenceEndDate?: string | null; // "YYYY-MM-DD" string for HTML date inputs
};

export interface Devotional {
  id: number;
  title: string;
  month: string;
  year: number;
  description: string | null;
  imageUrl: string | null;
  isPaid: boolean;
  readings?: DevotionalReading[];
}

export interface DevotionalReading {
  day: number;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  prayer: string;
}

export type BlogFormData = {
  title: string;
  snippet?: string | null;
  author: string;
  authorRole?: string | null;
  blogDate: string; // "YYYY-MM-DD" string for HTML date inputs
  readTime?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  takeaways?: string[]; // Parsed array for form handling
  content: string;
  isPublished?: boolean;
};

export interface TestimonyItem {
  id: number;
  title: string;
  testifier_name: string;
  testifier_location: string | null;
  isApproved: boolean;
  testimonyDate: Date | string;
  readTime: string | null;
  category: string | null;
  keyVerse: string | null;
  content: string;
  likesCount?: number;
  createdAt: Date | string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  location: string | null;
  announcementDate: Date | string;
  time: string | null;
  category: string | null;
  isImportant?: boolean | null;
  description: string | null;
  link: string | null;
  createdAt: Date | string;
}

export type AnnouncementFormData = {
  title: string;
  location?: string | null;
  announcementDate: string; // Used for HTML date input (YYYY-MM-DD)
  time?: string | null;
  category?: string | null;
  isImportant?: boolean | null;
  description?: string | null;
  link?: string | null;
};

export interface UpcomingEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string;
  eventDate: Date | string;
  imageUrl: string | null;
  registrationUrl: string | null;
  isFeatured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ThemeVerseItem {
  id: number;
  verse: string;
  content: string;
  version: string;
  isActive: boolean;
  createdAt: Date | string;
}

export type ThemeVerseFormData = Omit<ThemeVerseItem, "id" | "createdAt">;
