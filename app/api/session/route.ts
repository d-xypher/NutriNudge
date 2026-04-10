import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const doc = await sessionRef.get();

    if (!doc.exists) {
      // Create new session
      await sessionRef.set({
        createdAt: FieldValue.serverTimestamp(),
        onboarding: null,
      });
      return NextResponse.json({
        sessionId,
        onboardingComplete: false,
      });
    }

    const data = doc.data();
    return NextResponse.json({
      sessionId,
      onboardingComplete: !!data?.onboarding,
    });
  } catch (error) {
    console.error('API Error /session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
