"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Result } from "@/lib/types/common.types";

async function assertRole(supabase: SupabaseClient, expectedRole: string): Promise<Result<string>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== expectedRole) {
      return { 
        data: null, 
        error: new Error(
          expectedRole === "admin"
            ? "Unauthorized. Admin role required."
            : `Only ${expectedRole}s can perform this action`
        )
      };
    }

    return { data: user.id, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Auth assertion failed") };
  }
}

export async function inviteStudent(email: string): Promise<Result<{ success: boolean }>> {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const roleResult = await assertRole(supabase, "trainer");
    if (roleResult.error) return { data: null, error: roleResult.error };

    const callerId = roleResult.data;

    const { data: trainerProfile } = await supabase
      .from("trainer_profiles")
      .select("id")
      .eq("user_id", callerId)
      .single();

    if (!trainerProfile) return { data: null, error: new Error("Trainer profile not found") };

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: "Student", role: "student" },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    });

    if (inviteError) return { data: null, error: inviteError };
    if (!inviteData.user) return { data: null, error: new Error("Failed to create user") };

    await adminClient.from("profiles").update({ role: "student" }).eq("id", inviteData.user.id);

    const { error: profileError } = await adminClient
      .from("student_profiles")
      .insert([{ user_id: inviteData.user.id, trainer_id: trainerProfile.id }]);

    if (profileError) return { data: null, error: profileError };

    revalidatePath("/");
    return { data: { success: true }, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Student invitation failed") };
  }
}

export async function inviteTrainer(email: string): Promise<Result<{ success: boolean }>> {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const roleResult = await assertRole(supabase, "admin");
    if (roleResult.error) return { data: null, error: roleResult.error };

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: "Trainer", role: "trainer" },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    });

    if (inviteError) return { data: null, error: inviteError };
    if (!inviteData.user) return { data: null, error: new Error("Failed to create user") };

    await adminClient.from("profiles").update({ role: "trainer" }).eq("id", inviteData.user.id);

    const { error: profileError } = await adminClient
      .from("trainer_profiles")
      .insert([{ user_id: inviteData.user.id, is_approved: true, is_active: true }]);

    if (profileError) return { data: null, error: profileError };

    revalidatePath("/");
    return { data: { success: true }, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Trainer invitation failed") };
  }
}
