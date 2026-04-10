'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import NudgeCard from '@/components/nudges/NudgeCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { NudgeDocument } from '@/types';

export default function NudgesHistoryPage() {
  const router = useRouter();
  const { sessionId, isLoading, onboardingComplete } = useSession();
  const [nudges, setNudges] = useState<NudgeDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !onboardingComplete) {
      router.replace('/onboarding');
      return;
    }

    if (sessionId) {
      fetch(`/api/nudges?sessionId=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          setNudges(data.nudges || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sessionId, isLoading, onboardingComplete, router]);

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-6 md:pt-10">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Nudge History</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-card border shadow-sm animate-pulse" />
            ))}
          </div>
        ) : nudges.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-card border-dashed">
            <p className="text-muted-foreground">No nudges generated yet. Keep logging meals!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {nudges.map((nudge) => (
              <NudgeCard key={nudge.id} nudge={nudge} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
