'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';

async function assertRole(supabase: SupabaseClient, expectedRole: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== expectedRole) {
    throw new Error(
      expectedRole === 'admin'
        ? 'Unauthorized. Admin role required.'
        : `Only ${expectedRole}s can perform this action`
    );
  }

  return user.id;
}

export async function inviteStudent(email: string) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const callerId = await assertRole(supabase, 'trainer');

  const { data: trainerProfile } = await supabase
    .from('trainer_profiles')
    .select('id')
    .eq('user_id', callerId)
    .single();

  if (!trainerProfile) throw new Error('Trainer profile not found');

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name: 'Student', role: 'student' },
  });

  if (inviteError) throw inviteError;

  await adminClient.from('profiles').update({ role: 'student' }).eq('id', inviteData.user.id);

  const { error: profileError } = await adminClient
    .from('student_profiles')
    .insert([{ user_id: inviteData.user.id, trainer_id: trainerProfile.id }]);

  if (profileError) throw profileError;

  revalidatePath('/');
  return { success: true };
}

export async function inviteTrainer(email: string) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  await assertRole(supabase, 'admin');

  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name: 'Trainer', role: 'trainer' },
  });

  if (inviteError) throw inviteError;

  await adminClient.from('profiles').update({ role: 'trainer' }).eq('id', inviteData.user.id);

  const { error: profileError } = await adminClient
    .from('trainer_profiles')
    .insert([{ user_id: inviteData.user.id, is_approved: true, is_active: true }]);

  if (profileError) throw profileError;

  revalidatePath('/');
  return { success: true };
}
