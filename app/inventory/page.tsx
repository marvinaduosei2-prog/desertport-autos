'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3x3, List, X, ChevronDown } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { FavoriteButton } from '@/components/favorite-button';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  condition: 'new' | 'used' | 'certified';
  status: 'available' | 'reserved' | 'sold' | 'coming_soon';
  images: string[];
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  description?: string;
}

function InventoryPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states - auto-set category from URL
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch categories dynamically from Firebase
  const [categories, setCategories] = useState<string[]>(['all']);
  const conditions = ['all', 'new', 'used', 'certified'];
  const statuses = ['all', 'available', 'reserved', 'coming_soon'];
  
  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    fetchCategories();
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchTerm, selectedCategory, selectedCondition, selectedStatus, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const configRef = doc(db, 'site_config', 'main');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        const data = configSnap.data();
        const categoryItems = data?.categories?.items || [];
        
        // Extract slugs from categories, excluding spare parts (which goes to separate page)
        const categorySlugs = categoryItems
          .filter((cat: any) => cat.slug !== 'spare-parts-accessories')
          .map((cat: any) => cat.slug)
          .filter(Boolean);
        
        setCategories(['all', ...categorySlugs]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesRef = collection(db, 'vehicles');
      const vehiclesSnap = await getDocs(vehiclesRef);
      
      const vehiclesData = vehiclesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      setVehicles(vehiclesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter - normalize both sides for comparison
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => {
        const vehicleCategory = (v.category || '').toLowerCase().trim();
        const filterCategory = selectedCategory.toLowerCase().trim();
        return vehicleCategory === filterCategory;
      });
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(v => v.condition === selectedCondition);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(v => v.status === selectedStatus);
    }

    // Price filter
    filtered = filtered.filter(v => 
      v.price >= priceRange[0] && v.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      default:
        // newest (by id)
        break;
    }

    setFilteredVehicles(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedStatus('all');
    setPriceRange([0, 500000]);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto desktop-scale-80">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter">
              Premium <span className="text-lime-500">Inventory</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Discover your perfect vehicle from our curated collection
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
                {filteredVehicles.length} Vehicles Available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 lg:px-20 max-w-[2200px] mx-auto">
        <div className="desktop-scale-80">
          {/* Search & Controls Bar */}
          <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-lime-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 ${
                showFilters 
                  ? 'bg-lime-500 text-black' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-lg text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-lg text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-lime-600 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-lime-500 focus:outline-none transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
                      <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-lime-500 focus:outline-none transition-all"
                      >
                        {conditions.map(cond => (
                          <option key={cond} value={cond}>
                            {cond.charAt(0).toUpperCase() + cond.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-lime-500 focus:outline-none transition-all"
                      >
                        {statuses.map(stat => (
                          <option key={stat} value={stat}>
                            {stat.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-lime-500 focus:outline-none transition-all"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="year-new">Year: Newest</option>
                        <option value="year-old">Year: Oldest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vehicle Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-400 mb-2">No vehicles found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
            }
          `}>
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                viewMode={viewMode}
                index={index}
              />
            ))}
          </div>
        )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function VehicleCard({ vehicle, viewMode, index }: { vehicle: Vehicle; viewMode: 'grid' | 'list'; index: number }) {
  const getStatusBadge = () => {
    const badges = {
      available: 'bg-green-500 text-white',
      reserved: 'bg-yellow-500 text-black',
      sold: 'bg-red-500 text-white',
      coming_soon: 'bg-blue-500 text-white'
    };
    return badges[vehicle.status] || badges.available;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Link href={`/inventory/${vehicle.id}`}>
          <div className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-lime-500 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img
                  src={vehicle.images[0] || '/placeholder-car.jpg'}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge()}`}>
                  {vehicle.status.replace('_', ' ')}
                </div>
                {/* Favorite Button */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FavoriteButton
                      vehicleId={vehicle.id}
                      vehicleData={{
                        make: vehicle.brand,
                        model: vehicle.model,
                        year: vehicle.year,
                        price: vehicle.price,
                        images: vehicle.images,
                        category: vehicle.category,
                        status: vehicle.status
                      }}
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-lime-600 transition-colors">
                      {vehicle.year} {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">
                      {vehicle.category} • {vehicle.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-lime-600">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {vehicle.mileage && (
                    <span className="flex items-center gap-1">
                      <span className="font-bold">{vehicle.mileage.toLocaleString()}</span> miles
                    </span>
                  )}
                  {vehicle.transmission && (
                    <span>{vehicle.transmission}</span>
                  )}
                  {vehicle.fuelType && (
                    <span>{vehicle.fuelType}</span>
                  )}
                </div>

                {vehicle.description && (
                  <p className="mt-4 text-gray-600 line-clamp-2">
                    {vehicle.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/inventory/${vehicle.id}`}>
        <div className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-lime-500 transition-all duration-300 shadow-lg hover:shadow-2xl h-full">
          {/* Image */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={vehicle.images[0] || '/placeholder-car.jpg'}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge()}`}>
              {vehicle.status.replace('_', ' ')}
            </div>
            {/* Favorite Button */}
            <div className="absolute top-4 left-4 z-10">
              <div className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FavoriteButton
                  vehicleId={vehicle.id}
                  vehicleData={{
                    make: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    price: vehicle.price,
                    images: vehicle.images,
                    category: vehicle.category,
                    status: vehicle.status
                  }}
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-lime-600 transition-colors">
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4">
              {vehicle.category} • {vehicle.condition}
            </p>

            <div className="flex items-center justify-between">
              <div className="space-y-1 text-sm text-gray-600">
                {vehicle.mileage && (
                  <p><span className="font-bold">{vehicle.mileage.toLocaleString()}</span> miles</p>
                )}
                {vehicle.transmission && (
                  <p>{vehicle.transmission}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-lime-600">
                  ${vehicle.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading inventory...</div>
      </div>
    }>
      <InventoryPageContent />
    </Suspense>
  );
}
