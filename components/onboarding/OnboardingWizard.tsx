'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const GOALS = ['Lose Weight', 'More Energy', 'Eat Balanced', 'Manage a Condition'];

const RESTRICTION_CHIPS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

const SCHEDULES = [
  'I eat 3 regular meals',
  'I skip breakfast often',
  'I eat late at night',
  'My schedule is unpredictable',
];

export default function OnboardingWizard() {
  const router = useRouter();
  const { sessionId, setOnboardingComplete } = useSession();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [schedule, setSchedule] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRestriction = (chip: string) => {
    setError(null);
    if (chip === 'None') {
      setRestrictions('None');
      return;
    }

    const parts = restrictions
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part && part !== 'None');

    const next = parts.includes(chip) ? parts.filter((part) => part !== chip) : [...parts, chip];
    setRestrictions(next.join(', '));
  };

  const handleNext = () => {
    setError(null);
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, goal, restrictions, mealSchedule: schedule }),
      });

      if (res.ok) {
        setOnboardingComplete(true);
        router.replace('/dashboard');
      } else {
        const payload = await res.json().catch(() => null);
        setError(payload?.error || 'Failed to save onboarding');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center space-x-2" aria-label={`Onboarding step ${step} of 3`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className={cn('h-2 w-2 rounded-full', step >= i ? 'bg-primary' : 'bg-border')}
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Let&apos;s set you up</h1>
        <p className="text-muted text-sm">Help NutriNudge understand your baseline.</p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center">What&apos;s your main health goal?</h2>
          <div className="grid grid-cols-1 gap-3">
            {GOALS.map((g) => (
              <Card
                key={g}
                className={cn(goal === g ? 'border-primary ring-1 ring-primary bg-primary/5' : '')}
              >
                <button
                  type="button"
                  className="w-full rounded-xl text-left transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    setGoal(g);
                    setError(null);
                  }}
                  aria-pressed={goal === g}
                >
                <CardContent className="p-4 text-center font-medium">{g}</CardContent>
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center">Any dietary restrictions?</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {RESTRICTION_CHIPS.map((chip) => {
              const selected = restrictions
                .split(',')
                .map((part) => part.trim())
                .includes(chip);
              return (
                <button
                  type="button"
                  key={chip}
                  onClick={() => toggleRestriction(chip)}
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-pressed={selected}
                >
                  <Badge variant={selected ? 'default' : 'outline'} className="cursor-pointer px-3 py-1 text-sm">
                    {chip}
                  </Badge>
                </button>
              );
            })}
          </div>
          <Input
            placeholder="e.g., Peanut allergy, Keto..."
            value={restrictions}
            onChange={(e) => {
              setRestrictions(e.target.value);
              setError(null);
            }}
            className="text-center"
            aria-label="Dietary restrictions"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center">
            How would you describe your typical eating schedule?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCHEDULES.map((s) => (
              <Card
                key={s}
                className={cn(schedule === s ? 'border-primary ring-1 ring-primary bg-primary/5' : '')}
              >
                <button
                  type="button"
                  className="w-full rounded-xl text-left transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    setSchedule(s);
                    setError(null);
                  }}
                  aria-pressed={schedule === s}
                >
                <CardContent className="p-4 text-center text-sm font-medium">{s}</CardContent>
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger font-medium text-center">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting}>
          Back
        </Button>
        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={(step === 1 && !goal) || (step === 2 && !restrictions)}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={!schedule || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Finish'}
          </Button>
        )}
      </div>
    </div>
  );
}
