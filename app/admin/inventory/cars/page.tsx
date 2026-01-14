'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, Edit2, Search, Filter, Car, DollarSign, Calendar, Gauge, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useSiteConfigStore } from '@/store/site-config';
import { MultipleImageUpload } from '@/components/admin/multiple-image-upload';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuel: string;
  transmission: string;
  category: string;
  description: string;
  features: string[];
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
}

export default function InventoryEditorPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchVehicles();
  }, [fetchConfig]);

  // List of standardized features
  const standardFeatures = [
    'Navigation System',
    'Leather Seats',
    'Sunroof/Moonroof',
    'Parking Sensors',
    'Backup Camera',
    'Blind Spot Monitoring',
    'Lane Departure Warning',
    'Adaptive Cruise Control',
    'Heated Seats',
    'Ventilated Seats',
    'Premium Sound System',
    'Apple CarPlay',
    'Android Auto',
    'Bluetooth Connectivity',
    'Keyless Entry',
    'Push Button Start',
    'Remote Start',
    'Dual-Zone Climate Control',
    'Power Liftgate',
    'LED Headlights',
    'Fog Lights',
    'Alloy Wheels',
    'Paddle Shifters',
    'Sport Mode',
    'All-Wheel Drive',
    '360° Camera',
    'Head-Up Display',
    'Wireless Charging',
    'Memory Seats',
    'Power Adjustable Seats',
    'Ambient Lighting',
    'Panoramic Roof'
  ];

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Filter features to only include standardized ones
        const features = data.features ? data.features.filter((f: string) => standardFeatures.includes(f)) : [];
        return {
          id: doc.id,
          name: data.name || '',
          brand: data.brand || '',
          model: data.model || '',
          year: data.year || new Date().getFullYear(),
          price: data.price || 0,
          mileage: data.mileage || '',
          fuel: data.fuel || 'Gasoline',
          transmission: data.transmission || 'Automatic',
          category: data.category || 'luxury-sedans',
          description: data.description || '',
          features,
          images: data.images || [],
          status: data.status || 'available',
          createdAt: data.createdAt || new Date().toISOString(),
        } as Vehicle;
      });
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingVehicle({
      id: '',
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: '',
      fuel: 'Gasoline',
      transmission: 'Automatic',
      category: 'luxury-sedans',
      description: '',
      features: [],
      images: [],
      status: 'available',
      createdAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    // Filter features to only include standardized ones
    const cleanedFeatures = vehicle.features ? vehicle.features.filter(f => standardFeatures.includes(f)) : [];
    setEditingVehicle({
      ...vehicle,
      features: cleanedFeatures
    });
    setShowModal(true);
  };

  const handleSaveVehicle = async () => {
    if (!editingVehicle) return;

    setSaving(true);
    try {
      if (editingVehicle.id) {
        // Update existing
        const docRef = doc(db, 'vehicles', editingVehicle.id);
        await updateDoc(docRef, editingVehicle as any);
        toast.success('Vehicle updated successfully!');
      } else {
        // Add new
        await addDoc(collection(db, 'vehicles'), editingVehicle);
        toast.success('Vehicle added successfully!');
      }

      await fetchVehicles();
      setShowModal(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await deleteDoc(doc(db, 'vehicles', id));
      toast.success('Vehicle deleted successfully!');
      await fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Cars & Vehicles Inventory</h1>
            <p className="text-gray-600">Manage your vehicle inventory, specifications, and pricing</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-lime-100 rounded-lg">
                <Car className="w-5 h-5 text-lime-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.status === 'available').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.status === 'reserved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicles.filter(v => v.status === 'sold').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {config?.categories?.items?.map((cat: any) => (
              <option key={cat.id} value={cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading vehicles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-800 relative">
                  {vehicle.images[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : vehicle.status === 'sold'
                          ? 'bg-red-100 text-red-700'
                          : vehicle.status === 'reserved'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {vehicle.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">
                      {vehicle.brand} {vehicle.model} • {vehicle.year}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-lime-600" />
                      <span className="font-semibold text-gray-900">${vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gauge className="w-4 h-4 text-gray-500" />
                      <span>{vehicle.mileage}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredVehicles.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-600">
                {searchTerm || filterCategory !== 'all'
                  ? 'No vehicles found matching your filters.'
                  : 'No vehicles yet. Click "Add Vehicle" to get started.'}
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && editingVehicle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full my-8 flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVehicle.id ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Vehicle Name</label>
                  <input
                    type="text"
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="2024 Porsche 911 GT3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Brand</label>
                  <input
                    type="text"
                    value={editingVehicle.brand}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="Porsche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Model</label>
                  <input
                    type="text"
                    value={editingVehicle.model}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="911 GT3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Year</label>
                  <input
                    type="number"
                    value={editingVehicle.year}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={editingVehicle.price}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Mileage</label>
                  <input
                    type="text"
                    value={editingVehicle.mileage}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="12,000 miles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Fuel Type</label>
                  <select
                    value={editingVehicle.fuel}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  >
                    <option>Gasoline</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Transmission</label>
                  <select
                    value={editingVehicle.transmission}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                    <option>Semi-Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Category</label>
                  <select
                    value={editingVehicle.category}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  >
                    {config?.categories?.items?.map((cat: any) => (
                      <option key={cat.id} value={cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                  <select
                    value={editingVehicle.status}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                  <textarea
                    value={editingVehicle.description}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Describe the vehicle..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-3">Features</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Navigation System',
                        'Leather Seats',
                        'Sunroof/Moonroof',
                        'Parking Sensors',
                        'Backup Camera',
                        'Blind Spot Monitoring',
                        'Lane Departure Warning',
                        'Adaptive Cruise Control',
                        'Heated Seats',
                        'Ventilated Seats',
                        'Premium Sound System',
                        'Apple CarPlay',
                        'Android Auto',
                        'Bluetooth Connectivity',
                        'Keyless Entry',
                        'Push Button Start',
                        'Remote Start',
                        'Dual-Zone Climate Control',
                        'Power Liftgate',
                        'LED Headlights',
                        'Fog Lights',
                        'Alloy Wheels',
                        'Paddle Shifters',
                        'Sport Mode',
                        'All-Wheel Drive',
                        '360° Camera',
                        'Head-Up Display',
                        'Wireless Charging',
                        'Memory Seats',
                        'Power Adjustable Seats',
                        'Ambient Lighting',
                        'Panoramic Roof',
                      ].map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={editingVehicle.features.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingVehicle({
                                  ...editingVehicle,
                                  features: [...editingVehicle.features, feature],
                                });
                              } else {
                                setEditingVehicle({
                                  ...editingVehicle,
                                  features: editingVehicle.features.filter((f) => f !== feature),
                                });
                              }
                            }}
                            className="w-4 h-4 text-lime-600 bg-white border-gray-300 rounded focus:ring-lime-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {editingVehicle.features.length} feature{editingVehicle.features.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <MultipleImageUpload
                    images={editingVehicle.images}
                    onChange={(images) => setEditingVehicle({ ...editingVehicle, images })}
                    label="Vehicle Images"
                    folder="vehicles"
                    maxImages={10}
                  />
                </div>
              </div>
              {/* End Scrollable Content */}
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingVehicle(null);
                    }}
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVehicle}
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Vehicle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

