Here is a comprehensive `README.md` file tailored for your **Grace Portal / Church App CMS** project.

```markdown
# Grace Portal CMS & API

A full-stack Church Content Management System (CMS) and public REST API built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

This platform allows administrators to manage monthly devotionals, daily scripture readings, blog posts, announcements, theme verses, testimonies, and events, while providing high-performance JSON API endpoints for a mobile application.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers)
* **Language:** TypeScript
* **Database & ORM:** PostgreSQL + Prisma ORM
* **Styling:** Tailwind CSS
* **Fonts:** Fraunces (Serif) & Sans-serif typography

---

## 🚀 Key Features

* **Monthly Devotionals Management:**
  * Create and edit monthly devotional volumes.
  * Define daily readings for each day of the month.
  * Add multiple daily Bible reading references with completion checkboxes per day.
* **Content Management (CMS):**
  * **Blogs:** Manage blog posts with tags, author profiles, and key takeaways.
  * **Announcements:** Post date-sensitive church announcements with importance flags and custom links.
  * **Theme Verses:** Highlight active theme verses for the church app.
  * **Testimonies:** Review, approve, and display community testimonies with like-counter capabilities.
  * **Events:** Schedule upcoming church gatherings and events with date, time, and location details.
* **Public Mobile REST API:** Dedicated `v1` endpoints for consumption by mobile applications.

---

## 📁 Project Structure

```text
├── app/
│   ├── (admin)/                     # Admin Dashboard Routes
│   │   ├── announcements/
│   │   ├── blogs/
│   │   ├── dashboard/
│   │   ├── devotionals/
│   │   ├── events/
│   │   ├── testimonies/
│   │   ├── themeverse/
│   │   └── layout.tsx
│   └── api/
│       └── v1/                      # Public Mobile API Route Handlers
│           ├── announcements/
│           ├── blogs/
│           ├── devotionals/
│           ├── events/
│           ├── testimonies/
│           └── theme-verse/
├── components/
│   ├── admin/                       # Reusable CMS Forms and UI
│   └── forms/                       # Monthly Devotional Form Components
├── lib/
│   ├── navigation.ts                # Sidebar Navigation Configuration
│   └── prisma.ts                    # Prisma Client Singleton
└── prisma/
    └── schema.prisma                # Database Schema

```

---

## 🗄️ Database Schema Overview

The system features models designed around church content lifecycle:

* **Devotional:** Represents a monthly container (`title`, `month`, `year`, `isPaid`, `isPublished`).
* **DevotionalReading:** Daily entry linked to a devotional (`day`, `title`, `reflection`, `prayer`).
* **DailyReadingRef:** Individual Bible reading checklist items (`reference`, `isCompleted`).
* **Blog:** Articles and posts (`title`, `snippet`, `content`, `author`, `takeaways`, `isPublished`).
* **Announcement:** Time-sensitive updates (`title`, `announcementDate`, `isImportant`, `link`).
* **Testimony:** User-submitted or admin-entered stories (`testifier_name`, `isApproved`, `likesCount`).
* **ThemeVerse:** Featured scriptures (`verse`, `content`, `version`, `isActive`).
* **Event:** Church calendar events (`name`, `eventDate`, `eventTime`, `location`).

---

## 🌐 Public Mobile API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/v1/devotionals` | List published monthly devotionals |
| **GET** | `/api/v1/devotionals/:id` | Get full monthly devotional with daily readings |
| **POST** | `/api/v1/devotionals/readings/:id/toggle` | Toggle Bible reference completion status |
| **GET** | `/api/v1/blogs` | Fetch published blog posts (supports `?category=`) |
| **GET** | `/api/v1/blogs/:id` | Fetch single blog post |
| **GET** | `/api/v1/announcements` | Fetch active announcements |
| **GET** | `/api/v1/testimonies` | Fetch approved testimonies |
| **POST** | `/api/v1/testimonies` | Submit a new testimony (pending approval) |
| **POST** | `/api/v1/testimonies/:id/like` | Increment like counter for a testimony |
| **GET** | `/api/v1/theme-verse` | Get active church theme verse |
| **GET** | `/api/v1/events` | Get list of upcoming events |

---

## ⚙️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd grace-portal
npm install

```

### 2. Environment Setup

Create a `.env` file in the root directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/grace_portal?schema=public"

```

### 3. Database Migration

Run Prisma migrations to generate database tables:

```bash
npx prisma migrate dev --name init

```

### 4. Run Development Server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the admin portal.

---

## 📜 License

This project is created for internal church content management and mobile app administration.

```

```