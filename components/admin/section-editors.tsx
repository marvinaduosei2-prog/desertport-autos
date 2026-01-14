'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Type, 
  Image as ImageIcon, 
  Plus, 
  Trash2,
  Upload,
  Link as LinkIcon,
  TrendingUp,
  Sparkles,
  FileText,
  Star,
  Grid3X3,
  MessageSquare,
  DollarSign,
  Calendar,
  Gauge,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { SectionDesignPanel } from './section-design-panel';

// ===================== HERO SECTION EDITOR =====================
export function HeroSectionEditor({ config, onUpdate }: any) {
  console.log('🎬 HeroSectionEditor received config:', {
    hasConfig: !!config,
    hasHero: !!config?.hero,
    headlines: config?.hero?.headlines?.length || 0,
    stats: config?.hero?.stats?.length || 0,
    fullHero: config?.hero
  });

  const hero = config?.hero || {
    videoUrl: '',
    headlines: [],
    rotationSpeed: 3,
    stats: []
  };

  console.log('🎬 Hero data to display:', {
    headlines: hero.headlines?.length || 0,
    stats: hero.stats?.length || 0,
    videoUrl: hero.videoUrl
  });

  const addHeadline = () => {
    const newHeadlines = [
      ...(hero.headlines || []),
      { id: Date.now().toString(), text: 'New Headline' }
    ];
    onUpdate({ hero: { ...hero, headlines: newHeadlines } });
  };

  const updateHeadline = (id: string, text: string) => {
    const updatedHeadlines = hero.headlines.map((h: any) => 
      h.id === id ? { ...h, text } : h
    );
    onUpdate({ hero: { ...hero, headlines: updatedHeadlines } });
  };

  const deleteHeadline = (id: string) => {
    const filtered = hero.headlines.filter((h: any) => h.id !== id);
    onUpdate({ hero: { ...hero, headlines: filtered } });
  };

  const addStat = () => {
    const newStats = [
      ...(hero.stats || []),
      { id: Date.now().toString(), label: 'New Stat', value: '100+', icon: 'star', enabled: true }
    ];
    onUpdate({ hero: { ...hero, stats: newStats } });
  };

  const updateStat = (id: string, updates: any) => {
    const updatedStats = hero.stats.map((s: any) => 
      s.id === id ? { ...s, ...updates } : s
    );
    onUpdate({ hero: { ...hero, stats: updatedStats } });
  };

  const deleteStat = (id: string) => {
    const filtered = hero.stats.filter((s: any) => s.id !== id);
    onUpdate({ hero: { ...hero, stats: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="hero"
      designConfig={hero.design || {}}
      onChange={(design) => onUpdate({ hero: { ...hero, design } })}
    >
      <div className="space-y-6">
        <EditorField
          icon={<Video size={16} />}
          label="Background Video URL"
          value={hero.videoUrl}
          onChange={(value) => onUpdate({ hero: { ...hero, videoUrl: value } })}
          placeholder="https://videos.pexels.com/..."
        />

        <DynamicList
        icon={<Type size={16} />}
        label="Rotating Headlines"
        items={hero.headlines || []}
        onAdd={addHeadline}
        onUpdate={updateHeadline}
        onDelete={deleteHeadline}
        renderItem={(item, update, remove) => (
          <textarea
            value={item.text}
            onChange={(e) => update(item.id, e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
            rows={2}
          />
        )}
      />

      <EditorField
        icon={<TrendingUp size={16} />}
        label="Rotation Speed (seconds)"
        type="number"
        value={hero.rotationSpeed}
        onChange={(value) => onUpdate({ hero: { ...hero, rotationSpeed: parseInt(value) || 3 } })}
        min={1}
        max={10}
      />

      <DynamicList
        icon={<TrendingUp size={16} />}
        label="Stats Counter"
        items={hero.stats || []}
        onAdd={addStat}
        onUpdate={updateStat}
        onDelete={deleteStat}
        renderItem={(item, update, remove) => (
          <div className="space-y-2">
            <input
              type="text"
              value={item.value}
              onChange={(e) => update(item.id, { value: e.target.value })}
              placeholder="100+"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-lime-500"
            />
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(item.id, { label: e.target.value })}
              placeholder="Label"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-lime-500"
            />
            <ToggleSwitch
              label="Enabled"
              value={item.enabled}
              onChange={(value) => update(item.id, { enabled: value })}
            />
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== ABOUT SECTION EDITOR =====================
export function AboutSectionEditor({ config, onUpdate }: any) {
  const about = config?.about || {
    title: 'Why Choose Us',
    subtitle: 'Excellence in Every Detail',
    cards: []
  };

  const addCard = () => {
    const newCards = [
      ...(about.cards || []),
      { 
        id: Date.now().toString(), 
        icon: 'shield',
        title: 'New Feature',
        description: 'Feature description goes here'
      }
    ];
    onUpdate({ about: { ...about, cards: newCards } });
  };

  const updateCard = (id: string, updates: any) => {
    const updatedCards = about.cards.map((c: any) => 
      c.id === id ? { ...c, ...updates } : c
    );
    onUpdate({ about: { ...about, cards: updatedCards } });
  };

  const deleteCard = (id: string) => {
    const filtered = about.cards.filter((c: any) => c.id !== id);
    onUpdate({ about: { ...about, cards: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="about"
      designConfig={about.design || {}}
      onChange={(design) => onUpdate({ about: { ...about, design } })}
    >
      <div className="space-y-6">
        <EditorField
          label="Section Title"
          value={about.title}
          onChange={(value) => onUpdate({ about: { ...about, title: value } })}
        />

        <EditorField
          label="Section Subtitle"
          value={about.subtitle}
          onChange={(value) => onUpdate({ about: { ...about, subtitle: value } })}
        />

        <DynamicList
        label="Feature Cards (3 recommended)"
        items={about.cards || []}
        onAdd={addCard}
        onUpdate={updateCard}
        onDelete={deleteCard}
        renderItem={(item, update, remove) => (
          <div className="space-y-3">
            <select
              value={item.icon}
              onChange={(e) => update(item.id, { icon: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="shield">Shield (Security)</option>
              <option value="star">Star (Premium)</option>
              <option value="check">Check (Quality)</option>
              <option value="zap">Zap (Speed)</option>
              <option value="heart">Heart (Care)</option>
            </select>
            <input
              type="text"
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder="Feature Title"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Feature description..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
              rows={3}
            />
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== CATEGORIES SECTION EDITOR =====================
export function CategoriesSectionEditor({ config, onUpdate }: any) {
  const categories = config?.categories || {
    title: 'Browse by Category',
    subtitle: 'Find Your Perfect Ride',
    items: []
  };

  const addCategory = () => {
    const newItems = [
      ...(categories.items || []),
      { 
        id: Date.now().toString(),
        name: 'New Category',
        description: 'Discover amazing vehicles',
        imageUrl: '',
        link: '/inventory'
      }
    ];
    onUpdate({ categories: { ...categories, items: newItems } });
  };

  const updateCategory = (id: string, updates: any) => {
    const updatedItems = categories.items.map((c: any) => 
      c.id === id ? { ...c, ...updates } : c
    );
    onUpdate({ categories: { ...categories, items: updatedItems } });
  };

  const deleteCategory = (id: string) => {
    const filtered = categories.items.filter((c: any) => c.id !== id);
    onUpdate({ categories: { ...categories, items: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="categories"
      designConfig={categories.design || {}}
      onChange={(design) => onUpdate({ categories: { ...categories, design } })}
    >
      <div className="space-y-6">
        <EditorField
          label="Section Title"
          value={categories.title}
          onChange={(value) => onUpdate({ categories: { ...categories, title: value } })}
        />

      <EditorField
        label="Section Subtitle"
        value={categories.subtitle}
        onChange={(value) => onUpdate({ categories: { ...categories, subtitle: value } })}
      />

      <DynamicList
        label="Category Cards (4 recommended for 2x2 grid)"
        items={categories.items || []}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        renderItem={(item, update, remove) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="Category Name"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Category description..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
              rows={2}
            />
            <input
              type="url"
              value={item.imageUrl}
              onChange={(e) => update(item.id, { imageUrl: e.target.value })}
              placeholder="Image URL"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              value={item.link}
              onChange={(e) => update(item.id, { link: e.target.value })}
              placeholder="Link URL (e.g., /inventory?cat=suv)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== EXPERIENCE SECTION EDITOR =====================
export function ExperienceSectionEditor({ config, onUpdate }: any) {
  const experience = config?.experience || {
    title: 'The DesertPort Experience',
    subtitle: 'More Than Just A Car Dealership',
    features: []
  };

  const addFeature = () => {
    const newFeatures = [
      ...(experience.features || []),
      {
        id: Date.now().toString(),
        icon: 'star',
        title: 'New Feature',
        description: 'Feature description'
      }
    ];
    onUpdate({ experience: { ...experience, features: newFeatures } });
  };

  const updateFeature = (id: string, updates: any) => {
    const updatedFeatures = experience.features.map((f: any) => 
      f.id === id ? { ...f, ...updates } : f
    );
    onUpdate({ experience: { ...experience, features: updatedFeatures } });
  };

  const deleteFeature = (id: string) => {
    const filtered = experience.features.filter((f: any) => f.id !== id);
    onUpdate({ experience: { ...experience, features: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="experience"
      designConfig={experience.design || {}}
      onChange={(design) => onUpdate({ experience: { ...experience, design } })}
    >
      <div className="space-y-6">
        <EditorField
          label="Section Title"
          value={experience.title}
          onChange={(value) => onUpdate({ experience: { ...experience, title: value } })}
        />

      <EditorField
        label="Section Subtitle"
        value={experience.subtitle}
        onChange={(value) => onUpdate({ experience: { ...experience, subtitle: value } })}
      />

      <DynamicList
        label="Experience Features"
        items={experience.features || []}
        onAdd={addFeature}
        onUpdate={updateFeature}
        onDelete={deleteFeature}
        renderItem={(item, update, remove) => (
          <div className="space-y-3">
            <select
              value={item.icon}
              onChange={(e) => update(item.id, { icon: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="star">Star</option>
              <option value="shield">Shield</option>
              <option value="award">Award</option>
              <option value="thumbs-up">Thumbs Up</option>
              <option value="check-circle">Check Circle</option>
            </select>
            <input
              type="text"
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder="Feature Title"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Feature description..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
              rows={2}
            />
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== TESTIMONIALS SECTION EDITOR =====================
export function TestimonialsSectionEditor({ config, onUpdate }: any) {
  const testimonials = config?.testimonials || {
    title: 'What Our Clients Say',
    subtitle: 'Real Stories from Real Customers',
    items: []
  };

  const addTestimonial = () => {
    const newItems = [
      ...(testimonials.items || []),
      {
        id: Date.now().toString(),
        name: 'Customer Name',
        role: 'Customer Title',
        quote: 'Amazing experience!',
        avatar: '',
        rating: 5
      }
    ];
    onUpdate({ testimonials: { ...testimonials, items: newItems } });
  };

  const updateTestimonial = (id: string, updates: any) => {
    const updatedItems = testimonials.items.map((t: any) => 
      t.id === id ? { ...t, ...updates } : t
    );
    onUpdate({ testimonials: { ...testimonials, items: updatedItems } });
  };

  const deleteTestimonial = (id: string) => {
    const filtered = testimonials.items.filter((t: any) => t.id !== id);
    onUpdate({ testimonials: { ...testimonials, items: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="testimonials"
      designConfig={testimonials.design || {}}
      onChange={(design) => onUpdate({ testimonials: { ...testimonials, design } })}
    >
      <div className="space-y-6">
        <EditorField
          label="Section Title"
          value={testimonials.title}
          onChange={(value) => onUpdate({ testimonials: { ...testimonials, title: value } })}
        />

        <EditorField
          label="Section Subtitle"
          value={testimonials.subtitle}
          onChange={(value) => onUpdate({ testimonials: { ...testimonials, subtitle: value } })}
        />

        <DynamicList
        label="Customer Testimonials"
        items={testimonials.items || []}
        onAdd={addTestimonial}
        onUpdate={updateTestimonial}
        onDelete={deleteTestimonial}
        renderItem={(item, update, remove) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="Customer Name"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              value={item.role}
              onChange={(e) => update(item.id, { role: e.target.value })}
              placeholder="Role/Title"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <textarea
              value={item.quote}
              onChange={(e) => update(item.id, { quote: e.target.value })}
              placeholder="Testimonial quote..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
              rows={3}
            />
            <input
              type="url"
              value={item.avatar}
              onChange={(e) => update(item.id, { avatar: e.target.value })}
              placeholder="Avatar Image URL"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={item.rating}
                onChange={(e) => update(item.id, { rating: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== NAVIGATION EDITOR =====================
export function NavigationEditor({ config, onUpdate }: any) {
  const navigation = config?.navigation || {
    logoText: 'DesertPort Autos',
    menuItems: []
  };

  const addMenuItem = () => {
    const newItems = [
      ...(navigation.menuItems || []),
      { id: Date.now().toString(), label: 'New Link', href: '/', enabled: true }
    ];
    onUpdate({ navigation: { ...navigation, menuItems: newItems } });
  };

  const updateMenuItem = (id: string, updates: any) => {
    const updated = navigation.menuItems.map((item: any) => 
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate({ navigation: { ...navigation, menuItems: updated } });
  };

  const deleteMenuItem = (id: string) => {
    const filtered = navigation.menuItems.filter((item: any) => item.id !== id);
    onUpdate({ navigation: { ...navigation, menuItems: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="navigation"
      designConfig={navigation.design || {}}
      onChange={(design) => onUpdate({ navigation: { ...navigation, design } })}
    >
      <div className="space-y-6">
        <EditorField
          label="Logo Text"
          value={navigation.logoText}
          onChange={(value) => onUpdate({ navigation: { ...navigation, logoText: value } })}
        />

      <DynamicList
        label="Menu Items"
        items={navigation.menuItems || []}
        onAdd={addMenuItem}
        onUpdate={updateMenuItem}
        onDelete={deleteMenuItem}
        renderItem={(item, update, remove) => (
          <div className="space-y-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(item.id, { label: e.target.value })}
              placeholder="Label"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              value={item.href}
              onChange={(e) => update(item.id, { href: e.target.value })}
              placeholder="URL (e.g., /about)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <ToggleSwitch
              label="Enabled"
              value={item.enabled}
              onChange={(value) => update(item.id, { enabled: value })}
            />
          </div>
        )}
      />
      </div>
    </SectionDesignPanel>
  );
}

// ===================== FOOTER EDITOR =====================
export function FooterEditor({ config, onUpdate }: any) {
  const footer = config?.footer || {
    companyName: 'DesertPort Autos',
    tagline: '',
    email: '',
    phone: '',
    quickLinks: [],
    resources: [],
    legal: []
  };

  const addLink = (column: 'quickLinks' | 'resources' | 'legal') => {
    const newLinks = [
      ...(footer[column] || []),
      { id: Date.now().toString(), label: 'New Link', href: '/' }
    ];
    onUpdate({ footer: { ...footer, [column]: newLinks } });
  };

  const updateLink = (column: string, id: string, updates: any) => {
    const updated = footer[column].map((link: any) => 
      link.id === id ? { ...link, ...updates } : link
    );
    onUpdate({ footer: { ...footer, [column]: updated } });
  };

  const deleteLink = (column: string, id: string) => {
    const filtered = footer[column].filter((link: any) => link.id !== id);
    onUpdate({ footer: { ...footer, [column]: filtered } });
  };

  return (
    <SectionDesignPanel
      sectionId="footer"
      designConfig={footer.design || {}}
      onChange={(design) => onUpdate({ footer: { ...footer, design } })}
    >
      <div className="space-y-6">
        <EditorField label="Company Name" value={footer.companyName} onChange={(value) => onUpdate({ footer: { ...footer, companyName: value } })} />
        <EditorField label="Tagline" value={footer.tagline} onChange={(value) => onUpdate({ footer: { ...footer, tagline: value } })} multiline />
        <EditorField label="Email" value={footer.email} onChange={(value) => onUpdate({ footer: { ...footer, email: value } })} type="email" />
        <EditorField label="Phone" value={footer.phone} onChange={(value) => onUpdate({ footer: { ...footer, phone: value } })} type="tel" />

      {(['quickLinks', 'resources', 'legal'] as const).map((column) => (
        <DynamicList
          key={column}
          label={column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          items={footer[column] || []}
          onAdd={() => addLink(column)}
          onUpdate={(id: string, updates: any) => updateLink(column, id, updates)}
          onDelete={(id: string) => deleteLink(column, id)}
          renderItem={(item, update, remove) => (
            <div className="flex gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => update(item.id, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => update(item.id, { href: e.target.value })}
                placeholder="/url"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
          )}
        />
      ))}
      </div>
    </SectionDesignPanel>
  );
}

// ===================== REUSABLE COMPONENTS =====================

function EditorField({ icon, label, value, onChange, placeholder, type = 'text', multiline = false, min, max }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
        {icon && <span className="text-lime-400">{icon}</span>}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
        />
      )}
    </div>
  );
}

function DynamicList({ icon, label, items, onAdd, onUpdate, onDelete, renderItem }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          {icon && <span className="text-lime-400">{icon}</span>}
          {label}
        </label>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold rounded-lg hover:bg-lime-500/20 transition-all flex items-center gap-1"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-lg relative">
            <button
              onClick={() => onDelete(item.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} />
            </button>
            <div className="pr-10">
              {renderItem(item, onUpdate, onDelete)}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-6 bg-white/5 border border-white/10 border-dashed rounded-lg text-center">
            <p className="text-sm text-gray-400">No items yet. Click "Add" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({ label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-lime-500' : 'bg-gray-700'
        }`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
          animate={{ x: value ? 24 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </button>
    </div>
  );
}

// ===================== GENERIC EDITOR (for Featured Vehicles - shows vehicle count) =====================
export function FeaturedVehiclesEditor({ section }: any) {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-lime-500/5 border border-lime-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Star className="w-8 h-8 text-lime-500" />
          <div>
            <p className="text-white font-semibold">Featured Vehicles</p>
            <p className="text-xs text-gray-400">Automatically shows vehicles from inventory</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-3">
          This section automatically displays featured vehicles from your inventory. 
          Go to <span className="text-lime-400 font-bold">Inventory Manager</span> to add/edit vehicles and mark them as featured.
        </p>
      </div>
    </div>
  );
}

export function GenericSectionEditor({ section }: any) {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
        <Sparkles className="w-12 h-12 mx-auto text-gray-500 mb-3" />
        <p className="text-white font-semibold mb-2">Editor Not Available</p>
        <p className="text-xs text-gray-400">
          This section doesn't have a custom editor yet
        </p>
      </div>
    </div>
  );
}
