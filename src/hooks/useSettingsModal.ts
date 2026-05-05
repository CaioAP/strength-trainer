'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function useSettingsModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const settingsOpen = searchParams.get('settings') === 'true';

  const setSettingsOpen = (open: boolean) => {
    router.push(open ? '?settings=true' : '/');
  };

  return { settingsOpen, setSettingsOpen };
}
