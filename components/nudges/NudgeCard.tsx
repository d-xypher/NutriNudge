import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NudgeDocument } from '@/types';

interface NudgeCardProps {
  nudge: NudgeDocument;
}

export default function NudgeCard({ nudge }: NudgeCardProps) {
  const urgencyColor =
    nudge.urgency === 'high'
      ? 'border-l-danger marker:bg-danger/10'
      : nudge.urgency === 'medium'
      ? 'border-l-accent'
      : 'border-l-primary';

  const badgeVariant =
    nudge.urgency === 'high'
      ? 'high'
      : nudge.urgency === 'medium'
      ? 'medium'
      : 'low';

  return (
    <Card
      className={cn(
        'overflow-hidden border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md card-shadow',
        urgencyColor
      )}
    >
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant} className="capitalize shadow-none">
            {nudge.urgency} Urgency
          </Badge>
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
            Reactive
          </span>
        </div>

        <div>
          <h4 className="font-bold text-base text-foreground leading-tight mb-1">
            {nudge.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {nudge.body}
          </p>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {nudge.patternDetected && (
            <p className="text-xs text-muted-foreground/80 font-medium">
              Pattern: {nudge.patternDetected}
            </p>
          )}
          <p className="text-xs italic text-muted-foreground/60">
            Based on your recent logged meals
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
