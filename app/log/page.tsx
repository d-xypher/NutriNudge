'use client';

import { useSession } from '@/components/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogMealForm from '@/components/meals/LogMealForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function LogMealPage() {
  const router = useRouter();
  const { isLoading, onboardingComplete } = useSession();

  useEffect(() => {
    if (!isLoading && !onboardingComplete) {
      router.replace('/onboarding');
    }
  }, [isLoading, onboardingComplete, router]);

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-6">
        <Button variant="ghost" className="mb-4 -ml-4" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="bg-card rounded-2xl shadow-sm border p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Log a Meal</h1>
          <LogMealForm />
        </div>
      </div>
    </main>
  );
}
