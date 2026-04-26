'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Activity, Settings } from 'lucide-react';
import { inviteStudent } from '@/app/actions/invite';

export default function TrainerDashboard({ user }: { user: any }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await inviteStudent(email);
      setMessage('Invite sent successfully!');
      setEmail('');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col p-4 bg-brand-secondary min-h-screen pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Strength</h1>
          <p className="text-text-subtle text-sm">Trainer Dashboard</p>
        </div>
        <button className="p-2 rounded-full hover:bg-brand-surface">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </header>

      <section className="space-y-6">
        {/* Quick Invite Card */}
        <div className="bg-brand-surface p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="text-brand-primary w-5 h-5" />
            <h2 className="text-lg font-semibold">Invite New Student</h2>
          </div>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              placeholder="student@email.com"
              required
              className="flex-1 bg-brand-secondary border border-gray-800 rounded-md p-2 text-white outline-none focus:ring-1 focus:ring-brand-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-primary text-black px-4 py-2 rounded-md font-bold text-sm disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Invite'}
            </button>
          </form>
          {message && <p className="mt-2 text-xs text-brand-accent">{message}</p>}
        </div>

        {/* Student Roster */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-accent" />
              Your Roster
            </h2>
          </div>
          
          <div className="space-y-3">
            {/* Example Student Card */}
            <div className="bg-brand-surface p-4 rounded-lg border border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">John Doe</h3>
                <p className="text-xs text-text-subtle">Last active: 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="text-brand-primary font-bold">85%</p>
                <p className="text-[10px] uppercase text-text-subtle">Compliance</p>
              </div>
            </div>
            
            <p className="text-center py-8 text-text-subtle text-sm">
              More students will appear here as they accept your invites.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-gray-800 p-2 flex justify-around items-center">
        <button className="flex flex-col items-center p-2 text-brand-primary">
          <Users className="w-6 h-6" />
          <span className="text-[10px] uppercase mt-1">Students</span>
        </button>
        <button className="flex flex-col items-center p-2 text-text-subtle">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] uppercase mt-1">Templates</span>
        </button>
      </nav>
    </main>
  );
}
