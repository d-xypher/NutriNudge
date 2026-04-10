import React, { useMemo } from 'react';
import type { MealDocument } from '@/types';
import { Card } from '@/components/ui/card';
import { Coffee, Utensils, Moon, Apple } from 'lucide-react';

interface MealTimelineProps {
  meals: MealDocument[];
}

export default function MealTimeline({ meals }: MealTimelineProps) {
  const todaysMeals = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return meals.filter((m) => {
      if (!m.loggedAt) return false;
      return m.loggedAt.startsWith(todayStr);
    });
  }, [meals]);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-primary" />;
      case 'lunch':
        return <Utensils className="w-4 h-4 text-primary" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-primary" />;
      case 'snack':
      default:
        return <Apple className="w-4 h-4 text-primary" />;
    }
  };

  const decodeMood = (mood: string) => {
    switch (mood) {
      case 'very_low': return '😞';
      case 'low': return '😕';
      case 'neutral': return '😐';
      case 'good': return '😊';
      case 'very_good': return '😄';
      default: return '';
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">Today&apos;s Meals</h2>

      {todaysMeals.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card border-dashed">
          <p className="text-muted-foreground mb-1">No meals logged today yet.</p>
          <p className="text-sm text-muted-foreground/60">Start tracking to build your streak!</p>
        </div>
      ) : (
        <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[21px] before:w-[2px] before:bg-border">
          {todaysMeals.map((meal) => {
            const time = meal.loggedAt
              ? new Date(meal.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--';

            return (
              <div key={meal.id} className="relative flex items-start gap-4">
                <div className="absolute -left-4 w-[14px] h-[14px] rounded-full bg-primary ring-4 ring-background mt-1.5" />
                
                <Card className="flex-1 p-4 shadow-sm border-border/60 ml-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIcon(meal.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{meal.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-0.5">
                          <span className="capitalize">{meal.category}</span>
                          <span>•</span>
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-14 sm:ml-0">
                      {meal.mood && (
                        <div className="px-2 py-1 bg-muted/50 rounded-md text-sm border shadow-sm">
                          {decodeMood(meal.mood)}
                        </div>
                      )}
                      {meal.energy && (
                        <div className="px-2.5 py-1 bg-muted/50 rounded-md text-xs font-bold text-muted-foreground capitalize border shadow-sm">
                          {meal.energy} Energy
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
