'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fetchVehicles } from '@/lib/firebase/db';
import { serializeTimestamp } from '@/lib/firebase/db';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import type { VehicleData } from '@/types/client';

export function FeaturedVehicles() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await fetchVehicles({ isFeatured: true, limitCount: 3 });
    const serialized = data.map((v: any) => ({
      ...v,
      createdAt: serializeTimestamp(v.createdAt),
      updatedAt: serializeTimestamp(v.updatedAt),
    }));
    setVehicles(serialized);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="relative py-32 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) return null;

  return (
    <section ref={ref} className="relative py-32 px-0 overflow-hidden bg-white w-full">
      {/* Background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gray-200 opacity-30 rounded-full blur-3xl transform -translate-y-1/2" />

      <div className="relative w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* OseiCreatives-Style Header: Title Left, Subtitle Right (Professional Spacing) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-20 gap-12 lg:gap-20"
        >
          <div className="flex flex-col gap-6 lg:max-w-[50%]">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur-xl rounded-full border border-gray-200 w-fit"
            >
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="text-black font-bold text-xs uppercase tracking-wider">Featured Collection</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.1] tracking-tight"
            >
              Masterpieces on Wheels
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-md font-light leading-relaxed lg:mt-4"
          >
            Hand-selected vehicles that define automotive excellence
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link href={`/inventory/${vehicle.id}`}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={vehicle.thumbnailUrl}
                      alt={`${vehicle.specs.make} ${vehicle.specs.model}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 backdrop-blur-xl rounded-full flex items-center gap-1">
                      <Star size={14} fill="currentColor" className="text-black" />
                      <span className="text-black font-bold text-sm">Featured</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {vehicle.specs.year} {vehicle.specs.make} {vehicle.specs.model}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-white">
                        {formatPrice(vehicle.price)}
                      </p>
                      <div className="flex items-center gap-2 text-white/80 group-hover:text-white group-hover:gap-3 transition-all">
                        <span className="font-medium">View Details</span>
                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-gray-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500 -z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Link href="/inventory">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              View All Vehicles
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              <div className="absolute -inset-1 bg-gradient-to-r from-white via-gray-300 to-white rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 -z-10" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

