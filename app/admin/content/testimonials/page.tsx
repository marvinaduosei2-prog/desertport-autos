'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, Edit2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ImageUpload } from '@/components/admin/image-upload';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export default function TestimonialsEditorPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      console.log('Testimonials loaded:', config.testimonials);
      setTestimonials(config.testimonials?.items || [
        {
          id: '1',
          name: 'Michael Chen',
          role: 'CEO, Tech Ventures',
          content: 'The attention to detail and personalized service exceeded all expectations. Finding my dream Porsche was effortless.',
          rating: 5,
          image: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: '2',
          name: 'Sarah Williams',
          role: 'Investment Banker',
          content: 'DesertPort\'s expertise and transparency made the entire process seamless. I trust them completely with my automotive investments.',
          rating: 5,
          image: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          id: '3',
          name: 'David Rodriguez',
          role: 'Real Estate Developer',
          content: 'From selection to delivery, every touchpoint was exceptional. This is how luxury automotive retail should be done.',
          rating: 5,
          image: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
      ]);
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_config', 'main');
      await updateDoc(docRef, {
        'testimonials.items': testimonials,
      });

      await fetchConfig();
      toast.success('Testimonials updated successfully!');
    } catch (error) {
      console.error('Error saving testimonials:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingTestimonial({
      id: `testimonial-${Date.now()}`,
      name: '',
      role: '',
      content: '',
      rating: 5,
      image: '',
    });
    setShowModal(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return;

    const existingIndex = testimonials.findIndex((t) => t.id === editingTestimonial.id);
    if (existingIndex >= 0) {
      setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t)));
    } else {
      setTestimonials([...testimonials, editingTestimonial]);
    }
    
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Testimonials</h1>
            <p className="text-gray-600">Manage customer reviews and feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-3 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-xl transition"
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl hover:border-gray-300 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                    {testimonial.image && (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-lime-500 fill-lime-500" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(testimonial)}
                  className="flex-1 px-3 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-semibold rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-600">
              No testimonials yet. Click "Add Testimonial" to get started.
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && editingTestimonial && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {testimonials.find((t) => t.id === editingTestimonial.id) ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Role/Title</label>
                  <input
                    type="text"
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                    placeholder="CEO, Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Testimonial Content</label>
                <textarea
                  value={editingTestimonial.content}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none resize-none"
                  rows={4}
                  placeholder="This is the best service I've ever received..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Rating (1-5 stars)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
              </div>

              <ImageUpload
                value={editingTestimonial.image}
                onChange={(url) => setEditingTestimonial({ ...editingTestimonial, image: url })}
                label="Profile Image"
                folder="testimonials"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTestimonial(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTestimonial}
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

