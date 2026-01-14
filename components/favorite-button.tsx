'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  vehicleId: string;
  vehicleData: {
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    category: string;
    status: string;
  };
  className?: string;
  size?: number;
}

export function FavoriteButton({ vehicleId, vehicleData, className = '', size = 20 }: FavoriteButtonProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, vehicleId]);

  const checkIfFavorite = async () => {
    if (!user) return;

    try {
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef,
        where('userId', '==', user.uid),
        where('vehicleId', '==', vehicleId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsFavorite(true);
        setFavoriteId(querySnapshot.docs[0].id);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/signin');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await deleteDoc(doc(db, 'favorites', favoriteId));
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const docRef = await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          vehicleId,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          price: vehicleData.price,
          images: vehicleData.images,
          category: vehicleData.category,
          status: vehicleData.status,
          addedAt: Timestamp.now(),
        });
        setIsFavorite(true);
        setFavoriteId(docRef.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`relative group ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Glow effect */}
      {isFavorite && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-lime-500 rounded-full blur-lg opacity-50"
        />
      )}
      
      {/* Heart icon */}
      <Heart
        size={size}
        className={`relative transition-all duration-300 ${
          isFavorite
            ? 'text-lime-500 fill-lime-500'
            : 'text-white group-hover:text-lime-500'
        } ${loading ? 'opacity-50' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </motion.button>
  );
}

