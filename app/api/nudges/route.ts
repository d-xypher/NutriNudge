import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const snapshot = await db
      .collection('nudges')
      .where('sessionId', '==', sessionId)
      .orderBy('generatedAt', 'desc')
      .limit(10)
      .get();

    const nudges = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        generatedAt: data.generatedAt?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ nudges });
  } catch (error) {
    console.error('API Error /nudges GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
