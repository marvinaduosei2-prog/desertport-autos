'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Heart, User, Mail, Calendar, Shield, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { sendVerificationEmail } from '@/lib/firebase/auth';
import { toast } from 'sonner';

interface FavoriteVehicle {
  id: string;
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  addedAt: any;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingVerification, setResendingVerification] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/account');
    }
  }, [user, authLoading, router]);

  const handleResendVerification = async () => {
    if (resendingVerification) return;
    
    setResendingVerification(true);
    const { error } = await sendVerificationEmail();
    
    if (error) {
      if (error.includes('too-many-requests')) {
        toast.error('Too many requests. Please wait a few minutes before trying again.');
      } else {
        toast.error(error);
      }
    } else {
      toast.success('Verification email sent! Please check your inbox and spam folder.');
    }
    
    setResendingVerification(false);
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const favoritesRef = collection(db, 'favorites');
      const q = query(favoritesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const favoritesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FavoriteVehicle[];

      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="desktop-scale-80">
          {/* Email Verification Banner */}
        {!user.emailVerified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-3xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-yellow-900 text-lg mb-1">
                    Email Verification Required
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    Please check your email (and spam folder) to verify your account
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {resendingVerification ? 'Sending...' : 'Resend Email'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-10 bg-gradient-to-r from-lime-500 to-transparent" />
            <span className="text-lime-600 text-[10px] font-black tracking-[0.25em] uppercase">My Account</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Welcome Back, <span className="text-lime-600">{userData.displayName || 'User'}</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and saved vehicles</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-lime-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Link href="/account/profile">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-lime-500 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center mb-6">
                  <User size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">My Profile</h3>
                <p className="text-gray-600">Edit your personal information</p>
              </div>
            </Link>
          </motion.div>

          {/* Favorites Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-lime-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Link href="/account/favorites">
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-lime-500 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Heart size={32} className="text-white" strokeWidth={2.5} fill="white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  My Favorites
                  <span className="ml-2 text-lime-600">({favorites.length})</span>
                </h3>
                <p className="text-gray-600">View your saved vehicles</p>
              </div>
            </Link>
          </motion.div>

          {/* Account Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} className="text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
                {userData.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone size={16} />
                    <span className="text-sm">{userData.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Joined {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
                {userData.role === 'admin' && (
                  <div className="mt-4 px-4 py-2 bg-lime-500/20 border border-lime-500/30 rounded-xl">
                    <span className="text-lime-400 font-bold text-sm uppercase tracking-wider">Administrator</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Favorites */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900">Recent Favorites</h2>
              <Link href="/account/favorites">
                <button className="px-6 py-3 bg-gray-100 hover:bg-lime-500 text-gray-900 hover:text-black font-bold rounded-xl transition-all duration-300">
                  View All →
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favorites.slice(0, 3).map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-lime-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Link href={`/inventory/${favorite.vehicleId}`}>
                    <div className="relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-lime-500 hover:shadow-xl transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={favorite.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={`${favorite.year} ${favorite.make} ${favorite.model}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-black text-gray-900 mb-2">
                          {favorite.year} {favorite.make} {favorite.model}
                        </h3>
                        <p className="text-2xl font-black text-lime-600">
                          ${favorite.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Favorites State */}
        {favorites.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our inventory and save your favorite vehicles
            </p>
            <Link href="/inventory">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-lime-500 text-black font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
              >
                Browse Inventory
              </motion.button>
            </Link>
          </motion.div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
