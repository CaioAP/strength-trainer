'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-brand-secondary">
      <div className="w-full max-w-sm space-y-8 bg-brand-surface p-8 rounded-lg shadow-elevated">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary">Strength</h1>
          <p className="mt-2 text-text-subtle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-brand-secondary border border-gray-800 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full bg-brand-secondary border border-gray-800 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-status-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full touch-target bg-brand-primary text-black font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-all uppercase"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
