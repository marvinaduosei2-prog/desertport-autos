'use client';

import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Car, Wrench, TrendingUp, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function InventoryHubPage() {
  const router = useRouter();
  const [carsCount, setCarsCount] = useState(0);
  const [sparePartsCount, setSparePartsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get cars count
        const carsSnapshot = await getDocs(collection(db, 'vehicles'));
        setCarsCount(carsSnapshot.size);

        // Get spare parts count
        const sparePartsSnapshot = await getDocs(collection(db, 'spare_parts'));
        setSparePartsCount(sparePartsSnapshot.size);
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const inventoryTypes = [
    {
      id: 'cars',
      title: 'Cars & Vehicles',
      description: 'Manage your vehicle inventory, specifications, pricing, and availability',
      icon: Car,
      count: carsCount,
      color: 'lime',
      route: '/admin/inventory/cars',
      stats: [
        { label: 'Active Listings', value: loading ? '...' : carsCount },
        { label: 'Categories', value: '4+' },
      ],
    },
    {
      id: 'spare-parts',
      title: 'Spare Parts & Accessories',
      description: 'Manage spare parts, accessories, and merchandise inventory',
      icon: Wrench,
      count: sparePartsCount,
      color: 'blue',
      route: '/admin/inventory/spare-parts',
      stats: [
        { label: 'Active Products', value: loading ? '...' : sparePartsCount },
        { label: 'Categories', value: 'Multi' },
      ],
    },
  ];

  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Choose an inventory type to manage</p>
          </div>
        </div>

        {/* Inventory Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {inventoryTypes.map((type, index) => {
            const Icon = type.icon;
            const colorClasses = {
              lime: 'from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700',
              blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            };

            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => router.push(type.route)}
                className="group cursor-pointer"
              >
                <div className="relative h-full p-8 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Gradient Glow on Hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[type.color as 'lime' | 'blue']} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
                  
                  {/* Content */}
                  <div className="relative space-y-6">
                    {/* Icon & Title */}
                    <div className="flex items-start justify-between">
                      <div className={`p-4 bg-gradient-to-br ${colorClasses[type.color as 'lime' | 'blue']} rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-gray-900">{type.count}</div>
                        <div className="text-sm text-gray-500">Total Items</div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-lime-600 transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      {type.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <div className={`w-full py-3 text-center bg-gradient-to-r ${colorClasses[type.color as 'lime' | 'blue']} text-white font-bold rounded-xl group-hover:shadow-lg transition-all duration-300`}>
                        Manage {type.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">
                  {loading ? '...' : carsCount + sparePartsCount}
                </div>
                <div className="text-sm text-gray-600">Total Inventory</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">2</div>
                <div className="text-sm text-gray-600">Inventory Types</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">Active</div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
