'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Search, Package, Filter } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  category: string;
  condition: string;
  status: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  images: string[];
  thumbnailUrl: string;
  description: string;
  compatibleVehicles: string[];
  warranty?: string;
  isFeatured: boolean;
}

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [filteredParts, setFilteredParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'engine',
    'transmission',
    'suspension',
    'brakes',
    'electrical',
    'body',
    'interior',
    'exterior',
    'accessories'
  ];

  useEffect(() => {
    fetchSpareParts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [spareParts, searchTerm, selectedCategory]);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const partsRef = collection(db, 'spare_parts');
      const partsSnap = await getDocs(partsRef);
      
      const partsData = partsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SparePart[];
      
      setSpareParts(partsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...spareParts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(part => 
        part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(part => part.category === selectedCategory);
    }

    setFilteredParts(filtered);
  };

  const getStockBadge = (status: string) => {
    const badges: Record<string, string> = {
      in_stock: 'bg-green-500 text-white',
      low_stock: 'bg-yellow-500 text-black',
      out_of_stock: 'bg-red-500 text-white',
      pre_order: 'bg-blue-500 text-white'
    };
    return badges[status] || badges.in_stock;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter">
              <span className="text-lime-500">Spare Parts</span> & Accessories
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Quality parts and accessories for your vehicle
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {filteredParts.length} Parts Available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 lg:px-20 max-w-[2200px] mx-auto">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by part name, number, or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 focus:border-lime-500 focus:outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-400 mb-2">No parts found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParts.map((part, index) => (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-lime-500 transition-all duration-300 shadow-lg hover:shadow-2xl h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={part.thumbnailUrl || part.images[0] || '/placeholder-part.jpg'}
                      alt={part.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStockBadge(part.status)}`}>
                      {part.status.replace('_', ' ')}
                    </div>
                    {part.compareAtPrice && part.compareAtPrice > part.price && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500 text-white">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                        {part.category}
                      </p>
                      <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-lime-600 transition-colors line-clamp-2">
                        {part.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Part #: <span className="font-mono font-bold">{part.partNumber}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {part.manufacturer}
                      </p>
                      
                      {part.compatibleVehicles && part.compatibleVehicles.length > 0 && (
                        <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                          Fits: {part.compatibleVehicles.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          {part.compareAtPrice && part.compareAtPrice > part.price && (
                            <p className="text-sm text-gray-400 line-through">
                              ${part.compareAtPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="text-2xl font-black text-lime-600">
                            ${part.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="text-sm font-bold text-gray-900">{part.stockQuantity}</p>
                        </div>
                      </div>

                      <button className="w-full mt-4 px-4 py-3 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-xl transition-colors">
                        Contact for Quote
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

