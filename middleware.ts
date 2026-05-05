import createMiddleware from 'next-intl/middleware';
import {locales} from './src/i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en)/:path*']
};
