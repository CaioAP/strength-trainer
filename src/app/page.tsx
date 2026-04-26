import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TrainerDashboard from '@/components/trainer/TrainerDashboard';
import StudentDashboard from '@/components/student/StudentDashboard';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'trainer') {
    return <TrainerDashboard user={user} />;
  }

  return <StudentDashboard user={user} />;
}
