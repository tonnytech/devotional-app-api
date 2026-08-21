// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/theme-verse(.*)",
  "/devotionals(.*)",
  "/testimonies(.*)",
  "/blogs(.*)",
  "/announcements(.*)",
]);
const isPublicApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) return; // mobile app hits these unauthenticated (GET only)
  if (isAdminRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
