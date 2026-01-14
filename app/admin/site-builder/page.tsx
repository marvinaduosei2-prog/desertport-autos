'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSiteConfigStore } from '@/stores/site-config-store';
import { AdminLayout } from '@/components/admin/admin-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateSiteConfig } from '@/lib/actions';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Eye } from 'lucide-react';

export default function AdminSiteBuilderPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuthStore();
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    brandName: '',
    brandLogo: '',
    heroVideoUrl: '',
    heroFallbackImageUrl: '',
    heroHeadline: '',
    heroSubheadline: '',
    heroCtaText: '',
    heroCtaLink: '',
    heroOverlayOpacity: 50,
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    contactHours: '',
    globalAlerts: [] as Array<{
      id: string;
      message: string;
      type: 'info' | 'warning' | 'success' | 'error';
      enabled: boolean;
      link?: string;
      linkText?: string;
    }>,
    footerLinks: [] as Array<{
      id: string;
      label: string;
      url: string;
      section: 'company' | 'legal' | 'social';
    }>,
  });

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    if (config) {
      setFormData({
        brandName: config.brandName,
        brandLogo: config.brandLogo,
        heroVideoUrl: config.hero.videoUrl,
        heroFallbackImageUrl: config.hero.fallbackImageUrl || '',
        heroHeadline: config.hero.headline,
        heroSubheadline: config.hero.subheadline,
        heroCtaText: config.hero.ctaText,
        heroCtaLink: config.hero.ctaLink,
        heroOverlayOpacity: config.hero.overlayOpacity,
        contactPhone: config.contactInfo.phone,
        contactEmail: config.contactInfo.email,
        contactAddress: config.contactInfo.address,
        contactHours: config.contactInfo.hours,
        globalAlerts: config.globalAlerts,
        footerLinks: config.footerLinks,
      });
    }
  }, [config]);

  const handleAddAlert = () => {
    setFormData({
      ...formData,
      globalAlerts: [
        ...formData.globalAlerts,
        {
          id: Date.now().toString(),
          message: '',
          type: 'info',
          enabled: true,
        },
      ],
    });
  };

  const handleRemoveAlert = (id: string) => {
    setFormData({
      ...formData,
      globalAlerts: formData.globalAlerts.filter(alert => alert.id !== id),
    });
  };

  const handleUpdateAlert = (id: string, updates: Partial<typeof formData.globalAlerts[0]>) => {
    setFormData({
      ...formData,
      globalAlerts: formData.globalAlerts.map(alert =>
        alert.id === id ? { ...alert, ...updates } : alert
      ),
    });
  };

  const handleAddFooterLink = () => {
    setFormData({
      ...formData,
      footerLinks: [
        ...formData.footerLinks,
        {
          id: Date.now().toString(),
          label: '',
          url: '',
          section: 'company',
        },
      ],
    });
  };

  const handleRemoveFooterLink = (id: string) => {
    setFormData({
      ...formData,
      footerLinks: formData.footerLinks.filter(link => link.id !== id),
    });
  };

  const handleUpdateFooterLink = (id: string, updates: Partial<typeof formData.footerLinks[0]>) => {
    setFormData({
      ...formData,
      footerLinks: formData.footerLinks.map(link =>
        link.id === id ? { ...link, ...updates } : link
      ),
    });
  };

  const handleSave = async () => {
    setSaving(true);

    const configData = {
      brandName: formData.brandName,
      brandLogo: formData.brandLogo,
      hero: {
        videoUrl: formData.heroVideoUrl,
        fallbackImageUrl: formData.heroFallbackImageUrl,
        headline: formData.heroHeadline,
        subheadline: formData.heroSubheadline,
        ctaText: formData.heroCtaText,
        ctaLink: formData.heroCtaLink,
        overlayOpacity: formData.heroOverlayOpacity,
      },
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        address: formData.contactAddress,
        hours: formData.contactHours,
      },
      globalAlerts: formData.globalAlerts,
      footerLinks: formData.footerLinks,
    };

    const result = await updateSiteConfig(configData);
    if (result.success) {
      toast.success('Site configuration updated! Refreshing...');
      await fetchConfig();
    } else {
      toast.error(result.error || 'Failed to update configuration');
    }

    setSaving(false);
  };

  if (authLoading || role !== 'admin' || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Site Builder</h1>
            <p className="text-white/70">Configure your website's appearance and content</p>
          </div>
          <div className="flex space-x-4">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="glass">
                <Eye className="w-5 h-5 mr-2" />
                Preview Site
              </Button>
            </a>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Brand Settings */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Brand Settings</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Brand Name"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              />
              <Input
                label="Brand Logo URL"
                value={formData.brandLogo}
                onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                placeholder="/logo.svg"
              />
            </div>
          </GlassCard>

          {/* Hero Section */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-6">
              <Input
                label="Video URL"
                value={formData.heroVideoUrl}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
              <Input
                label="Fallback Image URL (optional)"
                value={formData.heroFallbackImageUrl}
                onChange={(e) => setFormData({ ...formData, heroFallbackImageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Headline"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                />
                <Input
                  label="Subheadline"
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                />
                <Input
                  label="CTA Button Text"
                  value={formData.heroCtaText}
                  onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                />
                <Input
                  label="CTA Button Link"
                  value={formData.heroCtaLink}
                  onChange={(e) => setFormData({ ...formData, heroCtaLink: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Overlay Opacity: {formData.heroOverlayOpacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.heroOverlayOpacity}
                  onChange={(e) => setFormData({ ...formData, heroOverlayOpacity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Global Alerts */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Global Alerts</h2>
              <Button variant="glass" size="sm" onClick={handleAddAlert}>
                <Plus className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </div>
            <div className="space-y-4">
              {formData.globalAlerts.map((alert) => (
                <div key={alert.id} className="bg-white/5 rounded-xl p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="Message"
                          value={alert.message}
                          onChange={(e) => handleUpdateAlert(alert.id, { message: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Type</label>
                        <select
                          value={alert.type}
                          onChange={(e) => handleUpdateAlert(alert.id, { type: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="success">Success</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center space-x-3 text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={alert.enabled}
                            onChange={(e) => handleUpdateAlert(alert.id, { enabled: e.target.checked })}
                            className="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-primary-600"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>
                      <Input
                        label="Link (optional)"
                        value={alert.link || ''}
                        onChange={(e) => handleUpdateAlert(alert.id, { link: e.target.value })}
                      />
                      <Input
                        label="Link Text (optional)"
                        value={alert.linkText || ''}
                        onChange={(e) => handleUpdateAlert(alert.id, { linkText: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveAlert(alert.id)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.globalAlerts.length === 0 && (
                <p className="text-center text-white/50 py-8">No alerts configured</p>
              )}
            </div>
          </GlassCard>

          {/* Footer Links */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Footer Links</h2>
              <Button variant="glass" size="sm" onClick={handleAddFooterLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
            <div className="space-y-4">
              {formData.footerLinks.map((link) => (
                <div key={link.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input
                        label="Label"
                        value={link.label}
                        onChange={(e) => handleUpdateFooterLink(link.id, { label: e.target.value })}
                      />
                      <Input
                        label="URL"
                        value={link.url}
                        onChange={(e) => handleUpdateFooterLink(link.id, { url: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Section</label>
                        <select
                          value={link.section}
                          onChange={(e) => handleUpdateFooterLink(link.id, { section: e.target.value as any })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="company">Company</option>
                          <option value="legal">Legal</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFooterLink(link.id)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Contact Info */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
              <Input
                label="Email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              <Input
                label="Address"
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
              />
              <Input
                label="Hours"
                value={formData.contactHours}
                onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
              />
            </div>
          </GlassCard>

          {/* Save Button (bottom) */}
          <div className="flex justify-end">
            <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving Changes...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

