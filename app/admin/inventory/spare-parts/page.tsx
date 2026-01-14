'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Search, Edit2, Trash2, Package, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { SparePart, SparePartCondition, SparePartStatus, SparePartCategory } from '@/types/database';
import { ImageUpload } from '@/components/admin/image-upload';
import { MultipleImageUpload } from '@/components/admin/multiple-image-upload';

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState<Partial<SparePart> | null>(null);

  const categories: { value: SparePartCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'engine_parts', label: 'Engine Parts' },
    { value: 'transmission', label: 'Transmission' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'body_parts', label: 'Body Parts' },
    { value: 'interior', label: 'Interior' },
    { value: 'wheels_tires', label: 'Wheels & Tires' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'fluids_filters', label: 'Fluids & Filters' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'exhaust', label: 'Exhaust' },
    { value: 'cooling', label: 'Cooling' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'spare_parts'));
      const parts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SparePart[];
      setSpareParts(parts);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      toast.error('Failed to load spare parts');
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = spareParts.filter((part) => {
    const matchesSearch = 
      part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingPart({
      name: '',
      partNumber: '',
      manufacturer: '',
      category: 'other',
      condition: 'new',
      status: 'in_stock',
      price: 0,
      stockQuantity: 0,
      images: [],
      thumbnailUrl: '',
      description: '',
      specifications: {},
      compatibleVehicles: [],
      isFeatured: false,
      views: 0,
      orders: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (part: SparePart) => {
    setEditingPart(part);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingPart) return;

    try {
      if (editingPart.id) {
        // Update existing
        const partRef = doc(db, 'spare_parts', editingPart.id);
        await updateDoc(partRef, {
          ...editingPart,
          updatedAt: Timestamp.now(),
        });
        toast.success('Spare part updated successfully');
      } else {
        // Add new
        await addDoc(collection(db, 'spare_parts'), {
          ...editingPart,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          createdBy: 'admin', // Replace with actual user ID
        });
        toast.success('Spare part added successfully');
      }
      
      setShowModal(false);
      setEditingPart(null);
      fetchSpareParts();
    } catch (error) {
      console.error('Error saving spare part:', error);
      toast.error('Failed to save spare part');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spare part?')) return;

    try {
      await deleteDoc(doc(db, 'spare_parts', id));
      toast.success('Spare part deleted successfully');
      fetchSpareParts();
    } catch (error) {
      console.error('Error deleting spare part:', error);
      toast.error('Failed to delete spare part');
    }
  };

  const getStatusColor = (status: SparePartStatus) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-700';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      case 'discontinued':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Spare Parts & Accessories</h1>
            <p className="text-gray-600">Manage your spare parts inventory and stock levels</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
          >
            <Plus className="w-5 h-5" />
            Add Spare Part
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Parts</p>
                <p className="text-2xl font-bold text-gray-900">{spareParts.length}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spareParts.filter(p => p.status === 'in_stock').length}
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
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spareParts.filter(p => p.status === 'low_stock').length}
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
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spareParts.filter(p => p.status === 'out_of_stock').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, part number, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading spare parts...</div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No spare parts found. Click "Add Spare Part" to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{part.name}</h3>
                    <p className="text-sm text-gray-500">PN: {part.partNumber}</p>
                    <p className="text-sm text-gray-500">{part.manufacturer}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(part.status)}`}>
                    {part.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Category: {part.category.replace('_', ' ')}</p>
                  <p className="text-2xl font-black text-gray-900">${part.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {part.stockQuantity} units</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(part)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(part.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && editingPart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900">
                  {editingPart.id ? 'Edit Spare Part' : 'Add New Spare Part'}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Part Name *</label>
                    <input
                      type="text"
                      value={editingPart.name}
                      onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="e.g., Brake Pad Set"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Part Number *</label>
                    <input
                      type="text"
                      value={editingPart.partNumber}
                      onChange={(e) => setEditingPart({ ...editingPart, partNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="e.g., BP-12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer *</label>
                    <input
                      type="text"
                      value={editingPart.manufacturer}
                      onChange={(e) => setEditingPart({ ...editingPart, manufacturer: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="e.g., Brembo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      value={editingPart.category}
                      onChange={(e) => setEditingPart({ ...editingPart, category: e.target.value as SparePartCategory })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                    >
                      {categories.filter(c => c.value !== 'all').map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
                    <select
                      value={editingPart.condition}
                      onChange={(e) => setEditingPart({ ...editingPart, condition: e.target.value as SparePartCondition })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                      <option value="oem">OEM</option>
                      <option value="aftermarket">Aftermarket</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      value={editingPart.status}
                      onChange={(e) => setEditingPart({ ...editingPart, status: e.target.value as SparePartStatus })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      value={editingPart.price}
                      onChange={(e) => setEditingPart({ ...editingPart, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      value={editingPart.stockQuantity}
                      onChange={(e) => setEditingPart({ ...editingPart, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingPart.description}
                    onChange={(e) => setEditingPart({ ...editingPart, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                    rows={4}
                    placeholder="Detailed description of the spare part..."
                  />
                </div>

                {/* Thumbnail Image */}
                <div>
                  <ImageUpload
                    value={editingPart.thumbnailUrl || ''}
                    onChange={(url) => setEditingPart({ ...editingPart, thumbnailUrl: url })}
                    label="Thumbnail Image (Main Display)"
                    folder="spare-parts/thumbnails"
                  />
                </div>

                {/* Product Images Gallery */}
                <div className="col-span-2">
                  <MultipleImageUpload
                    images={editingPart.images || []}
                    onChange={(images) => setEditingPart({ ...editingPart, images })}
                    label="Product Images Gallery"
                    folder="spare-parts/gallery"
                    maxImages={8}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPart(null);
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
                >
                  {editingPart.id ? 'Update Part' : 'Add Part'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

