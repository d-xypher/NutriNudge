import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getGeminiModel } from '@/lib/gemini';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Fetch session data
    const sessionDoc = await db.collection('sessions').doc(sessionId).get();
    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 });
    }
    const sessionData = sessionDoc.data();
    const onboarding = sessionData?.onboarding;

    // Fetch last 10 meals
    const mealsSnapshot = await db
      .collection('meals')
      .where('sessionId', '==', sessionId)
      .orderBy('loggedAt', 'desc')
      .limit(10)
      .get();

    if (mealsSnapshot.size < 2) {
      return NextResponse.json({ nudges: [], message: 'Need more meals' });
    }

    const meals = mealsSnapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        name: d.name,
        category: d.category,
        loggedAt: d.loggedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        mood: d.mood,
        energy: d.energy,
      };
    });

    // Generate prompt
    const prompt = `
    SYSTEM:
    You are a behavioral nutrition coach. Your job is to analyze a user's meal log
    and identify real eating patterns. Generate specific, actionable nudges based
    only on what this user has actually logged. Never give generic nutrition advice.
    Be direct, warm, and concise. You must return only a valid JSON array. No prose,
    no markdown, no explanation outside the JSON.

    USER CONTEXT:
    Goal: ${onboarding?.goal || 'None specified'}
    Dietary restrictions: ${onboarding?.restrictions || 'None specified'}
    Typical meal schedule: ${onboarding?.mealSchedule || 'None specified'}

    MEAL LOG (most recent first):
    ${JSON.stringify(meals, null, 2)}

    TASK:
    Return a JSON array of 1 to 3 nudge objects. Each object must have exactly:
    {
      "pattern_detected": string,
      "nudge_title": string (max 8 words),
      "nudge_body": string (max 40 words, must reference user's actual data),
      "urgency": "low" | "medium" | "high"
    }
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean markdown block if present
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/i, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    let parsedNudges: Record<string, unknown>[] = [];
    try {
      parsedNudges = JSON.parse(text);
      if (!Array.isArray(parsedNudges)) {
        parsedNudges = [parsedNudges];
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text, parseError);
      return NextResponse.json({ nudges: [], message: 'Failed to generate nudges' });
    }

    const batch = db.batch();
    const returnedNudges = [];

    for (const item of parsedNudges) {
      const nudgeRef = db.collection('nudges').doc();
      const nudgeData = {
        sessionId,
        patternDetected: item.pattern_detected || '',
        title: item.nudge_title || '',
        body: item.nudge_body || '',
        urgency: item.urgency || 'low',
        generatedAt: FieldValue.serverTimestamp(),
      };
      batch.set(nudgeRef, nudgeData);
      returnedNudges.push({ id: nudgeRef.id, ...nudgeData, generatedAt: new Date().toISOString() });
    }

    await batch.commit();

    return NextResponse.json({ nudges: returnedNudges });
  } catch (error) {
    console.error('API Error /nudges/generate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
