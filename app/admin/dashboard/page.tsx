'use client';

import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Car, Grid3x3, MessageSquare, TrendingUp, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useSiteConfigStore } from '@/store/site-config';

const quickActions = [
  { title: 'Add New Vehicle', href: '/admin/content/inventory?new=true', icon: Car, color: 'lime' },
  { title: 'Edit Hero Section', href: '/admin/content/hero', icon: TrendingUp, color: 'blue' },
  { title: 'Manage Categories', href: '/admin/content/categories', icon: Grid3x3, color: 'purple' },
  { title: 'Add Testimonial', href: '/admin/content/testimonials?new=true', icon: Users, color: 'orange' },
];

export default function AdminDashboard() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [vehicleCount, setVehicleCount] = useState(0);
  const [recentVehicles, setRecentVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
    fetchDashboardData();
  }, [fetchConfig]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all vehicles
      const vehiclesRef = collection(db, 'vehicles');
      const vehiclesSnap = await getDocs(vehiclesRef);
      setVehicleCount(vehiclesSnap.size);

      // Fetch recent vehicles (last 3)
      const recentQuery = query(vehiclesRef, orderBy('createdAt', 'desc'), limit(3));
      const recentSnap = await getDocs(recentQuery);
      const recent = recentSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentVehicles(recent);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const stats = [
    { icon: Car, label: 'Total Vehicles', value: loading ? '...' : vehicleCount.toString(), change: 'In inventory', color: 'lime' },
    { icon: Grid3x3, label: 'Categories', value: loading ? '...' : (config?.categories?.items?.length || 0).toString(), change: 'Active', color: 'blue' },
    { icon: MessageSquare, label: 'Testimonials', value: loading ? '...' : (config?.testimonials?.items?.length || 0).toString(), change: 'Published', color: 'purple' },
    { icon: TrendingUp, label: 'Hero Headlines', value: loading ? '...' : (config?.hero?.headlines?.length || 0).toString(), change: 'Rotating', color: 'orange' },
  ];
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your site today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-lime-500 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-lime-600 hover:shadow-lg transition"
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <Icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <p className="font-bold text-gray-900 group-hover:text-lime-600 transition">{action.title}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Vehicles */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Vehicles</h3>
              <Link href="/admin/content/inventory" className="text-xs text-lime-600 hover:text-lime-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentVehicles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No vehicles yet. <Link href="/admin/content/inventory?new=true" className="text-lime-600 hover:underline">Add your first vehicle</Link>
                </div>
              ) : (
                recentVehicles.map((vehicle) => (
                  <Link 
                    key={vehicle.id} 
                    href={`/admin/content/inventory?edit=${vehicle.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {vehicle.images?.[0] && (
                        <img src={vehicle.images[0]} alt={vehicle.name || 'Vehicle'} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{vehicle.name || 'Untitled Vehicle'}</p>
                      <p className="text-xs text-gray-500">{vehicle.brand || 'Unknown Brand'} • {vehicle.model || 'Unknown Model'}</p>
                    </div>
                    <span className="text-xs text-lime-600 font-semibold">{vehicle.status?.toUpperCase() || 'ACTIVE'}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Website Status</span>
                <span className="flex items-center gap-2 text-lime-600 text-sm font-semibold">
                  <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center gap-2 text-lime-600 text-sm font-semibold">
                  <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Firebase Storage</span>
                <span className="flex items-center gap-2 text-lime-600 text-sm font-semibold">
                  <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

