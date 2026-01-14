'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useSiteConfigStore } from '@/store/site-config';
import { useNavigationStore } from '@/stores/navigation-store';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';

export function Navigation() {
  const { isMenuOpen: isOpen, toggleMenu, closeMenu } = useNavigationStore();
  const [scrolled, setScrolled] = useState(false);
  const { user, userData, role } = useAuthStore();
  const { config, fetchConfig, isInitialized } = useSiteConfigStore();
  const router = useRouter();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Refetch config periodically to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConfig();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [fetchConfig]);

  const logoUrl = config?.branding?.logoUrl;
  const showSiteName = config?.branding?.showSiteName !== false; // Default to true

  console.log('🖼️ Navigation - Logo URL:', logoUrl);
  console.log('📝 Navigation - Show Site Name:', showSiteName);
  console.log('🔄 Navigation - Initialized:', isInitialized);

  const handleSignOut = async () => {
    try {
      // Close chat session before signing out
      if (typeof window !== 'undefined') {
        const { useAIChatStore } = await import('@/stores/ai-chat-store');
        const closeSession = useAIChatStore.getState().closeSession;
        await closeSession(user?.uid);
      }
      
      await auth.signOut();
      closeMenu();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = [
    { label: 'INVENTORY', href: '/inventory' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      {/* Main Navigation - ALWAYS FIXED */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-20 max-w-[2200px] mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-24">
            {/* Logo - FAR LEFT */}
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex-shrink-0"
                >
                  <Link href="/" className="group flex items-center gap-3 z-50 relative">
                    {isInitialized && logoUrl ? (
                      // Custom Logo with optional text
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-10 lg:h-12 flex items-center"
                          style={{ minWidth: '120px' }} // Reserve space
                        >
                          <motion.img
                            src={logoUrl}
                            alt="DesertPort Autos"
                            className="h-full w-auto object-contain"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            loading="eager"
                            onError={(e) => {
                              console.error('Logo failed to load');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </motion.div>
                        {showSiteName && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-tighter text-white whitespace-nowrap"
                          >
                            DESERTPORT <span className="text-lime-500">AUTOS</span>
                          </motion.span>
                        )}
                      </>
                    ) : (
                      // Default D Icon + Text (same size as logo to prevent shift)
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="h-10 lg:h-12 flex items-center"
                          style={{ minWidth: '120px' }} // Same as logo container
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-lime-500 flex items-center justify-center shadow-lg shadow-lime-500/30"
                          >
                            <span className="text-black font-black text-xl lg:text-2xl">D</span>
                          </motion.div>
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-tighter text-white whitespace-nowrap"
                        >
                          DESERTPORT <span className="text-lime-500">AUTOS</span>
                        </motion.span>
                      </>
                    )}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer to push content to edges */}
            <div className="flex-1"></div>

            {/* Auth Buttons + Hamburger - FAR RIGHT */}
            <div className="flex items-center gap-4 relative z-50 flex-shrink-0">
              <AnimatePresence mode="wait">
                {!isOpen && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="hidden md:flex items-center gap-3"
                  >
                    {user ? (
                      <>
                        <Link href="/account/profile">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 text-sm font-bold text-white/70 hover:text-white framer-smooth uppercase tracking-wider"
                          >
                            ACCOUNT
                          </motion.button>
                        </Link>
                        {role === 'admin' && (
                          <Link href="/admin/dashboard">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 rounded-full bg-lime-500 text-black text-sm font-black uppercase tracking-wider framer-smooth"
                            >
                              ADMIN
                            </motion.button>
                          </Link>
                        )}
                      </>
                    ) : (
                      <>
                        <Link href="/signin">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 text-sm font-bold text-white/70 hover:text-white framer-smooth uppercase tracking-wider"
                          >
                            SIGN IN
                          </motion.button>
                        </Link>
                        <Link href="/signup">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-full bg-lime-500 text-black text-sm font-black uppercase tracking-wider framer-smooth neon-glow"
                          >
                            GET STARTED
                          </motion.button>
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hamburger Menu */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 z-[70] bg-transparent hover:bg-white/5 rounded-xl framer-smooth"
              >
                <motion.span
                  className="block w-7 h-0.5 bg-white"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 6 : 0,
                    backgroundColor: isOpen ? '#84cc16' : '#ffffff'
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="block w-7 h-0.5 bg-white"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-7 h-0.5 bg-white"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -6 : 0,
                    backgroundColor: isOpen ? '#84cc16' : '#ffffff'
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0a0a0a] z-[60] overflow-y-auto noise-texture"
          >
            <div className="w-full px-6 lg:px-12 h-full flex flex-col items-center justify-center py-24">
              {/* Menu Items */}
              <div className="flex flex-col items-center gap-6 mb-16">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.2 + index * 0.1, 
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block text-center text-6xl md:text-7xl lg:text-8xl font-black text-white hover:text-lime-500 framer-smooth tracking-tighter leading-none"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* User Menu */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="border-t border-white/10 pt-12 mb-32"
              >
                {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <Link href="/account" onClick={closeMenu}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-black uppercase tracking-wider framer-smooth hover:border-lime-500 hover:text-lime-500"
                      >
                        MY DASHBOARD
                      </motion.button>
                    </Link>
                    <Link href="/account/profile" onClick={closeMenu}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-black uppercase tracking-wider framer-smooth hover:border-lime-500 hover:text-lime-500"
                      >
                        MY PROFILE
                      </motion.button>
                    </Link>
                    <Link href="/account/favorites" onClick={closeMenu}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-black uppercase tracking-wider framer-smooth hover:border-lime-500 hover:text-lime-500"
                      >
                        MY FAVORITES
                      </motion.button>
                    </Link>
                    {role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={closeMenu}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 rounded-full bg-lime-500 text-black font-black uppercase tracking-wider framer-smooth neon-glow"
                        >
                          ADMIN DASHBOARD
                        </motion.button>
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignOut}
                      className="px-8 py-4 rounded-full border-2 border-red-500/20 text-red-400 font-black uppercase tracking-wider framer-smooth hover:border-red-500 hover:bg-red-500/10"
                    >
                      SIGN OUT
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link href="/signin" onClick={closeMenu}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-black uppercase tracking-wider framer-smooth"
                      >
                        SIGN IN
                      </motion.button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full bg-lime-500 text-black font-black uppercase tracking-wider framer-smooth neon-glow"
                      >
                        GET STARTED
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-8 left-0 right-0 px-6"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-2 gap-8 text-sm text-gray-500 text-center border-t border-white/10 pt-8">
                    <div>
                      <p className="font-bold text-white mb-2 uppercase tracking-wider">CONTACT</p>
                      <p>{config?.footer?.contact?.email || 'info@desertport.com'}</p>
                      <p>{config?.footer?.contact?.phone || '(555) 123-4567'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-2 uppercase tracking-wider">HOURS</p>
                      <p>Mon-Sat: 9AM-7PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
