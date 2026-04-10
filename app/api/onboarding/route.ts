import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, goal, restrictions, mealSchedule } = await req.json();

    if (!sessionId || !goal || !restrictions || !mealSchedule) {
      return NextResponse.json({ error: 'Missing required onboarding fields' }, { status: 400 });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    await sessionRef.update({
      onboarding: {
        goal,
        restrictions,
        mealSchedule,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /onboarding:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
