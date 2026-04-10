import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import {
  asObject,
  asTrimmedString,
  ENERGY_LEVELS,
  isInEnum,
  MEAL_CATEGORIES,
  parseSessionId,
} from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = parseSessionId(searchParams.get('sessionId'));

    if (!sessionId) {
      return NextResponse.json({ error: 'Valid sessionId is required' }, { status: 400 });
    }

    const snapshot = await db
      .collection('meals')
      .where('sessionId', '==', sessionId)
      .orderBy('loggedAt', 'desc')
      .get();

    const meals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        loggedAt: data.loggedAt?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ meals });
  } catch (error) {
    console.error('API Error /meals GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = asObject(await req.json());
    const sessionId = parseSessionId(body?.sessionId);
    const name = asTrimmedString(body?.name, 120);
    const category = body?.category;
    const moodValue = body?.mood;
    const energyValue = body?.energy;

    const mood = moodValue == null ? null : asTrimmedString(moodValue, 40);
    const energy =
      energyValue == null
        ? null
        : isInEnum(energyValue, ENERGY_LEVELS)
        ? energyValue
        : null;

    if (!sessionId || !name || !isInEnum(category, MEAL_CATEGORIES)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await db.collection('meals').add({
      sessionId,
      name,
      category,
      mood,
      energy,
      loggedAt: FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    const data = doc.data()!;

    return NextResponse.json({
      meal: {
        id: doc.id,
        ...data,
        loggedAt: new Date().toISOString(), // Fallback for immediate UI return
      },
    });
  } catch (error) {
    console.error('API Error /meals POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
