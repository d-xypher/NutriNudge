'use client';

import React, { useMemo } from 'react';
import type { MealDocument } from '@/types';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  meals: MealDocument[];
}

export default function StreakBadge({ meals }: StreakBadgeProps) {
  const streak = useMemo(() => {
    if (!meals.length) return 0;

    // Build a set of date strings (YYYY-MM-DD)
    const activeDates = new Set<string>();
    meals.forEach((m) => {
      if (m.loggedAt) {
        const d = new Date(m.loggedAt);
        if (!isNaN(d.getTime())) {
          activeDates.add(d.toISOString().split('T')[0]);
        }
      }
    });

    let currentStreak = 0;
    const today = new Date();
    
    // Check backwards from today to see consecutive days
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      if (activeDates.has(dateStr)) {
        currentStreak++;
      } else {
        // If yesterday or earlier is missing, streak breaks.
        // If today is missing, we don't break the streak YET if yesterday was active.
        if (i > 0) {
          break;
        }
      }
    }

    return currentStreak;
  }, [meals]);

  if (streak === 0) {
    return (
      <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
        Start your streak today
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full">
      <Flame className="w-4 h-4 fill-orange-500" />
      {streak} day streak
    </div>
  );
}
