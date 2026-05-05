import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TrainerDashboard from "@/components/trainer/TrainerDashboard";
import StudentDashboard from "@/components/student/StudentDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function Home(): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, scheduled_deletion_time")
    .eq("id", user.id)
    .single();

  // Handle Account Restoration
  if (profile?.scheduled_deletion_time) {
    await supabase.rpc("cancel_account_deletion");
    // We redirect to refresh the state and ensure the user knows their account is restored
    redirect("/?restored=true");
  }

  if (profile?.role === "admin") {
    return <AdminDashboard user={user} />;
  }

  if (profile?.role === "trainer") {
    return <TrainerDashboard user={user} />;
  }

  return <StudentDashboard user={user} />;
}
