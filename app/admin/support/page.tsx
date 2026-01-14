'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Clock, User, Bot, AlertCircle } from 'lucide-react';
import { playNotificationSoundAdvanced } from '@/lib/notification-sound';

interface ChatSession {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  status: 'ai' | 'pending_agent' | 'with_agent' | 'resolved';
  createdAt: any;
  updatedAt: any;
  lastMessageAt: any;
  escalationCount: number;
  agentId?: string;
  agentName?: string;
  resolved: boolean;
  unreadByAgent: number;
  lastMessage?: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'agent' | 'system';
  content: string;
  timestamp: any;
  senderName?: string;
}

export default function AdminSupportPage() {
  const { user, userData } = useAuthStore();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen to sessions (pending, active, or resolved based on toggle)
  useEffect(() => {
    const sessionsRef = collection(db, 'chatSessions');
    
    // Show all non-resolved sessions in admin (including 'ai' status)
    const statusFilter = showResolved 
      ? ['resolved'] 
      : ['ai', 'pending_agent', 'with_agent']; // Added 'ai' to see all active chats
    
    const q = query(
      sessionsRef,
      where('status', 'in', statusFilter),
      orderBy('lastMessageAt', 'desc')
    );

    console.log('🔍 Admin: Querying sessions with status:', statusFilter);

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const sessionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatSession[];
        setSessions(sessionsData);
        console.log('📋 Admin: Loaded sessions:', sessionsData.length, 'Type:', showResolved ? 'Resolved' : 'Active');
        
        // Log each session for debugging
        sessionsData.forEach(s => {
          console.log(`  - Session ${s.id}: ${s.userName} (${s.status}) - ${s.unreadByAgent || 0} unread`);
        });
      },
      (error) => {
        console.error('🚨 Admin: Error loading sessions:', error.code, error.message);
        if (error.code === 'permission-denied') {
          alert('⚠️ FIRESTORE RULES NOT DEPLOYED!\n\nGo to Firebase Console and deploy the rules.\nSee DEPLOY_RULES_SIMPLE.md for instructions.');
        }
      }
    );

    return () => unsubscribe();
  }, [showResolved]);

  // Listen to messages for selected session
  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    console.log('🔍 Admin: Setting up message listener for session:', selectedSession.id);

    const messagesRef = collection(db, 'chatMessages');
    const q = query(
      messagesRef,
      where('sessionId', '==', selectedSession.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        // Track previous message count to detect new messages
        const previousMessageCount = messages.length;
        
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
        
        setMessages(messagesData);
        console.log('💬 Admin: Loaded messages:', messagesData.length);
        
        // Log each message for debugging
        messagesData.forEach((msg, i) => {
          console.log(`  ${i + 1}. [${msg.role}] ${msg.content.substring(0, 50)}... (${new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString()})`);
        });

        // Play notification sound if new user message arrived
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMessage = change.doc.data();
            // Play sound only for user messages (not agent/system)
            if (newMessage.role === 'user' && previousMessageCount > 0) {
              console.log('🔔 Admin: New user message, playing notification');
              playNotificationSoundAdvanced();
            }
          }
        });

        // Mark as read by agent when viewing
        if (selectedSession.unreadByAgent > 0) {
          console.log('📖 Marking', selectedSession.unreadByAgent, 'messages as read');
          updateDoc(doc(db, 'chatSessions', selectedSession.id), {
            unreadByAgent: 0,
          }).catch(err => console.error('Error marking as read:', err));
        }
      },
      (error) => {
        console.error('🚨 Admin: Error loading messages:', error.code, error.message);
        if (error.code === 'failed-precondition') {
          console.error('⚠️ INDEX REQUIRED! See FIX_CHAT_NOW.md');
          alert('⚠️ FIRESTORE INDEX MISSING!\n\nThe chatMessages index is not created yet.\nSee FIX_CHAT_NOW.md for instructions.');
        }
      }
    );

    return () => {
      console.log('🔌 Admin: Unsubscribing from messages for session:', selectedSession.id);
      unsubscribe();
    };
  }, [selectedSession]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession || !user || !userData || sending) return;

    setSending(true);
    console.log('📤 Admin: Sending message:', newMessage);
    console.log('📋 Session ID:', selectedSession.id);
    console.log('👤 Agent:', userData.displayName);

    try {
      const response = await fetch('/api/chat/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          sessionId: selectedSession.id,
          agentId: user.uid,
          agentName: userData.displayName || 'Support Agent',
        }),
      });

      const data = await response.json();
      console.log('✅ Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setNewMessage('');
      console.log('💬 Message sent successfully!');
    } catch (error: any) {
      console.error('❌ Send message error:', error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleResolveSession = async () => {
    if (!selectedSession) return;

    try {
      await updateDoc(doc(db, 'chatSessions', selectedSession.id), {
        status: 'resolved',
        resolved: true,
        updatedAt: Timestamp.now(),
      });

      // Send system message
      await addDoc(collection(db, 'chatMessages'), {
        sessionId: selectedSession.id,
        role: 'system',
        content: 'This conversation has been resolved. Thank you for contacting DesertPort Autos! 🎉',
        timestamp: Timestamp.now(),
      });

      setSelectedSession(null);
    } catch (error) {
      console.error('Resolve session error:', error);
      alert('Failed to resolve session. Please try again.');
    }
  };

  const handleHandBackToAI = async () => {
    if (!selectedSession) return;

    const confirmed = confirm(
      'Are you sure you want to hand this conversation back to AI?\n\nThe AI assistant will resume handling this conversation.'
    );

    if (!confirmed) return;

    try {
      console.log('🤖 Handing conversation back to AI');
      
      // Update session status back to 'ai'
      await updateDoc(doc(db, 'chatSessions', selectedSession.id), {
        status: 'ai',
        agentId: null,
        agentName: null,
        updatedAt: Timestamp.now(),
      });

      // Send system message
      await addDoc(collection(db, 'chatMessages'), {
        sessionId: selectedSession.id,
        role: 'system',
        content: '🤖 This conversation has been handed back to our AI assistant. Feel free to continue asking questions!',
        timestamp: Timestamp.now(),
      });

      // Update local state
      setSelectedSession(prev => prev ? { ...prev, status: 'ai', agentId: undefined, agentName: undefined } : null);
      
      console.log('✅ Conversation handed back to AI');
      alert('Conversation successfully handed back to AI assistant.');
    } catch (error) {
      console.error('Hand back to AI error:', error);
      alert('Failed to hand back conversation. Please try again.');
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;

    const confirmed = confirm(
      'Are you sure you want to permanently delete this conversation?\n\nThis action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      // Delete all messages in the session
      const messagesRef = collection(db, 'chatMessages');
      const q = query(messagesRef, where('sessionId', '==', selectedSession.id));
      const messagesSnapshot = await getDocs(q);
      
      const deletePromises = messagesSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Delete the session
      await deleteDoc(doc(db, 'chatSessions', selectedSession.id));

      setSelectedSession(null);
      console.log('✅ Session and messages deleted');
    } catch (error) {
      console.error('Delete session error:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Sessions List */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
              <MessageCircle size={24} className="text-lime-600" />
              Support Chats
              {sessions.length > 0 && (
                <span className="ml-auto px-2 py-1 bg-lime-500 text-black text-xs font-bold rounded-full">
                  {sessions.length}
                </span>
              )}
            </h2>
            
            {/* Toggle between Active and Resolved */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowResolved(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  !showResolved 
                    ? 'bg-lime-500 text-black' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setShowResolved(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  showResolved 
                    ? 'bg-lime-500 text-black' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm font-semibold">No active chats</p>
                <p className="text-xs mt-2">Waiting for customers...</p>
              </div>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ backgroundColor: 'rgba(132, 204, 22, 0.05)' }}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedSession?.id === session.id ? 'bg-lime-500/10 border-l-4 border-l-lime-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-600" />
                      <p className="font-bold text-gray-900 text-sm">
                        {session.userName || session.userEmail || 'Anonymous'}
                      </p>
                    </div>
                    {session.unreadByAgent > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {session.unreadByAgent}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {session.status === 'pending_agent' ? (
                      <AlertCircle size={14} className="text-orange-500" />
                    ) : (
                      <Clock size={14} />
                    )}
                    <span>
                      {new Date(session.lastMessageAt?.seconds * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {session.status === 'pending_agent' && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-700 text-xs font-bold rounded">
                        Needs Agent
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col">
          {!selectedSession ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">Select a chat to start</p>
                <p className="text-sm mt-2">Choose a session from the list to view and respond</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {selectedSession.userName || selectedSession.userEmail || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Session started {new Date(selectedSession.createdAt?.seconds * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!showResolved && selectedSession.status === 'with_agent' && (
                    <button
                      onClick={handleHandBackToAI}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                      title="Hand this conversation back to AI assistant"
                    >
                      <Bot size={18} />
                      Hand to AI
                    </button>
                  )}
                  {!showResolved && (
                    <button
                      onClick={handleResolveSession}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  {showResolved && (
                    <button
                      onClick={handleDeleteSession}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.role === 'agent' ? 'justify-end' : 
                      msg.role === 'system' ? 'justify-center' : 
                      'justify-start'
                    }`}
                  >
                    {msg.role === 'system' ? (
                      <div className="px-4 py-2 rounded-full bg-gray-200 border border-gray-300">
                        <p className="text-xs text-gray-600 text-center">{msg.content}</p>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.role === 'agent'
                            ? 'bg-lime-500 text-black'
                            : msg.role === 'assistant'
                            ? 'bg-blue-500/10 text-gray-900 border border-blue-200'
                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Bot size={14} className="text-blue-600" />
                            <span className="text-xs text-blue-600 font-bold">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.role === 'agent' ? 'text-black/60' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-lime-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

