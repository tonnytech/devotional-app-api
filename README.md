# Devotional App API — Grace Portal CMS

A full-stack Church Content Management System (CMS) and public REST API, built with **Next.js**, **TypeScript**, **Prisma**, **Clerk Auth**, and **Cloudinary**. Church staff manage monthly devotionals, daily scripture readings, blog posts, testimonies, announcements, and events through an authenticated admin dashboard, while a public JSON API serves that content to a companion mobile app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Server Actions, Route Handlers) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (`prisma-client` generator + `@prisma/adapter-pg`) |
| Authentication | Clerk (`@clerk/nextjs`) |
| Media Storage | Cloudinary (signed direct uploads) |
| Styling | Tailwind CSS |
| Deployment | Docker, self-hosted VPS, Watchtower, Nginx Proxy Manager |

---

## Project Structure

```
devotional-app-api/
├── app/
│   ├── (admin)/                  # Authenticated admin dashboard
│   │   ├── layout.tsx            # Sidebar + Clerk UserButton
│   │   ├── dashboard/
│   │   ├── devotionals/
│   │   │   ├── page.tsx          # List + publish toggle + delete
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/edit/page.tsx
│   │   │   └── actions.ts
│   │   ├── blogs/
│   │   ├── testimonies/
│   │   ├── announcements/
│   │   └── themeverse/
│   │
│   ├── (auth)/                   # Clerk sign-in / sign-up
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   │
│   ├── api/
│   │   ├── cloudinary/sign/route.ts   # Clerk-protected upload signatures
│   │   ├── push-token/route.ts        # Mobile push token registration
│   │   └── v1/                        # Public REST API for the mobile app
│   │       ├── devotionals/
│   │       ├── blogs/
│   │       ├── testimonies/
│   │       ├── announcements/
│   │       ├── events/
│   │       └── themeverse/
│   │
│   ├── page.tsx                  # Landing / auth gate
│   └── layout.tsx                # Root layout, ClerkProvider, fonts
│
├── components/
│   ├── admin/                    # Sidebar, Header, ImageUploadField, ReadingsManager
│   ├── forms/                    # DevotionalForm, BlogForm, MonthlyDevotionalForm
│   └── ui/                       # ConfirmModal, DeleteButton
│
├── lib/
│   ├── prisma.ts                 # Prisma Client singleton (driver adapter)
│   ├── cloudinary.ts             # Server-side Cloudinary SDK config
│   └── navigation.ts             # Sidebar route + icon config
│
├── prisma/
│   └── schema.prisma
│
├── generated/prisma/             # Prisma Client output (gitignored)
├── types/
│   └── index.ts
│
├── middleware.ts                 # Clerk route protection
├── next.config.mjs               # output: "standalone"
├── Dockerfile
├── docker-compose.yml
└── .env
```

---

## Database Schema

| Model | Purpose |
|---|---|
| `Devotional` | Monthly devotional volume — title, month, year, cover image, paid/published flags |
| `DevotionalReading` | A single day within a devotional — title, scripture reference, reflection, prayer |
| `DailyReadingRef` | Individual scripture checklist item per day, with a completion flag |
| `Blog` | Blog posts — author, category, takeaways, rich content |
| `Testimony` | Congregation testimonies — testifier name/location, approval flag, like count |
| `Announcement` | Time-sensitive updates — date, location, importance flag, external link |
| `Event` | Church calendar events — name, date, time, location |
| `ThemeVerse` | Featured scripture, one active at a time |
| `PushToken` | Registered Expo push tokens for mobile notifications |

Relations: `Devotional` → many `DevotionalReading` → many `DailyReadingRef` (cascading deletes).

---

## API Reference

### Public — `/api/v1/*`

No authentication required. Read-only, consumed by the mobile app.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/devotionals` | List published devotionals |
| GET | `/api/v1/devotionals/:id` | Single devotional with nested daily readings |
| GET | `/api/v1/blogs` | Published blog posts (`?category=` filter supported) |
| GET | `/api/v1/blogs/:id` | Single blog post |
| GET | `/api/v1/testimonies` | Approved testimonies |
| POST | `/api/v1/testimonies` | Submit a testimony (pending approval) |
| POST | `/api/v1/testimonies/:id/like` | Increment a testimony's like count |
| GET | `/api/v1/announcements` | Active announcements |
| GET | `/api/v1/events` | Upcoming events |
| GET | `/api/v1/themeverse` | Currently active theme verse |

All responses follow the shape `{ success: boolean, data: ..., count?: number }`.

### Protected — Clerk-authenticated

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cloudinary/sign` | Signed params for direct-to-Cloudinary uploads |
| POST | `/api/push-token` | Register a device's push token |

Admin dashboard mutations (create/update/delete devotionals, blogs, etc.) run as Next.js Server Actions inside `(admin)` routes, implicitly protected by `middleware.ts` rather than exposed as separate API endpoints.

---

## Environment Variables

```dotenv
# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is compiled into the client bundle at **build time** — when building via Docker, it must be passed as a `--build-arg`, not only set at container runtime.

---

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Visit `http://localhost:3000`. The root page gates unauthenticated visitors to sign-in; authenticated users land on `/dashboard`.

---

## Deployment

Deployed as a Docker container on a self-hosted VPS, alongside Nginx Proxy Manager (reverse proxy + TLS) and Watchtower (automatic image updates).

### Build

```bash
docker build -t devotional-app-api \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
  --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in \
  --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up \
  .
```

### CI/CD

`.github/workflows/deploy.yml` builds and pushes to Docker Hub (`tonnytei/devotional-app-api:latest`) on every push to `main`. Watchtower on the VPS polls for new image versions and redeploys automatically.

### Running on the VPS

```bash
docker compose up -d
```

`docker-compose.yml` connects the container to the shared `nginx_proxy_network` and reaches the VPS's native Postgres instance via `host.docker.internal` (`extra_hosts: host-gateway`).

### Database migrations against production

Run from a local machine through an SSH tunnel to the VPS, never directly against a public port:

```bash
ssh -L 5433:localhost:5432 <user>@<vps-ip>
DATABASE_URL="postgresql://<user>:<password>@localhost:5433/<database>?schema=public" npx prisma migrate deploy
```

---

## Security Notes

- Each app on the VPS uses its own scoped Postgres role (not the `postgres` superuser), limited to its own database.
- Postgres port 5432 is closed to the public internet; access is via SSH tunnel or the Docker bridge network only.
- `/api/v1/*` is intentionally public and read-only; all mutating endpoints require a valid Clerk session.

---

## License

Built for internal church content management and mobile app administration.