'use client';

import { useState, useEffect } from 'react';
import { Lock, Trash2, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/utils/validatePassword';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SubPageHeader from '@/components/ui/SubPageHeader';
import ToggleRow from '@/components/ui/ToggleRow';

export default function SecurityPrivacyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [privacy, setPrivacy] = useState({ show_history_to_trainer: true });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('show_history_to_trainer')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching privacy settings:', error);
      } else if (profile) {
        setPrivacy({ show_history_to_trainer: profile.show_history_to_trainer ?? true });
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase, router]);

  const handlePrivacyToggle = async () => {
    const newValue = !privacy.show_history_to_trainer;
    setPrivacy({ show_history_to_trainer: newValue });

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({ show_history_to_trainer: newValue }).eq('id', user?.id);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    const { newPassword, confirmPassword } = passwordData;
    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setPasswordStatus({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordStatus({ type: 'error', message: error.message });
    } else {
      setPasswordStatus({ type: 'success', message: 'Password updated successfully' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('schedule_account_deletion');
      if (error) throw error;

      await supabase.auth.signOut();
      router.push('/login?deletion_scheduled=true');
      router.refresh();
    } catch (err: any) {
      console.error('Error scheduling account deletion:', err);
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to schedule deletion' });
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen label="Loading Security..." />;

  const successIndicator = success ? (
    <div className="flex items-center gap-1.5 text-brand-primary animate-in fade-in zoom-in duration-300">
      <Check className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">Updated</span>
    </div>
  ) : undefined;

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SubPageHeader category="Settings" title="Security & Privacy" rightContent={successIndicator} />

      <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">Privacy Controls</h3>
            <p className="text-[11px] text-text-subtle/60 leading-relaxed italic">Manage who can see your training data and history.</p>
          </div>

          <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden divide-y divide-white/5">
            <ToggleRow
              label="Trainer Visibility"
              description="Allow your assigned trainer to view your full session history and RPE stats."
              checked={privacy.show_history_to_trainer}
              onToggle={handlePrivacyToggle}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">Update Password</h3>
            <p className="text-[11px] text-text-subtle/60 leading-relaxed italic">Secure your account with a strong, unique password.</p>
          </div>

          <form onSubmit={handleChangePassword} className="bg-brand-surface rounded-xl shadow-card p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-text-subtle uppercase font-black tracking-widest ml-1">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-colors shadow-card"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-text-subtle uppercase font-black tracking-widest ml-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-colors shadow-card"
                placeholder="••••••••"
              />
            </div>

            {passwordStatus && (
              <div className={`p-3 rounded text-[10px] font-bold uppercase tracking-widest text-center ${
                passwordStatus.type === 'success'
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                  : 'bg-status-error/10 text-status-error border border-status-error/20'
              }`}>
                {passwordStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || !passwordData.newPassword}
              className="w-full py-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-md font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary/20 transition-all disabled:opacity-30 shadow-card hover:shadow-card-hover"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Update Password'}
            </button>
          </form>
        </section>

        <section className="space-y-4 pt-4">
          <div className="px-1 pt-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-status-error mb-1">Danger Zone</h3>
            <p className="text-[11px] text-text-subtle/60 leading-relaxed italic">Irreversible actions regarding your account data.</p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-4 flex items-center justify-between bg-status-error/5 rounded-xl hover:bg-status-error/10 transition-all group shadow-card hover:shadow-card-hover"
          >
            <div className="text-left">
              <p className="font-bold text-status-error text-sm">Delete Account</p>
              <p className="text-[10px] text-status-error/60 mt-0.5">Permanently remove your profile and all training data.</p>
            </div>
            <Trash2 className="w-5 h-5 text-status-error opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </section>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Schedule Account Deletion?"
        message="Your account will be deactivated and scheduled for permanent deletion in 30 days. During this period, you can cancel the deletion at any time simply by logging back in. If you do not log in within 30 days, all your training history, plans, and data will be permanently and irreversibly removed."
        confirmText="Schedule Deletion"
        variant="danger"
        isLoading={saving}
      />
    </main>
  );
}
