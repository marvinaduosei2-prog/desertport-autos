import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';

interface AIContext {
  vehicleId?: string;
  vehicleName?: string;
  page?: string;
  additionalContext?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'agent' | 'system';
  content: string;
  timestamp: string;
  senderName?: string;
}

type ChatStatus = 'ai' | 'pending_agent' | 'with_agent';

interface AIChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  context: AIContext;
  loading: boolean;
  sessionId: string;
  status: ChatStatus;
  agentName?: string;
  unreadCount: number; // NEW: Track unread messages
  
  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (role: ChatMessage['role'], content: string, senderName?: string) => void;
  sendMessage: (content: string, userInfo?: { userId?: string; userEmail?: string; userName?: string }) => Promise<void>;
  setContext: (context: AIContext) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setStatus: (status: ChatStatus) => void;
  setAgentName: (name: string) => void;
  initializeSession: () => void;
  closeSession: (userId?: string) => Promise<void>;
  incrementUnread: () => void; // NEW
  resetUnread: () => void; // NEW
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  isOpen: false,
  messages: [],
  context: {},
  loading: false,
  sessionId: '',
  status: 'ai',
  agentName: undefined,
  unreadCount: 0, // NEW

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => {
    set({ isOpen: true });
    // Reset unread count when opening chat
    get().resetUnread();
  },
  closeChat: () => set({ isOpen: false }),

  addMessage: (role, content, senderName) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Date.now().toString() + Math.random(),
        role,
        content,
        timestamp: new Date().toISOString(),
        senderName,
      },
    ],
  })),

  sendMessage: async (content: string, userInfo?: { userId?: string; userEmail?: string; userName?: string }) => {
    const state = get();
    
    // Add user message immediately
    state.addMessage('user', content);
    
    // Only show loading if AI is active (not if agent is handling)
    const isAgentHandling = state.status === 'with_agent' || state.status === 'pending_agent';
    if (!isAgentHandling) {
      set({ loading: true });
    }

    try {
      // Send to AI or Agent based on status
      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId: state.sessionId,
          context: state.context,
          userInfo, // Include user info
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // If agent is handling, don't show AI response
      if (data.agentHandling) {
        console.log('👤 Message sent to agent, no AI response');
        // Status remains pending_agent or with_agent
        if (data.status) {
          set({ status: data.status });
        }
        return; // Don't add AI message
      }

      // Add AI/system response only if there is one
      if (data.response) {
        state.addMessage(data.status === 'pending_agent' ? 'system' : 'assistant', data.response);
      }
      
      // Update status if changed
      if (data.status && data.status !== state.status) {
        set({ status: data.status });
      }
    } catch (error) {
      console.error('Send message error:', error);
      state.addMessage('system', 'Sorry, I encountered an error. Please try again.');
    } finally {
      set({ loading: false });
    }
  },

  setContext: (context) => set({ context }),
  clearMessages: () => set({ messages: [], status: 'ai', agentName: undefined }),
  setLoading: (loading) => set({ loading }),
  setStatus: (status) => set({ status }),
  setAgentName: (name) => set({ agentName: name }),
  
  initializeSession: () => {
    // Check if there's an existing session in localStorage
    const existingSessionId = typeof window !== 'undefined' 
      ? localStorage.getItem('chatSessionId') 
      : null;
    
    if (existingSessionId) {
      // Use existing session
      set({ sessionId: existingSessionId });
      console.log('📋 Restored chat session:', existingSessionId);
      
      // Load session info from Firestore to restore status and agent name
      if (typeof window !== 'undefined') {
        import('firebase/firestore').then(({ doc, getDoc }) => {
          import('@/lib/firebase/config').then(({ db }) => {
            getDoc(doc(db, 'chatSessions', existingSessionId)).then((sessionDoc) => {
              if (sessionDoc.exists()) {
                const sessionData = sessionDoc.data();
                console.log('📋 Restored session data:', sessionData.status, sessionData.agentName);
                set({
                  status: sessionData.status || 'ai',
                  agentName: sessionData.agentName || undefined,
                });
              }
            }).catch(err => {
              console.error('Failed to load session data:', err);
            });
          });
        });
      }
    } else {
      // Generate new session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      set({ sessionId });
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatSessionId', sessionId);
      }
      console.log('📋 Created new chat session:', sessionId);
    }
  },

  closeSession: async (userId?: string) => {
    const state = get();
    if (!state.sessionId) return;

    try {
      console.log('🔒 Closing chat session:', state.sessionId);
      
      // Call API to close session
      await fetch('/api/chat/close-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          userId,
        }),
      });

      // Clear local UI state only (keep sessionId for later restoration)
      set({ 
        messages: [], 
        status: 'ai', 
        agentName: undefined,
        unreadCount: 0, // Reset unread count
        // sessionId stays - user can resume when they sign back in!
      });

      // DON'T clear localStorage - user might want to resume this session
      // Only clear if explicitly starting a new conversation
      console.log('✅ Chat session closed (can be resumed)');
    } catch (error) {
      console.error('❌ Failed to close session:', error);
    }
  },

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),
}));
