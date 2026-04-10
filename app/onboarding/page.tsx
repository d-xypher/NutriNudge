'use client';

import { useSession } from '@/components/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const { onboardingComplete, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && onboardingComplete) {
      router.replace('/dashboard');
    }
  }, [isLoading, onboardingComplete, router]);

  if (isLoading || onboardingComplete) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <OnboardingWizard />
      </div>
    </main>
  );
}
