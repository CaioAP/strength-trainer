'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SubPageHeader from '@/components/ui/SubPageHeader';
import ErrorBanner from '@/components/ui/ErrorBanner';

export default function ReportBugPage() {
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'medium' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: submitError } = await supabase.from('bug_reports').insert([{
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
      }]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => router.back(), 3000);
    } catch (err: any) {
      console.error('Error reporting bug:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-brand-secondary min-h-screen">
      <SubPageHeader category="Support" title="Report a Bug" />

      <div className="p-4 flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
              <CheckCircle2 className="w-10 h-10 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Report Received!</h2>
              <p className="text-text-subtle text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">Thank you for helping us improve Strength.<br />Redirecting you back...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-1">Issue Details</h3>
                <p className="text-[11px] text-text-subtle/60 leading-relaxed italic">Describe what happened so our team can investigate.</p>
              </div>

              <div className="bg-brand-surface rounded-xl shadow-card p-5 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly describe the issue"
                    className="w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-700 shadow-card"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    required
                    placeholder="Steps to reproduce, expected vs actual behavior..."
                    rows={5}
                    className="w-full bg-brand-secondary rounded-md p-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-700 resize-none shadow-card"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest ml-1">Severity</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['low', 'medium', 'high', 'critical'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: s })}
                        className={`py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.severity === s
                            ? 'bg-brand-primary text-black shadow-[0_0_15px_rgba(206,255,5,0.4)] scale-[1.02]'
                            : 'bg-brand-secondary text-text-subtle shadow-card hover:bg-white/5 hover:scale-[1.02]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="w-full py-4 bg-brand-primary text-black rounded-md font-black uppercase text-sm tracking-widest shadow-elevated transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
