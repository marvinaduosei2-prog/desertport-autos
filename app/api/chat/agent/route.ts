import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, agentId, agentName } = await request.json();
    console.log('📥 Agent API received:', { message: message.substring(0, 50), sessionId, agentName });

    if (!message || !sessionId || !agentId || !agentName) {
      console.error('❌ Missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      console.error('❌ Session not found:', sessionId);
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionDoc.data();
    console.log('📋 Session found:', { status: session.status, agentId: session.agentId });

    // If agent is joining for the first time
    if (!session.agentId) {
      console.log('👋 Agent joining for first time');
      // Send system message
      const systemMessage = {
        sessionId,
        role: 'system',
        content: `${agentName} has joined the conversation. 👋`,
        timestamp: Timestamp.now(),
      };
      const systemMsgRef = await addDoc(collection(db, 'chatMessages'), systemMessage);
      console.log('✅ System message added:', systemMsgRef.id);

      // Update session
      await updateDoc(sessionRef, {
        status: 'with_agent',
        agentId,
        agentName,
        updatedAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
        unreadByUser: (session.unreadByUser || 0) + 1,
      });
      console.log('✅ Session updated to with_agent');
    }

    // Save agent message
    const agentMessage = {
      sessionId,
      role: 'agent',
      content: message,
      senderName: agentName,
      timestamp: Timestamp.now(),
    };
    const agentMsgRef = await addDoc(collection(db, 'chatMessages'), agentMessage);
    console.log('✅ Agent message added:', agentMsgRef.id);

    // Update session
    await updateDoc(sessionRef, {
      updatedAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
      unreadByUser: (session.unreadByUser || 0) + 1,
      unreadByAgent: 0, // Agent just read all messages
    });
    console.log('✅ Session updated');

    return NextResponse.json({ success: true, messageId: agentMsgRef.id });
  } catch (error: any) {
    console.error('❌ Agent Message Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

