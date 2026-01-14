'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Gauge, Fuel, Cog, MapPin, Shield, Check, X, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { toast } from 'sonner';
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
  engine?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: string[];
  vin?: string;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      const vehicleSnap = await getDoc(vehicleRef);
      
      if (vehicleSnap.exists()) {
        setVehicle({
          id: vehicleSnap.id,
          ...vehicleSnap.data()
        } as Vehicle);
      } else {
        toast.error('Vehicle not found');
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast.error('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Inquiry sent! We\'ll contact you soon.');
    setShowContactForm(false);
    setContactData({ name: '', email: '', phone: '', message: '' });
  };

  const getStatusBadge = () => {
    const badges = {
      available: { bg: 'bg-green-500', text: 'Available' },
      reserved: { bg: 'bg-yellow-500', text: 'Reserved' },
      sold: { bg: 'bg-red-500', text: 'Sold' },
      coming_soon: { bg: 'bg-blue-500', text: 'Coming Soon' }
    };
    return badges[vehicle?.status || 'available'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop'];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Back Button */}
      <div className="pt-32 pb-8 px-6 lg:px-20 max-w-[2200px] mx-auto">
        <Link href="/inventory" className="inline-flex items-center gap-2 text-gray-600 hover:text-lime-600 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Inventory
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-20 max-w-[2200px] mx-auto pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              
              {/* Status Badge */}
              <div className={`absolute top-6 right-6 px-4 py-2 ${getStatusBadge().bg} text-white rounded-full font-bold text-sm uppercase shadow-lg`}>
                {getStatusBadge().text}
              </div>

              {/* Favorite Button */}
              <div className="absolute top-6 left-6 z-10">
                <div className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
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
                    size={24}
                  />
                </div>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-lime-500 scale-105' : 'border-gray-200 hover:border-lime-300'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Vehicle Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-2">
                {vehicle.year} {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-xl text-gray-600 mb-6 uppercase tracking-wider font-bold">
                {vehicle.category} • {vehicle.condition}
              </p>
              <div className="text-5xl font-black text-lime-600">
                ${vehicle.price.toLocaleString()}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {vehicle.year && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <Calendar className="w-6 h-6 text-lime-600 mb-2" />
                  <div className="text-sm text-gray-600">Year</div>
                  <div className="text-xl font-black text-gray-900">{vehicle.year}</div>
                </div>
              )}
              {vehicle.mileage && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <Gauge className="w-6 h-6 text-lime-600 mb-2" />
                  <div className="text-sm text-gray-600">Mileage</div>
                  <div className="text-xl font-black text-gray-900">{vehicle.mileage.toLocaleString()} km</div>
                </div>
              )}
              {vehicle.transmission && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <Cog className="w-6 h-6 text-lime-600 mb-2" />
                  <div className="text-sm text-gray-600">Transmission</div>
                  <div className="text-xl font-black text-gray-900">{vehicle.transmission}</div>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <Fuel className="w-6 h-6 text-lime-600 mb-2" />
                  <div className="text-sm text-gray-600">Fuel Type</div>
                  <div className="text-xl font-black text-gray-900">{vehicle.fuelType}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {vehicle.description && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                {vehicle.engine && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Engine</span>
                    <span className="font-bold text-gray-900">{vehicle.engine}</span>
                  </div>
                )}
                {vehicle.drivetrain && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Drivetrain</span>
                    <span className="font-bold text-gray-900">{vehicle.drivetrain}</span>
                  </div>
                )}
                {vehicle.exteriorColor && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Exterior Color</span>
                    <span className="font-bold text-gray-900">{vehicle.exteriorColor}</span>
                  </div>
                )}
                {vehicle.interiorColor && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Interior Color</span>
                    <span className="font-bold text-gray-900">{vehicle.interiorColor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-lime-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="flex-1 px-8 py-4 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all shadow-lg hover:shadow-lime-500/50"
              >
                REQUEST INFO
              </button>
              <a
                href="tel:+971501234567"
                className="flex-1 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all text-center"
              >
                CALL NOW
              </a>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white">
              <h4 className="text-xl font-black mb-3">International Shipping Available</h4>
              <p className="text-gray-300 mb-4">
                We ship worldwide with reliable carriers. Serving African markets and beyond.
              </p>
              <Link href="/shipping" className="inline-flex items-center text-lime-500 font-bold hover:text-lime-400 transition-colors">
                Learn more about shipping →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-gray-900">Contact Us</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-lime-500 focus:outline-none transition-all"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-lime-500 focus:outline-none transition-all"
                />
                <input
                  type="tel"
                  required
                  placeholder="Your Phone"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-lime-500 focus:outline-none transition-all"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Your Message"
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-lime-500 focus:outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-lime-500 text-black font-black rounded-2xl hover:bg-lime-400 transition-all"
                >
                  SEND MESSAGE
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}



