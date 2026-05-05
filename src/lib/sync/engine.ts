import { db } from "@/lib/db/dexie";
import { createClient } from "@/lib/supabase/client";

export async function syncData(): Promise<void> {
  if (typeof window !== "undefined" && !window.navigator.onLine) {
    return;
  }

  const supabase = createClient();

  try {
    // 1. Sync Workout Executions
    const pendingExecutions = await db.workout_executions.toArray();
    for (const execution of pendingExecutions) {
      const { error } = await supabase
        .from("workout_executions")
        .upsert(execution);
      
      if (!error) {
        // In a real app, we'd mark as synced instead of deleting,
        // but for this MVP simplicity, we assume Supabase is the truth.
      }
    }

    // 2. Sync Modifications
    const pendingModifications = await db.session_param_modifications.toArray();
    for (const mod of pendingModifications) {
      const { error } = await supabase
        .from("session_param_modifications")
        .upsert(mod);
      
      if (!error) {
        // Successfully synced
      }
    }

  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Simple background sync interval (e.g., every 5 minutes if online)
if (typeof window !== "undefined") {
  setInterval(syncData, 5 * 60 * 1000);
  window.addEventListener("online", syncData);
}
