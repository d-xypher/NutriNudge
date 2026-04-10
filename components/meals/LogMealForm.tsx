'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Coffee, Utensils, Moon, Apple } from 'lucide-react';

const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', icon: <Coffee className="w-5 h-5 mb-1" /> },
  { id: 'lunch', label: 'Lunch', icon: <Utensils className="w-5 h-5 mb-1" /> },
  { id: 'dinner', label: 'Dinner', icon: <Moon className="w-5 h-5 mb-1" /> },
  { id: 'snack', label: 'Snack', icon: <Apple className="w-5 h-5 mb-1" /> },
];

const MOODS = [
  { id: 'very_low', emoji: '😞' },
  { id: 'low', emoji: '😕' },
  { id: 'neutral', emoji: '😐' },
  { id: 'good', emoji: '😊' },
  { id: 'very_good', emoji: '😄' },
];

const ENERGIES = ['low', 'medium', 'high'] as const;

export default function LogMealForm() {
  const router = useRouter();
  const { sessionId } = useSession();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<typeof ENERGIES[number] | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);

    // Auto-select category based on time
    const h = now.getHours();
    if (!category) {
      if (h >= 5 && h < 11) setCategory('breakfast');
      else if (h >= 11 && h < 15) setCategory('lunch');
      else if (h >= 17 && h < 22) setCategory('dinner');
      else setCategory('snack');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter what you ate.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Log Meal
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: name.trim(),
          category,
          mood,
          energy,
          // Time is collected but stored as serverTimestamp in backend for V1.0 per spec
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to log meal');
      }

      // 2. Trigger nudge generation in background (fire and forget)
      fetch('/api/nudges/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }).catch(console.error);

      // 3. Redirect to dashboard IMMEDIATELY
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3">
        <label htmlFor="meal-name" className="text-sm font-medium">
          What did you eat?
        </label>
        <Input
          id="meal-name"
          placeholder="e.g., Avocado toast with two eggs"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
          className="text-lg py-6"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium" id="meal-category-label">
          Category
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              aria-describedby="meal-category-label"
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-xl border transition-all',
                category === cat.id
                  ? 'border-primary ring-1 ring-primary bg-primary/10 text-primary font-medium'
                  : 'bg-card text-muted-foreground hover:bg-muted/50 hover:border-border/80'
              )}
            >
              {cat.icon}
              <span className="text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="meal-time" className="text-sm font-medium">
          Time
        </label>
        <Input
          id="meal-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full sm:max-w-[200px]"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground" id="meal-mood-label">
          Mood <span className="font-normal">(Optional)</span>
        </p>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setMood(m.id)}
              aria-label={`Mood ${m.id.replace('_', ' ')}`}
              aria-pressed={mood === m.id}
              aria-describedby="meal-mood-label"
              className={cn(
                'w-12 h-12 flex items-center justify-center text-2xl rounded-full border transition-all',
                mood === m.id
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20 scale-110'
                  : 'bg-card border-border hover:bg-muted/50 saturate-50'
              )}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground" id="meal-energy-label">
          Energy Level <span className="font-normal">(Optional)</span>
        </p>
        <div className="flex divide-x border rounded-lg overflow-hidden">
          {ENERGIES.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => setEnergy(e)}
              aria-pressed={energy === e}
              aria-describedby="meal-energy-label"
              className={cn(
                'flex-1 py-2 text-sm font-medium capitalize transition-colors',
                energy === e
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger font-medium">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Log Meal'}
      </Button>
    </form>
  );
}
