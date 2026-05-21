import createMiddleware from "next-intl/middleware";
import {routing} from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (static files, etc.)
  // - Static assets (public folder)
  matcher: ["/((?!api|auth/callback|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"]
};
