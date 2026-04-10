import React from 'react';
import NudgeCard from '@/components/nudges/NudgeCard';
import { Sparkles } from 'lucide-react';
import type { NudgeDocument } from '@/types';
import Link from 'next/link';

interface NudgeSectionProps {
  nudges: NudgeDocument[];
  isLoading: boolean;
  mealCount: number;
}

export default function NudgeSection({ nudges, isLoading, mealCount }: NudgeSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Your Insights
        </h2>
        {nudges.length > 0 && (
          <Link href="/nudges" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-card border shadow-sm animate-pulse" />
          ))}
        </div>
      ) : nudges.length === 0 ? (
        <div className="p-6 text-center border rounded-xl bg-card border-dashed">
          <p className="text-muted-foreground">
            {mealCount < 2
              ? 'Log 2 meals to unlock your first insight.'
              : 'Analyzing your meals... Insights will appear shortly.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nudges.slice(0, 3).map((nudge) => (
            <NudgeCard key={nudge.id} nudge={nudge} />
          ))}
        </div>
      )}
    </section>
  );
}
