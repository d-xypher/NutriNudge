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

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
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
        console.error('Failed to save onboarding');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
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
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  goal === g ? 'border-primary ring-1 ring-primary bg-primary/5' : ''
                )}
                onClick={() => setGoal(g)}
              >
                <CardContent className="p-4 text-center font-medium">{g}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center">Any dietary restrictions?</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {RESTRICTION_CHIPS.map((chip) => (
              <Badge
                key={chip}
                variant={restrictions.includes(chip) ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 text-sm"
                onClick={() => {
                  if (chip === 'None') {
                    setRestrictions('None');
                  } else {
                    let parts = restrictions.split(', ').filter((p) => p && p !== 'None');
                    if (parts.includes(chip)) {
                      parts = parts.filter((p) => p !== chip);
                    } else {
                      parts.push(chip);
                    }
                    setRestrictions(parts.join(', '));
                  }
                }}
              >
                {chip}
              </Badge>
            ))}
          </div>
          <Input
            placeholder="e.g., Peanut allergy, Keto..."
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            className="text-center"
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
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  schedule === s ? 'border-primary ring-1 ring-primary bg-primary/5' : ''
                )}
                onClick={() => setSchedule(s)}
              >
                <CardContent className="p-4 text-center text-sm font-medium">{s}</CardContent>
              </Card>
            ))}
          </div>
        </div>
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
