import { Timestamp } from 'firebase/firestore';

// ==================== CHAT SYSTEM ====================

export type ChatStatus = 'ai' | 'pending_agent' | 'with_agent' | 'resolved';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'agent' | 'system';
  content: string;
  timestamp: Timestamp;
  senderName?: string; // For agent messages
  metadata?: {
    model?: string;
    tokenCount?: number;
    escalationCount?: number;
  };
}

export interface ChatSession {
  id: string;
  userId?: string; // undefined for anonymous users
  userEmail?: string;
  userName?: string;
  status: ChatStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageAt: Timestamp;
  escalationCount: number; // How many times user asked for human
  agentId?: string; // Admin/agent who joined
  agentName?: string;
  context?: {
    vehicleId?: string;
    vehicleName?: string;
    page?: string;
  };
  resolved: boolean;
  unreadByUser: number; // Count of unread messages for user
  unreadByAgent: number; // Count of unread messages for agent
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
  lastMessage?: string;
}

