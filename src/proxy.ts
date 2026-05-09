import createMiddleware from "next-intl/middleware";
import {locales} from "./i18n/request";

export default createMiddleware({
  locales,
  defaultLocale: "en"
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (static files, etc.)
  // - Static assets (public folder)
  matcher: ["/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"]
};
