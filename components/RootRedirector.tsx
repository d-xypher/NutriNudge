'use client';

import { useSession } from '@/components/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootRedirector() {
  const { onboardingComplete, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (onboardingComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, onboardingComplete, router]);

  return <div className="animate-pulse">Loading NutriNudge...</div>;
}
