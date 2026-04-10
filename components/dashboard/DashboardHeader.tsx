import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import StreakBadge from './StreakBadge';
import { useRouter } from 'next/navigation';
import type { MealDocument } from '@/types';

interface DashboardHeaderProps {
  meals: MealDocument[];
}

export default function DashboardHeader({ meals }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">NutriNudge</h1>
        </div>
        <p className="text-sm text-muted-foreground font-medium">Your behavioral eating coach</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <StreakBadge meals={meals} />
        <Button onClick={() => router.push('/log')} className="flex-1 sm:flex-auto shadow-sm">
          Log a Meal
        </Button>
      </div>
    </header>
  );
}
