'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Save, Plus, Trash2, Link as LinkIcon, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { MapPicker } from '@/components/admin/map-picker';
import { LogoUploader } from '@/components/admin/logo-uploader';

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export default function SiteSettingsPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);

  // Site Info
  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [showSiteName, setShowSiteName] = useState(true); // Show text alongside logo
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [mapLat, setMapLat] = useState(25.2048); // Dubai default
  const [mapLng, setMapLng] = useState(55.2708); // Dubai default

  // Footer Links
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>([]);
  const [serviceLinks, setServiceLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Colors
  const [primaryColor, setPrimaryColor] = useState('#84cc16');
  const [accentColor, setAccentColor] = useState('#22c55e');

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      console.log('Settings loaded:', config);
      setSiteName(config.siteName || 'DesertPort Autos');
      setSiteTagline(config.siteTagline || 'Redefining luxury automotive experiences');
      setLogoUrl(config.branding?.logoUrl || '');
      setFaviconUrl(config.branding?.faviconUrl || '');
      setShowSiteName(config.branding?.showSiteName !== false); // Default to true
      setContactEmail(config.footer?.contact?.email || 'info@desertport.com');
      setContactPhone(config.footer?.contact?.phone || '+971 50 123 4567');
      setWhatsappNumber(config.footer?.contact?.whatsapp || '+971 50 123 4567');
      setAddress(config.footer?.contact?.address || '123 Luxury Lane, Dubai, UAE');
      setMapLat(config.footer?.contact?.mapLat || 25.2048);
      setMapLng(config.footer?.contact?.mapLng || 55.2708);
      setQuickLinks(config.footer?.quickLinks || [
        { id: '1', label: 'Inventory', href: '/inventory' },
        { id: '2', label: 'About Us', href: '/about' },
        { id: '3', label: 'Contact', href: '/contact' },
        { id: '4', label: 'Financing', href: '/financing' }
      ]);
      setServiceLinks(config.footer?.serviceLinks || [
        { id: '1', label: 'Trade-In', href: '/trade-in' },
        { id: '2', label: 'Consignment', href: '/consignment' },
        { id: '3', label: 'Worldwide Shipping', href: '/shipping' },
        { id: '4', label: 'Extended Warranty', href: '/warranty' }
      ]);
      setSocialLinks(config.footer?.socialLinks || [
        { id: '1', platform: 'Facebook', url: '#' },
        { id: '2', platform: 'Instagram', url: '#' },
        { id: '3', platform: 'Twitter', url: '#' },
        { id: '4', platform: 'LinkedIn', url: '#' }
      ]);
      setPrimaryColor(config.design?.colors?.primary || '#84cc16');
      setAccentColor(config.design?.colors?.accent || '#22c55e');
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_config', 'main');
      await updateDoc(docRef, {
        siteName,
        siteTagline,
        'branding.logoUrl': logoUrl,
        'branding.faviconUrl': faviconUrl,
        'branding.showSiteName': showSiteName,
        'footer.contact.email': contactEmail,
        'footer.contact.phone': contactPhone,
        'footer.contact.whatsapp': whatsappNumber,
        'footer.contact.address': address,
        'footer.contact.mapLat': mapLat,
        'footer.contact.mapLng': mapLng,
        'footer.quickLinks': quickLinks,
        'footer.serviceLinks': serviceLinks,
        'footer.socialLinks': socialLinks,
        'design.colors.primary': primaryColor,
        'design.colors.accent': accentColor,
      });

      // Force config refresh
      await fetchConfig();
      
      console.log('✅ Settings saved successfully');
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addQuickLink = () => {
    setQuickLinks([...quickLinks, { id: `link-${Date.now()}`, label: '', href: '' }]);
  };

  const updateQuickLink = (id: string, field: string, value: string) => {
    setQuickLinks(quickLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const deleteQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter((link) => link.id !== id));
  };

  const addServiceLink = () => {
    setServiceLinks([...serviceLinks, { id: `link-${Date.now()}`, label: '', href: '' }]);
  };

  const updateServiceLink = (id: string, field: string, value: string) => {
    setServiceLinks(serviceLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const deleteServiceLink = (id: string) => {
    setServiceLinks(serviceLinks.filter((link) => link.id !== id));
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: `social-${Date.now()}`, platform: 'Facebook', url: '' }]);
  };

  const updateSocialLink = (id: string, field: string, value: string) => {
    setSocialLinks(socialLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Site Settings</h1>
            <p className="text-gray-600">Configure your website's global settings</p>
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

        {/* Site Information */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Site Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Tagline</label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Branding (Logo & Favicon) */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Branding</h2>
            <p className="text-sm text-gray-600">
              Upload your logo and favicon to customize your brand identity
            </p>
          </div>

          {/* Show Site Name Toggle */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="showSiteName"
                checked={showSiteName}
                onChange={(e) => setShowSiteName(e.target.checked)}
                className="mt-1 w-5 h-5 text-lime-600 rounded focus:ring-lime-500"
              />
              <div className="flex-1">
                <label htmlFor="showSiteName" className="font-bold text-gray-900 cursor-pointer block mb-1">
                  Show Site Name alongside Logo
                </label>
                <p className="text-sm text-gray-700">
                  When enabled, "DESERTPORT AUTOS" text will appear next to your logo. 
                  Disable for logo-only display.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Uploader */}
            <div className="p-6 bg-gray-50 border border-gray-300 rounded-xl">
              <LogoUploader
                currentLogoUrl={logoUrl}
                onUploadComplete={async (url) => {
                  console.log('🖼️ Logo uploaded, URL:', url);
                  setLogoUrl(url);
                  
                  // Save to Firebase immediately
                  try {
                    const docRef = doc(db, 'site_config', 'main');
                    await updateDoc(docRef, {
                      'branding.logoUrl': url,
                    });
                    await fetchConfig();
                    console.log('✅ Logo saved to Firebase');
                  } catch (error) {
                    console.error('❌ Error saving logo:', error);
                  }
                }}
                onRemove={async () => {
                  console.log('🗑️ Removing logo');
                  setLogoUrl('');
                  
                  try {
                    const docRef = doc(db, 'site_config', 'main');
                    await updateDoc(docRef, {
                      'branding.logoUrl': '',
                    });
                    await fetchConfig();
                    console.log('✅ Logo removed from Firebase');
                  } catch (error) {
                    console.error('❌ Error removing logo:', error);
                  }
                }}
                type="logo"
              />
            </div>

            {/* Favicon Uploader */}
            <div className="p-6 bg-gray-50 border border-gray-300 rounded-xl">
              <LogoUploader
                currentLogoUrl={faviconUrl}
                onUploadComplete={async (url) => {
                  console.log('🎯 Favicon uploaded, URL:', url);
                  setFaviconUrl(url);
                  
                  try {
                    const docRef = doc(db, 'site_config', 'main');
                    await updateDoc(docRef, {
                      'branding.faviconUrl': url,
                    });
                    await fetchConfig();
                    console.log('✅ Favicon saved to Firebase');
                  } catch (error) {
                    console.error('❌ Error saving favicon:', error);
                  }
                }}
                onRemove={async () => {
                  console.log('🗑️ Removing favicon');
                  setFaviconUrl('');
                  
                  try {
                    const docRef = doc(db, 'site_config', 'main');
                    await updateDoc(docRef, {
                      'branding.faviconUrl': '',
                    });
                    await fetchConfig();
                    console.log('✅ Favicon removed from Firebase');
                  } catch (error) {
                    console.error('❌ Error removing favicon:', error);
                  }
                }}
                type="favicon"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                <Phone size={16} /> Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                <MessageCircle size={16} /> WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Include country code (e.g., +971 for UAE)
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                <MapPin size={16} /> Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Map Location Picker */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Map Location</h2>
            <p className="text-sm text-gray-600 mb-4">
              Set the location that will be displayed on your Contact page
            </p>
          </div>
          <MapPicker
            initialLat={mapLat}
            initialLng={mapLng}
            onLocationChange={(lat, lng, addr) => {
              console.log('📍 Location changed:', { lat, lng, addr });
              setMapLat(lat);
              setMapLng(lng);
              // Always update address when location is selected
              if (addr) {
                setAddress(addr);
                toast.success('Address updated! Click "Save Changes" to apply.', {
                  duration: 3000,
                });
              }
            }}
          />
        </div>

        {/* Colors */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Brand Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Primary Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Accent Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quick Links */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Footer Quick Links</h2>
            <button
              onClick={addQuickLink}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus size={18} />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateQuickLink(link.id, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateQuickLink(link.id, 'href', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => deleteQuickLink(link.id)}
                  className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Service Links */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Footer Service Links</h2>
            <button
              onClick={addServiceLink}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus size={18} />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {serviceLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateServiceLink(link.id, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateServiceLink(link.id, 'href', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => deleteServiceLink(link.id)}
                  className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Social Media Links</h2>
            <button
              onClick={addSocialLink}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus size={18} />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => deleteSocialLink(link.id)}
                  className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

