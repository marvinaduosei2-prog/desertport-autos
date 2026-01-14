'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, User } from 'lucide-react';
import { useAIChatStore } from '@/stores/ai-chat-store';
import { useAuthStore } from '@/stores/auth-store';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { playNotificationSoundAdvanced } from '@/lib/notification-sound';

interface AIChatWidgetProps {
  context?: {
    vehicleId?: string;
    vehicleName?: string;
    page?: string;
    additionalContext?: string;
  };
}

export function AIChatWidget({ context }: AIChatWidgetProps) {
  const {
    isOpen,
    messages,
    loading,
    status,
    agentName,
    sessionId,
    unreadCount,
    toggleChat,
    closeChat,
    sendMessage,
    setContext,
    addMessage,
    setStatus,
    setAgentName,
    initializeSession,
    incrementUnread,
    resetUnread,
  } = useAIChatStore();

  const { user, userData } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [sessionId, initializeSession]);

  // Load existing messages when session is initialized
  useEffect(() => {
    if (!sessionId || !isOpen) return;

    const loadExistingMessages = async () => {
      try {
        console.log('📋 Loading existing messages for session:', sessionId);
        const messagesRef = collection(db, 'chatMessages');
        const q = query(
          messagesRef,
          where('sessionId', '==', sessionId),
          orderBy('timestamp', 'asc')
        );

        const snapshot = await getDocs(q);
        const existingMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            role: data.role,
            content: data.content,
            timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
            senderName: data.senderName,
          };
        });

        if (existingMessages.length > 0) {
          console.log('📋 Found', existingMessages.length, 'existing messages');
          
          // Clear current messages and load from Firebase
          useAIChatStore.setState({ messages: [] });
          
          existingMessages.forEach(msg => {
            addMessage(msg.role, msg.content, msg.senderName);
          });
          
          console.log('✅ Loaded', existingMessages.length, 'messages into chat');
        } else {
          console.log('📋 No existing messages found for this session');
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error);
      }
    };

    loadExistingMessages();
  }, [sessionId, isOpen, addMessage]);

  // Update context when it changes
  useEffect(() => {
    if (context) {
      setContext(context);
    }
  }, [context, setContext]);

  // Listen to real-time messages from agent
  useEffect(() => {
    if (!sessionId) return; // Listen even when closed for notifications

    const messagesRef = collection(db, 'chatMessages');
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    // Track if this is the initial snapshot (to avoid counting old messages as new)
    let isInitialSnapshot = true;

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        console.log('💬 Client: Received', snapshot.docChanges().length, 'message changes');
        
        // Skip notifications for initial load
        if (isInitialSnapshot) {
          console.log('📋 Initial snapshot, skipping notifications');
          isInitialSnapshot = false;
          return; // Don't process initial messages for notifications
        }
        
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const messageData = change.doc.data();
            console.log('📥 New message:', messageData.role, messageData.content.substring(0, 50));
            
            // Only process messages from agent or system (not user/assistant as they're already added locally)
            if (messageData.role === 'agent' || messageData.role === 'system') {
              console.log('✅ Adding agent/system message to UI');
              
              // Add message to UI
              addMessage(
                messageData.role,
                messageData.content,
                messageData.senderName
              );
              
              // If chat is closed, increment unread count and play sound
              if (!isOpen) {
                console.log('🔔 Chat closed, showing notification');
                incrementUnread();
                playNotificationSoundAdvanced();
              }
              
              // Update agent name when they join
              if (messageData.role === 'system' && messageData.content.includes('joined the conversation')) {
                const extractedName = messageData.content.split(' has joined')[0];
                console.log('👋 Agent joined:', extractedName);
                setAgentName(extractedName);
                setStatus('with_agent');
              }
            }
          }
        });
      },
      (error) => {
        console.error('🚨 Client: Error listening to messages:', error.code, error.message);
        if (error.code === 'failed-precondition') {
          console.error('⚠️ INDEX MISSING! See FIX_CHAT_NOW.md');
        }
      }
    );

    return () => unsubscribe();
  }, [sessionId, isOpen, addMessage, setAgentName, setStatus, incrementUnread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;

    if (!message.trim() || loading) return;

    // Clear input
    e.currentTarget.reset();

    // Send message with user info
    const userInfo = user ? {
      userId: user.uid,
      userEmail: user.email || undefined,
      userName: userData?.displayName || user.displayName || undefined,
    } : undefined;

    await sendMessage(message, userInfo);
  };

  return (
    <>
      {/* Floating Button - Glass Effect with Smart Border */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 group"
            style={{
              background: 'rgba(132, 204, 22, 0.9)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(132, 204, 22, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'fixed', // Force fixed positioning
              bottom: '2rem', // 2rem from bottom (below floating video at 8rem)
              right: '1.5rem', // Explicit right
            }}
          >
            <MessageCircle size={28} className="text-black drop-shadow-sm" />
            
            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - Premium Glass Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)]"
            style={{
              position: 'fixed', // Force fixed positioning
              bottom: '2rem', // 2rem from bottom (matches button)
              right: '1.5rem', // Explicit right
            }}
          >
            <div 
              className="h-full flex flex-col rounded-3xl backdrop-blur-2xl overflow-hidden"
              style={{
                background: 'rgba(10, 10, 10, 0.85)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center shadow-lg">
                    {status === 'with_agent' ? (
                      <User size={20} className="text-black" />
                    ) : (
                      <MessageCircle size={20} className="text-black" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      {status === 'with_agent' && agentName ? agentName : 'AI Concierge'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {status === 'pending_agent' ? 'Connecting to agent...' : 
                       status === 'with_agent' ? 'Live Support' : 
                       'Always here to help'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeChat}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Context Badge */}
              {context?.vehicleName && (
                <div className="px-4 py-2 bg-lime-500/10 border-b border-white/5">
                  <p className="text-xs text-lime-400">
                    Context: <span className="font-semibold">{context.vehicleName}</span>
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 mt-8">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm font-semibold">Start a conversation!</p>
                    <p className="text-xs mt-2 opacity-70">
                      I can help you with vehicle information, inquiries, and more.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 
                      msg.role === 'system' ? 'justify-center' : 
                      'justify-start'
                    }`}
                  >
                    {msg.role === 'system' ? (
                      <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <p className="text-xs text-gray-400 text-center">{msg.content}</p>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.role === 'user'
                            ? 'bg-lime-500 text-black font-medium'
                            : 'bg-white/5 text-white border border-white/10'
                        }`}
                        style={{
                          backdropFilter: msg.role !== 'user' ? 'blur(10px)' : 'none'
                        }}
                      >
                        {msg.role === 'agent' && msg.senderName && (
                          <p className="text-xs text-lime-400 font-bold mb-1">{msg.senderName}</p>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-black/60' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    name="message"
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all backdrop-blur-sm"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="px-4 py-3 rounded-xl bg-lime-500 hover:bg-lime-600 text-black transition-colors disabled:opacity-50 font-bold shadow-lg"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
