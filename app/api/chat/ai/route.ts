import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, updateDoc, setDoc, getDoc, Timestamp, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Simple AI responses (no OpenAI API key needed - intelligent pattern matching)
const AI_KNOWLEDGE_BASE = {
  // Greetings
  greetings: [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'
  ],
  greetingResponse: "Hello! 👋 I'm your DesertPort Autos AI assistant. How can I help you today? I can assist with vehicle information, inquiries, pricing, shipping, or general questions!",

  // Help requests
  help: ['help', 'support', 'agent', 'human', 'talk to someone', 'representative', 'customer service'],
  
  // Vehicle queries
  vehicles: ['car', 'vehicle', 'inventory', 'stock', 'available', 'models', 'brands', 'luxury', 'sedan', 'suv'],
  vehiclesResponse: "We have a wide selection of premium vehicles! 🚗 You can browse our full inventory at /inventory. We specialize in luxury sedans, SUVs, sports cars, and more. Would you like me to help you find something specific?",

  // Pricing
  pricing: ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget', 'payment'],
  pricingResponse: "Our vehicles are competitively priced for the premium market. 💰 Prices vary based on model, year, and specifications. I'd recommend browsing our inventory or contacting us at +971 50 123 4567 for specific pricing and special offers!",

  // Shipping
  shipping: ['shipping', 'delivery', 'export', 'international', 'africa', 'ship'],
  shippingResponse: "Yes! We offer worldwide shipping, especially to African markets. 🌍 We handle all export documentation, customs clearance, and logistics. Contact us at +971 50 123 4567 or info@desertport.ae for a shipping quote!",

  // Contact
  contact: ['contact', 'phone', 'email', 'reach', 'call', 'location', 'address'],
  contactResponse: "📞 You can reach us at:\n• Phone: +971 50 123 4567\n• Email: info@desertport.ae\n• Location: Dubai, UAE\n\nOur team is available Mon-Sat, 9AM-7PM GST. Feel free to call or email anytime!",

  // Spare parts
  parts: ['spare parts', 'parts', 'accessories', 'components', 'replacement'],
  partsResponse: "We also offer genuine auto spare parts and accessories! 🔧 Check out our spare parts section or contact us for specific parts inquiries. Quality guaranteed!",
};

function analyzeIntent(message: string): { intent: string; confidence: number } {
  const lowerMessage = message.toLowerCase();
  
  // Check for escalation keywords
  if (AI_KNOWLEDGE_BASE.help.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'escalation', confidence: 1.0 };
  }
  
  // Check for greetings
  if (AI_KNOWLEDGE_BASE.greetings.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'greeting', confidence: 0.9 };
  }
  
  // Check for vehicles
  if (AI_KNOWLEDGE_BASE.vehicles.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'vehicles', confidence: 0.8 };
  }
  
  // Check for pricing
  if (AI_KNOWLEDGE_BASE.pricing.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'pricing', confidence: 0.8 };
  }
  
  // Check for shipping
  if (AI_KNOWLEDGE_BASE.shipping.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'shipping', confidence: 0.8 };
  }
  
  // Check for contact
  if (AI_KNOWLEDGE_BASE.contact.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'contact', confidence: 0.8 };
  }
  
  // Check for spare parts
  if (AI_KNOWLEDGE_BASE.parts.some(keyword => lowerMessage.includes(keyword))) {
    return { intent: 'parts', confidence: 0.8 };
  }
  
  return { intent: 'general', confidence: 0.5 };
}

function generateResponse(intent: string, userMessage: string): string {
  switch (intent) {
    case 'greeting':
      return AI_KNOWLEDGE_BASE.greetingResponse;
    case 'vehicles':
      return AI_KNOWLEDGE_BASE.vehiclesResponse;
    case 'pricing':
      return AI_KNOWLEDGE_BASE.pricingResponse;
    case 'shipping':
      return AI_KNOWLEDGE_BASE.shippingResponse;
    case 'contact':
      return AI_KNOWLEDGE_BASE.contactResponse;
    case 'parts':
      return AI_KNOWLEDGE_BASE.partsResponse;
    case 'general':
    default:
      return "I'd be happy to help! 😊 I can assist you with:\n• Vehicle inventory and specifications\n• Pricing and payment options\n• Worldwide shipping (especially to Africa)\n• Spare parts and accessories\n• General inquiries\n\nWhat would you like to know more about? Or if you'd prefer to speak with a human agent, just let me know!";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, context, userInfo } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Get or create session
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    let session = sessionDoc.exists() ? sessionDoc.data() : null;
    let isNewSession = false;
    
    // Create session if it doesn't exist
    if (!session) {
      isNewSession = true;
      session = {
        id: sessionId,
        userId: userInfo?.userId,
        userEmail: userInfo?.userEmail,
        userName: userInfo?.userName || 'Anonymous User',
        status: 'ai',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
        escalationCount: 0,
        resolved: false,
        unreadByUser: 0,
        unreadByAgent: 0,
        context: context || {},
      };
      await setDoc(sessionRef, session); // Use setDoc instead of updateDoc for new documents
    } else if (userInfo && !session.userId) {
      // Update session with user info if it was anonymous
      await updateDoc(sessionRef, {
        userId: userInfo.userId,
        userEmail: userInfo.userEmail,
        userName: userInfo.userName || 'Anonymous User',
      });
    }

    // Check for inactivity (2 minutes = 120 seconds)
    const now = Date.now();
    const lastMessageTime = session.lastMessageAt?.toMillis ? session.lastMessageAt.toMillis() : session.lastMessageAt;
    const timeSinceLastMessage = now - lastMessageTime;
    const twoMinutesInMs = 2 * 60 * 1000; // 2 minutes
    const wasInactive = !isNewSession && timeSinceLastMessage > twoMinutesInMs;

    // Save user message
    const userMessageData = {
      sessionId,
      role: 'user',
      content: message,
      timestamp: Timestamp.now(),
    };
    await addDoc(collection(db, 'chatMessages'), userMessageData);

    // 🚨 CRITICAL: If agent has taken over, AI should NOT respond!
    if (session.status === 'with_agent') {
      console.log('🚫 AI: Session is with agent, not responding. Agent will handle this.');
      
      // Just update session timestamp, no AI response
      await updateDoc(sessionRef, {
        updatedAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
        unreadByAgent: (session.unreadByAgent || 0) + 1,
      });

      return NextResponse.json({
        response: null, // No AI response
        status: 'with_agent',
        agentHandling: true,
        message: 'Your message has been sent to our support agent.',
      });
    }

    // 🚨 If pending agent, also don't respond - agent is coming
    if (session.status === 'pending_agent') {
      console.log('⏳ AI: Waiting for agent to join, not responding.');
      
      await updateDoc(sessionRef, {
        updatedAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
        unreadByAgent: (session.unreadByAgent || 0) + 1,
      });

      return NextResponse.json({
        response: null,
        status: 'pending_agent',
        agentHandling: true,
        message: 'Please wait, an agent is joining the conversation...',
      });
    }

    // If inactive, send reminder and don't trigger AI response
    if (wasInactive) {
      const reminderMessage = {
        sessionId,
        role: 'system',
        content: "⏰ We noticed you've been away for a while. Welcome back! How can I continue to assist you?",
        timestamp: Timestamp.now(),
      };
      await addDoc(collection(db, 'chatMessages'), reminderMessage);

      // Update session timestamp
      await updateDoc(sessionRef, {
        updatedAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
      });

      return NextResponse.json({
        response: reminderMessage.content,
        status: session.status,
        wasInactive: true,
      });
    }

    // Analyze intent (ONLY if status is 'ai')
    const { intent } = analyzeIntent(message);

    // Check if user is asking for human agent
    if (intent === 'escalation') {
      const newEscalationCount = (session.escalationCount || 0) + 1;
      
      if (newEscalationCount >= 3) {
        // Escalate to human agent
        await updateDoc(sessionRef, {
          status: 'pending_agent',
          escalationCount: newEscalationCount,
          updatedAt: Timestamp.now(),
          lastMessageAt: Timestamp.now(),
          unreadByAgent: (session.unreadByAgent || 0) + 1,
        });

        const escalationMessage = {
          sessionId,
          role: 'system',
          content: "I understand you'd like to speak with a human agent. I'm connecting you now... Please wait a moment, and one of our team members will join the conversation shortly. 👤",
          timestamp: Timestamp.now(),
        };
        await addDoc(collection(db, 'chatMessages'), escalationMessage);

        return NextResponse.json({
          response: escalationMessage.content,
          status: 'pending_agent',
        });
      } else {
        // Not yet escalated, acknowledge
        const aiResponse = `I understand! If you need human assistance, just ask again. (${newEscalationCount}/3 requests). For now, let me see if I can help you. What specific question do you have?`;
        
        await updateDoc(sessionRef, {
          escalationCount: newEscalationCount,
          updatedAt: Timestamp.now(),
          lastMessageAt: Timestamp.now(),
        });

        const aiMessage = {
          sessionId,
          role: 'assistant',
          content: aiResponse,
          timestamp: Timestamp.now(),
        };
        await addDoc(collection(db, 'chatMessages'), aiMessage);

        return NextResponse.json({
          response: aiResponse,
          status: 'ai',
        });
      }
    }

    // Generate AI response
    const aiResponse = generateResponse(intent, message);

    // Save AI message
    const aiMessage = {
      sessionId,
      role: 'assistant',
      content: aiResponse,
      timestamp: Timestamp.now(),
      metadata: {
        intent,
      },
    };
    await addDoc(collection(db, 'chatMessages'), aiMessage);

    // Update session
    await updateDoc(sessionRef, {
      updatedAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
    });

    return NextResponse.json({
      response: aiResponse,
      status: session.status,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}

