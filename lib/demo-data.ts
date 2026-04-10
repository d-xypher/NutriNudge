import type { MealDocument, NudgeDocument } from '@/types';

const today = new Date().toISOString().split('T')[0];

export const DEMO_MEALS: MealDocument[] = [
  {
    id: 'demo-1',
    sessionId: 'demo',
    name: 'Avocado toast with two eggs',
    category: 'breakfast',
    loggedAt: `${today}T08:15:00.000Z`,
    mood: 'good',
    energy: 'high',
  },
  {
    id: 'demo-2',
    sessionId: 'demo',
    name: 'Grilled chicken salad with quinoa',
    category: 'lunch',
    loggedAt: `${today}T12:45:00.000Z`,
    mood: 'very_good',
    energy: 'high',
  },
  {
    id: 'demo-3',
    sessionId: 'demo',
    name: 'Burger and fries',
    category: 'dinner',
    loggedAt: `${today}T19:30:00.000Z`,
    mood: 'neutral',
    energy: 'low',
  },
  {
    id: 'demo-4',
    sessionId: 'demo',
    name: 'Greek yogurt with honey',
    category: 'snack',
    loggedAt: `${today}T15:00:00.000Z`,
    mood: 'good',
    energy: 'medium',
  },
];

export const DEMO_NUDGES: NudgeDocument[] = [
  {
    id: 'demo-nudge-1',
    sessionId: 'demo',
    patternDetected: 'Energy dip after heavy dinners',
    title: 'Your dinners are dragging you down',
    body: 'You logged low energy after burger and fries last night. Try swapping heavy carbs for grilled proteins at dinner.',
    urgency: 'high',
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-nudge-2',
    sessionId: 'demo',
    patternDetected: 'Consistent breakfast habit',
    title: 'Great job with morning meals!',
    body: 'You have been eating breakfast consistently this week. Your energy levels are 40% higher on days you eat before 9 AM.',
    urgency: 'low',
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-nudge-3',
    sessionId: 'demo',
    patternDetected: 'Snacking pattern detected',
    title: 'Mid-afternoon snack is key',
    body: 'Your 3 PM yogurt snack correlates with better dinner choices. Keep this habit going — it is working.',
    urgency: 'medium',
    generatedAt: new Date().toISOString(),
  },
];
