export function navigateBackAndRefresh(router: { back: () => void; refresh: () => void }): void {
  router.back();
  setTimeout(() => router.refresh(), 100);
}
