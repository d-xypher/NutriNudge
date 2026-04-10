import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { asObject, asTrimmedString, parseSessionId } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = asObject(await req.json());
    const sessionId = parseSessionId(body?.sessionId);
    const goal = asTrimmedString(body?.goal, 80);
    const restrictions = asTrimmedString(body?.restrictions, 200);
    const mealSchedule = asTrimmedString(body?.mealSchedule, 120);

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
