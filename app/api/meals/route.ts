import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
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
    const { sessionId, name, category, mood, energy } = await req.json();

    if (!sessionId || !name || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await db.collection('meals').add({
      sessionId,
      name,
      category,
      mood: mood || null,
      energy: energy || null,
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
