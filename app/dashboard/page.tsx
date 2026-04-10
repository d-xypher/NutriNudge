'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NudgeSection from '@/components/dashboard/NudgeSection';
import MealTimeline from '@/components/dashboard/MealTimeline';
import type { MealDocument, NudgeDocument } from '@/types';
import { DEMO_MEALS, DEMO_NUDGES } from '@/lib/demo-data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { sessionId, isLoading, onboardingComplete } = useSession();

  const [meals, setMeals] = useState<MealDocument[]>([]);
  const [nudges, setNudges] = useState<NudgeDocument[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
            // Use demo data if empty or if API failed (e.g., Firestore disabled)
            const hasMeals = mealsData.meals && mealsData.meals.length > 0;
            
            if (hasMeals) {
              setMeals(mealsData.meals);
              setNudges(nudgesData.nudges || []);
              setIsDemoMode(false);
              
              if (mealsData.meals.length >= 2 && (!nudgesData.nudges || nudgesData.nudges.length === 0)) {
                startPolling();
              }
            } else {
              setMeals(DEMO_MEALS);
              setNudges(DEMO_NUDGES);
              setIsDemoMode(true);
            }
            setDataLoaded(true);
          }
        } else {
           throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (mounted) {
          setMeals(DEMO_MEALS);
          setNudges(DEMO_NUDGES);
          setIsDemoMode(true);
          setDataLoaded(true);
        }
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
        
        {isDemoMode && dataLoaded && (
          <Alert className="mb-8 border-primary/50 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary font-medium">
              You're viewing the dashboard in Demo Mode with sample data. Once you log your own meals, this will update automatically!
            </AlertDescription>
          </Alert>
        )}

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
