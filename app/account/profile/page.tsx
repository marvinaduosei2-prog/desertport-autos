'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { updateProfile, updateEmail } from 'firebase/auth';

export default function ProfilePage() {
  const { user, userData } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    // Load profile data
    setProfile({
      displayName: user.displayName || userData?.name || '',
      email: user.email || '',
      phone: userData?.phone || '',
      location: userData?.location || '',
    });
  }, [user, userData, router]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profile.displayName,
        });

        // Update email if changed
        if (profile.email !== user.email) {
          await updateEmail(auth.currentUser, profile.email);
        }
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        updatedAt: new Date(),
      });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
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
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-lime-500/20 rounded-[32px] blur-xl opacity-20" />
          <div className="relative bg-white border-2 border-gray-200 shadow-xl rounded-[32px] p-8 lg:p-12">
            
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                    <User size={48} className="text-black" strokeWidth={2} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-black text-xs font-black">✓</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{profile.displayName || 'User'}</h2>
                  <p className="text-gray-600 text-sm font-semibold">{userData?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-600 text-xs">
                      Joined {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-200 hover:border-lime-500 transition-all duration-300 flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-200 transition-all duration-300"
                  >
                    <X size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              )}
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <User size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-500 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-500 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-500 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your location"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-500 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

