"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function useSettingsModal(): { settingsOpen: boolean; setSettingsOpen: (open: boolean) => void } {
  const searchParams = useSearchParams();
  const router = useRouter();
  const settingsOpen = searchParams.get("settings") === "true";

  const setSettingsOpen = (open: boolean): void => {
    router.push(open ? "?settings=true" : "/");
  };

  return { settingsOpen, setSettingsOpen };
}
