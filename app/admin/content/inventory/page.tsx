'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, Edit2, Search, Filter, Car, DollarSign, Calendar, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useSiteConfigStore } from '@/store/site-config';

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
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchVehicles();
  }, [fetchConfig]);

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
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
          features: data.features || [],
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
    setEditingVehicle(vehicle);
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

    return matchesSearch && matchesCategory;
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Inventory</h1>
            <p className="text-gray-600">Manage your vehicle listings</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-white placeholder-gray-500 focus:border-lime-600 focus:outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-white focus:border-lime-600 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {config?.categories?.items?.map((cat: any) => (
              <option key={cat.id} value={cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                {cat.name}
              </option>
            ))}
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
                className="bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition"
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
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        vehicle.status === 'available'
                          ? 'bg-lime-600 text-black'
                          : vehicle.status === 'sold'
                          ? 'bg-red-600 text-white'
                          : 'bg-orange-600 text-white'
                      }`}
                    >
                      {vehicle.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">
                      {vehicle.brand} {vehicle.model} • {vehicle.year}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4 text-lime-500" />
                      <span className="font-semibold text-gray-900">${vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gauge className="w-4 h-4 text-lime-500" />
                      <span>{vehicle.mileage}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="flex-1 px-3 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-semibold rounded-lg transition"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-3xl w-full my-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingVehicle.id ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>

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
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Image URLs (one per line)
                  </label>
                  <textarea
                    value={editingVehicle.images.join('\n')}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        images: e.target.value.split('\n').filter((url) => url.trim()),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none resize-none font-mono text-sm"
                    rows={3}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
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
        )}
      </div>
    </AdminDashboardLayout>
  );
}

