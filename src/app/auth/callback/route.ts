import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/set-password`);
    }
    // Code already consumed (user revisiting link) — check for existing session in cookies.
    // If session is still valid, allow them back to set-password without re-exchanging.
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      return NextResponse.redirect(`${origin}/set-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
