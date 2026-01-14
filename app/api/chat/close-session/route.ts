import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('🔒 Closing chat session:', sessionId, 'for user:', userId);

    // Update session to resolved
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'resolved',
      resolved: true,
      updatedAt: Timestamp.now(),
    });

    console.log('✅ Chat session closed successfully');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Close session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to close session' },
      { status: 500 }
    );
  }
}


