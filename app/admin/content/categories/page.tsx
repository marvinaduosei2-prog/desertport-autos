'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, GripVertical, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageUpload } from '@/components/admin/image-upload';

interface Category {
  id: string;
  name: string;
  description: string;
  count: string;
  imageUrl: string;
  slug: string;
  link: string;
}

function SortableCategory({ category, onEdit, onDelete }: { category: Category; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
        {category.imageUrl && (
          <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-500">{category.description}</p>
        <p className="text-xs text-lime-500 mt-1">{category.count}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 rounded-lg transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CategoriesEditorPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, number>>({});
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchConfig();
    fetchVehicleCounts();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.categories) {
      setHeading(config.categories.heading || 'Premium Collections');
      setSubheading(config.categories.subheading || 'Explore our meticulously curated categories of the world\'s finest automobiles');
      setCategories(config.categories.items || []);
    }
  }, [config]);

  const fetchVehicleCounts = async () => {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const snapshot = await getDocs(vehiclesRef);
      const counts: Record<string, number> = {};
      
      snapshot.docs.forEach((doc) => {
        const vehicle = doc.data();
        const category = vehicle.category || 'uncategorized';
        counts[category] = (counts[category] || 0) + 1;
      });
      
      setVehicleCounts(counts);
      console.log('Vehicle counts by category:', counts);
    } catch (error) {
      console.error('Error fetching vehicle counts:', error);
    }
  };

  useEffect(() => {
    if (config) {
      console.log('Categories loaded:', config.categories);
      const cats = config.categories?.items || [
        { id: '1', name: 'Luxury Sedans', slug: 'luxury-sedans', count: '0', description: 'Unparalleled comfort and sophistication', imageUrl: '', link: '/inventory' },
        { id: '2', name: 'Sports Cars', slug: 'sports-cars', count: '0', description: 'Engineered for pure adrenaline', imageUrl: '', link: '/inventory' },
        { id: '3', name: 'Luxury SUVs', slug: 'luxury-suvs', count: '0', description: 'Commanding presence, refined power', imageUrl: '', link: '/inventory' },
        { id: '4', name: 'Exotic & Rare', slug: 'exotic-rare', count: '0', description: 'For the true connoisseur', imageUrl: '', link: '/inventory' }
      ];
      
      // Update counts with actual vehicle counts
      const catsWithCounts = cats.map(cat => {
        const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const count = vehicleCounts[slug] || 0;
        return {
          ...cat,
          slug,
          count: count > 0 ? `${count}${count >= 10 ? '+' : ''}` : '0'
        };
      });
      
      setCategories(catsWithCounts);
    }
  }, [config, vehicleCounts]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_config', 'main');
      await updateDoc(docRef, {
        'categories.heading': heading,
        'categories.subheading': subheading,
        'categories.items': categories,
      });

      await fetchConfig();
      toast.success('Categories updated successfully!');
    } catch (error) {
      console.error('Error saving categories:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory({
      id: `category-${Date.now()}`,
      name: '',
      description: '',
      count: '0',
      imageUrl: '',
      slug: '',
      link: '/inventory'
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    // Auto-generate slug from name if empty
    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Use /spare-parts for spare parts category, otherwise use inventory with category filter
    const link = slug === 'spare-parts-accessories' 
      ? '/spare-parts' 
      : `/inventory?category=${slug}`;
    
    const categoryToSave = {
      ...editingCategory,
      slug,
      link
    };

    const existingIndex = categories.findIndex((c) => c.id === categoryToSave.id);
    if (existingIndex >= 0) {
      // Update existing
      setCategories(categories.map((c) => (c.id === categoryToSave.id ? categoryToSave : c)));
    } else {
      // Add new
      setCategories([...categories, categoryToSave]);
    }
    
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Manage vehicle categories</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-3 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-xl transition"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </div>

        {/* Section Text Editor */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Section Text</h3>
            <p className="text-sm text-gray-500 mb-4">Customize the heading and description for the categories section</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Premium Collections"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              <p className="text-xs text-gray-500 mt-1">The last word will be highlighted in lime green</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subheading
              </label>
              <textarea
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="Explore our meticulously curated categories of the world's finest automobiles"
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <p className="text-sm text-gray-500">Drag to reorder categories</p>
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {categories.map((category) => (
                  <SortableCategory
                    key={category.id}
                    category={category}
                    onEdit={() => openEditModal(category)}
                    onDelete={() => handleDelete(category.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {categories.length === 0 && (
            <p className="text-center text-gray-600 py-12">No categories yet. Click "Add Category" to get started.</p>
          )}
        </div>

        {/* Modal */}
        {showModal && editingCategory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {categories.find((c) => c.id === editingCategory.id) ? 'Edit Category' : 'Add Category'}
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setEditingCategory({ ...editingCategory, name, slug });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                  placeholder="Luxury Sedans"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Slug <span className="text-xs text-gray-500">(Auto-generated from name)</span>
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none font-mono text-sm"
                  placeholder="luxury-sedans"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This slug must match the category value in vehicle documents (e.g., "sports-cars", "luxury-sedans")
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none resize-none"
                  rows={2}
                  placeholder="Unparalleled comfort and sophistication"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Count (Auto-Calculated)</label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 font-mono">
                  {editingCategory.count || '0'} vehicles
                </div>
                <p className="text-xs text-gray-500 mt-1">Count is automatically calculated based on inventory</p>
              </div>

              <ImageUpload
                value={editingCategory.imageUrl}
                onChange={(url) => setEditingCategory({ ...editingCategory, imageUrl: url })}
                label="Category Image (Required)"
                folder="categories"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

