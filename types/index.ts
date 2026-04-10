export interface OnboardingData {
  goal: string;
  restrictions: string;
  mealSchedule: string;
}

export interface SessionDocument {
  onboarding: OnboardingData | null;
  createdAt: string;
}

export interface MealDocument {
  id: string;
  sessionId: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
  mood: string | null;
  energy: 'low' | 'medium' | 'high' | null;
}

export interface NudgeDocument {
  id: string;
  sessionId: string;
  patternDetected: string;
  title: string;
  body: string;
  urgency: 'low' | 'medium' | 'high';
  generatedAt: string;
}
