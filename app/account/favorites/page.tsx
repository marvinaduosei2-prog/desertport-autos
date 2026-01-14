'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

interface FavoriteVehicle {
  id: string;
  vehicleId: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  category: string;
  status: string;
  addedAt: any;
}

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    fetchFavorites();
  }, [user, router]);

  const fetchFavorites = async () => {
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

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!confirm('Remove this vehicle from your favorites?')) return;

    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight flex items-center gap-4">
                <Heart size={48} className="text-lime-500" fill="currentColor" />
                My Favorites
              </h1>
              <p className="text-gray-600 text-lg">
                {favorites.length} {favorites.length === 1 ? 'vehicle' : 'vehicles'} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <Heart size={80} className="text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our inventory and save your favorite vehicles to view them here.
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-lime-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white border-2 border-gray-200 shadow-lg rounded-3xl overflow-hidden hover:border-lime-500 hover:shadow-xl transition-all duration-300">
                  
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={favorite.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={`${favorite.year} ${favorite.make} ${favorite.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-white/20">
                      <span className="text-xs font-bold text-white uppercase">{favorite.status}</span>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300"
                    >
                      <Trash2 size={16} className="text-white" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      {favorite.year} {favorite.make} {favorite.model}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{favorite.category}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-lime-600">
                        ${favorite.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
                      <Calendar size={12} />
                      <span>Added {favorite.addedAt ? new Date(favorite.addedAt.seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                    </div>

                    {/* View Button */}
                    <Link href={`/inventory/${favorite.vehicleId}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Details
                        <ExternalLink size={16} />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

