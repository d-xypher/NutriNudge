'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NudgeSection from '@/components/dashboard/NudgeSection';
import MealTimeline from '@/components/dashboard/MealTimeline';
import type { MealDocument, NudgeDocument } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { sessionId, isLoading, onboardingComplete } = useSession();

  const [meals, setMeals] = useState<MealDocument[]>([]);
  const [nudges, setNudges] = useState<NudgeDocument[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !onboardingComplete) {
      router.replace('/onboarding');
    }
  }, [isLoading, onboardingComplete, router]);

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;
    let pollInterval: NodeJS.Timeout;

    const loadData = async () => {
      try {
        const [mealsRes, nudgesRes] = await Promise.all([
          fetch(`/api/meals?sessionId=${sessionId}`),
          fetch(`/api/nudges?sessionId=${sessionId}`),
        ]);

        if (mealsRes.ok && nudgesRes.ok) {
          const mealsData = await mealsRes.json();
          const nudgesData = await nudgesRes.json();
          if (mounted) {
            setMeals(mealsData.meals || []);
            setNudges(nudgesData.nudges || []);
            setDataLoaded(true);

            // If we have meals but no nudges, start polling
            if (mealsData.meals.length >= 2 && nudgesData.nudges?.length === 0) {
              startPolling();
            }
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    const startPolling = () => {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/nudges?sessionId=${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            if (mounted && data.nudges && data.nudges.length > 0) {
              setNudges(data.nudges);
              clearInterval(pollInterval); // Stop polling once we have nudges
            }
          }
        } catch (e) {
          console.error('Polling error', e);
        }
      }, 8000); // 8 seconds
    };

    loadData();

    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [sessionId]);

  if (isLoading || !onboardingComplete) return null;

  return (
    <main className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <DashboardHeader meals={meals} />
        
        <NudgeSection
          nudges={nudges}
          isLoading={!dataLoaded}
          mealCount={meals.length}
        />

        {dataLoaded && <MealTimeline meals={meals} />}
      </div>
    </main>
  );
}
