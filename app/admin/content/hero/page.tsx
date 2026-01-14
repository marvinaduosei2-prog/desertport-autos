'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, Video, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function HeroEditorPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    headlines: [] as { id: string; text: string }[],
    subheadline: '',
    rotationSpeed: 3000,
    videoUrl: '',
    floatingVideoUrl: '',
    stats: [] as { id: string; value: string; label: string }[],
  });

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      console.log('Hero config loaded:', config);
      setFormData({
        headlines: config.hero?.headlines || [
          { id: '1', text: 'DRIVE THE FUTURE' },
          { id: '2', text: 'LUXURY REDEFINED' },
          { id: '3', text: 'POWER MEETS ELEGANCE' },
          { id: '4', text: 'YOUR DREAM AWAITS' }
        ],
        subheadline: config.hero?.subheadline || 'Experience automotive excellence redefined',
        rotationSpeed: config.hero?.rotationSpeed || 3000,
        videoUrl: config.hero?.videoUrl || 'https://res.cloudinary.com/luxuryp/video/upload/c_scale,w_1280,q_auto/v1654110148/Untitled-2_xeebmu.mp4',
        floatingVideoUrl: config.hero?.floatingVideoUrl || 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
        stats: config.hero?.stats || [
          { id: '1', label: 'Premium Vehicles', value: '100+' },
          { id: '2', label: 'Years Excellence', value: '15+' },
          { id: '3', label: 'Happy Clients', value: '1000+' }
        ],
      });
      setLoading(false);
    }
  }, [config]);

  const addHeadline = () => {
    setFormData({
      ...formData,
      headlines: [
        ...formData.headlines,
        { id: `headline-${Date.now()}`, text: '' },
      ],
    });
  };

  const updateHeadline = (id: string, text: string) => {
    setFormData({
      ...formData,
      headlines: formData.headlines.map((h) =>
        h.id === id ? { ...h, text } : h
      ),
    });
  };

  const removeHeadline = (id: string) => {
    setFormData({
      ...formData,
      headlines: formData.headlines.filter((h) => h.id !== id),
    });
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [
        ...formData.stats,
        { id: `stat-${Date.now()}`, value: '', label: '' },
      ],
    });
  };

  const updateStat = (id: string, field: 'value' | 'label', value: string) => {
    setFormData({
      ...formData,
      stats: formData.stats.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const removeStat = (id: string) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((s) => s.id !== id),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_config', 'main');
      
      console.log('💾 Saving hero stats:', formData.stats);
      
      await updateDoc(docRef, {
        'hero.headlines': formData.headlines,
        'hero.subheadline': formData.subheadline,
        'hero.rotationSpeed': formData.rotationSpeed,
        'hero.videoUrl': formData.videoUrl,
        'hero.floatingVideoUrl': formData.floatingVideoUrl,
        'hero.stats': formData.stats, // Fixed: was 'heroStats', should be 'hero.stats'
      });

      await fetchConfig();
      console.log('✅ Hero stats saved successfully');
      toast.success('Hero section updated successfully!');
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Loading hero section...</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Hero Section</h1>
            <p className="text-gray-600">Manage your homepage hero content</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Rotating Headlines */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rotating Headlines</h2>
              <p className="text-sm text-gray-500">These headlines will rotate automatically</p>
            </div>
            <button
              onClick={addHeadline}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Headline
            </button>
          </div>

          <div className="space-y-3">
            {formData.headlines.map((headline) => (
              <div key={headline.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={headline.text}
                  onChange={(e) => updateHeadline(headline.id, e.target.value)}
                  placeholder="Enter headline..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => removeHeadline(headline.id)}
                  className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {formData.headlines.length === 0 && (
              <p className="text-center text-gray-600 py-8">No headlines yet. Click "Add Headline" to get started.</p>
            )}
          </div>

          {/* Rotation Speed */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Rotation Speed (milliseconds)
            </label>
            <input
              type="number"
              value={formData.rotationSpeed}
              onChange={(e) => setFormData({ ...formData, rotationSpeed: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Subheadline */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Subheadline</h2>
          <textarea
            value={formData.subheadline}
            onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
            placeholder="Enter subheadline..."
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none resize-none"
          />
        </div>

        {/* Video URLs */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6 text-lime-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Video Settings</h2>
              <p className="text-sm text-gray-500">Manage background and floating videos</p>
            </div>
          </div>
          
          {/* Hero Background Video */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hero Background Video
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://example.com/hero-background.mp4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">Fullscreen background video for hero section</p>
          </div>

          {/* Floating Card Video */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Floating Card Video
            </label>
            <input
              type="url"
              value={formData.floatingVideoUrl}
              onChange={(e) => setFormData({ ...formData, floatingVideoUrl: e.target.value })}
              placeholder="https://example.com/floating-video.mp4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">Small video card at bottom-right corner</p>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-lime-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hero Stats</h2>
                <p className="text-sm text-gray-500">Display key numbers below the hero</p>
              </div>
            </div>
            <button
              onClick={addStat}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {formData.stats.map((stat) => (
              <div key={stat.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                  placeholder="100+"
                  className="w-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                  placeholder="Premium Vehicles"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => removeStat(stat.id)}
                  className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {formData.stats.length === 0 && (
              <p className="text-center text-gray-600 py-8">No stats yet. Click "Add Stat" to get started.</p>
            )}
          </div>
        </div>

        {/* Save Button (Bottom) */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-lime-600/20"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

