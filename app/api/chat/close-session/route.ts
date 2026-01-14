import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
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

    // Check if session exists first
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      console.log('⚠️ Session not found, already closed or never created');
      // Return success anyway - the session is effectively closed
      return NextResponse.json({ success: true, message: 'Session already closed or not found' });
    }

    // Update session to resolved
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


