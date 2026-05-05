'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ErrorBanner from '@/components/ui/ErrorBanner';
import SuspenseLoader from '@/components/ui/SuspenseLoader';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deletionScheduled = searchParams.get('deletion_scheduled');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-primary italic font-black uppercase tracking-tighter">Strength</h1>
        <p className="mt-2 text-text-subtle text-xs font-bold uppercase tracking-widest">Sign in to your account</p>
      </div>

      {deletionScheduled && (
        <div className="bg-brand-primary/10 shadow-card p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <Info className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-tight">Account Deactivated</p>
            <p className="text-[10px] text-text-subtle mt-1 leading-relaxed">Your account is scheduled for deletion in 30 days. Log in again at any time before then to restore your data and cancel the deletion.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[10px] font-black text-text-subtle mb-1.5 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label htmlFor="password" className="block text-[10px] font-black text-text-subtle uppercase tracking-widest">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-brand-secondary shadow-card rounded-md p-3 text-white focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-primary text-black font-black rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase text-sm tracking-widest shadow-subtle active:scale-[0.98]"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary min-h-screen">
      <Suspense fallback={<SuspenseLoader />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
