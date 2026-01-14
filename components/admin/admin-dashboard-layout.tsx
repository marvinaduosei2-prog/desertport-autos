'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Car, Grid3x3, MessageSquare, 
  Settings, Image as ImageIcon, Palette, FileText,
  LogOut, Menu, X, ChevronRight, Headphones, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfigStore } from '@/store/site-config';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { playNotificationSoundAdvanced } from '@/lib/notification-sound';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    title: 'Hero Section',
    icon: FileText,
    href: '/admin/content/hero',
  },
  {
    title: 'Categories',
    icon: Grid3x3,
    href: '/admin/content/categories',
  },
  {
    title: 'Inventory',
    icon: Car,
    href: '/admin/inventory',
  },
  {
    title: 'Testimonials',
    icon: MessageSquare,
    href: '/admin/content/testimonials',
  },
  {
    title: 'About/Experience',
    icon: Palette,
    href: '/admin/content/about',
  },
  {
    title: 'Live Support',
    icon: Headphones,
    href: '/admin/support',
  },
  {
    title: 'Contacts',
    icon: Mail,
    href: '/admin/contacts',
  },
  {
    title: 'Media Library',
    icon: ImageIcon,
    href: '/admin/media',
  },
  {
    title: 'Site Settings',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { config, fetchConfig } = useSiteConfigStore();
  const [vehicleCount, setVehicleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const fetchVehicleCount = async () => {
      try {
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        setVehicleCount(vehiclesSnapshot.size);
      } catch (error) {
        console.error('Error fetching vehicle count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleCount();
  }, []);

  // Listen to total unread messages across all active sessions
  useEffect(() => {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(
      sessionsRef,
      where('status', 'in', ['ai', 'pending_agent', 'with_agent'])
    );

    let previousUnreadCount = 0;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let totalUnread = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          totalUnread += data.unreadByAgent || 0;
        });
        
        console.log('🔔 Admin Dashboard: Total unread messages:', totalUnread);
        
        // Play sound only when count increases (new message arrived)
        if (totalUnread > previousUnreadCount && previousUnreadCount > 0) {
          console.log('🔊 Playing notification sound for new message');
          playNotificationSoundAdvanced();
        }
        
        previousUnreadCount = totalUnread;
        setTotalUnreadMessages(totalUnread);
      },
      (error) => {
        console.error('Error listening to unread messages:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-600 flex items-center justify-center font-black text-white">
                D
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900">DESERTPORT</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
            >
              View Site
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/api/auth/logout"
              className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto"
          >
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isLiveSupport = item.href === '/admin/support';
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group relative ${
                      isActive
                        ? 'bg-lime-600 text-white shadow-lg shadow-lime-600/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition'}`} />
                    <span className="font-semibold">{item.title}</span>
                    
                    {/* Unread count badge for Live Support */}
                    {isLiveSupport && totalUnreadMessages > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive 
                            ? 'bg-white text-lime-600' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                      </motion.span>
                    )}
                    
                    {isActive && !isLiveSupport && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="p-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-lime-50 to-lime-100/50 border border-lime-200 rounded-xl">
                <h3 className="text-sm font-bold text-lime-700 mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Vehicles</span>
                    <span className="text-gray-900 font-bold">
                      {loading ? '...' : vehicleCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Categories</span>
                    <span className="text-gray-900 font-bold">
                      {loading ? '...' : (config?.categories?.items?.length || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Testimonials</span>
                    <span className="text-gray-900 font-bold">
                      {loading ? '...' : (config?.testimonials?.items?.length || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? 'pl-72' : 'pl-0'
        }`}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

