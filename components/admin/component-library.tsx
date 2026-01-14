'use client';

import { motion } from 'framer-motion';
import { Plus, Sparkles, Layers, Grid3X3, Image as ImageIcon, Type, Square } from 'lucide-react';
import { toast } from 'sonner';

export const COMPONENT_TEMPLATES = [
  {
    id: 'hero-video',
    name: 'Video Hero',
    category: 'hero',
    icon: <Sparkles size={20} />,
    description: 'Full-screen video hero with headline',
    thumbnail: '/templates/hero-video.jpg',
    section: {
      name: 'Video Hero Section',
      type: 'hero',
      enabled: true,
      styles: {
        colors: {
          background: '#0a0a0a',
          foreground: '#ffffff',
          primary: '#84cc16',
          secondary: '#22c55e',
          accent: '#fbbf24',
          muted: '#6b7280',
          border: 'rgba(255,255,255,0.1)',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { heading: '8xl', subheading: '2xl', body: 'lg', small: 'sm' },
          fontWeight: { heading: 'black', subheading: 'bold', body: 'medium' },
          lineHeight: { heading: '1', body: '1.8' },
          letterSpacing: { heading: '-0.03em', body: '0.01em' },
        },
        spacing: {
          paddingTop: '2xl',
          paddingBottom: '2xl',
          paddingLeft: 'xl',
          paddingRight: 'xl',
          marginTop: 'none',
          marginBottom: 'none',
          gap: 'xl',
        },
        layout: {
          type: 'full-width',
          maxWidth: '7xl',
          alignment: 'center',
          columns: { mobile: 1, tablet: 1, desktop: 1 },
        },
      },
      content: {
        videoUrl: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
        headline: 'Experience Luxury',
        subheadline: 'Drive the Future Today',
        ctaText: 'Explore Collection',
      },
    },
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    category: 'features',
    icon: <Grid3X3 size={20} />,
    description: '3-column feature grid with icons',
    thumbnail: '/templates/feature-grid.jpg',
    section: {
      name: 'Feature Grid',
      type: 'features',
      enabled: true,
      styles: {
        colors: {
          background: '#ffffff',
          foreground: '#000000',
          primary: '#84cc16',
          secondary: '#22c55e',
          accent: '#fbbf24',
          muted: '#6b7280',
          border: 'rgba(0,0,0,0.1)',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { heading: '4xl', subheading: 'xl', body: 'base', small: 'sm' },
          fontWeight: { heading: 'bold', subheading: 'semibold', body: 'normal' },
          lineHeight: { heading: '1.2', body: '1.7' },
          letterSpacing: { heading: '0', body: '0' },
        },
        spacing: {
          paddingTop: 'xl',
          paddingBottom: 'xl',
          paddingLeft: 'md',
          paddingRight: 'md',
          marginTop: 'none',
          marginBottom: 'none',
          gap: 'lg',
        },
        layout: {
          type: 'contained',
          maxWidth: '6xl',
          alignment: 'center',
          columns: { mobile: 1, tablet: 2, desktop: 3 },
        },
      },
      content: {
        features: [
          { icon: 'shield', title: 'Secure', description: 'Bank-level security' },
          { icon: 'zap', title: 'Fast', description: 'Lightning-fast performance' },
          { icon: 'heart', title: 'Loved', description: 'Rated 5 stars' },
        ],
      },
    },
  },
  {
    id: 'image-text',
    name: 'Image + Text',
    category: 'content',
    icon: <Layers size={20} />,
    description: 'Side-by-side image and text',
    thumbnail: '/templates/image-text.jpg',
    section: {
      name: 'Image + Text Section',
      type: 'content',
      enabled: true,
      styles: {
        colors: {
          background: '#f9fafb',
          foreground: '#111827',
          primary: '#84cc16',
          secondary: '#22c55e',
          accent: '#fbbf24',
          muted: '#6b7280',
          border: 'rgba(0,0,0,0.1)',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { heading: '5xl', subheading: 'lg', body: 'base', small: 'sm' },
          fontWeight: { heading: 'black', subheading: 'semibold', body: 'normal' },
          lineHeight: { heading: '1.1', body: '1.7' },
          letterSpacing: { heading: '-0.02em', body: '0' },
        },
        spacing: {
          paddingTop: 'xl',
          paddingBottom: 'xl',
          paddingLeft: 'lg',
          paddingRight: 'lg',
          marginTop: 'none',
          marginBottom: 'none',
          gap: 'lg',
        },
        layout: {
          type: 'contained',
          maxWidth: '7xl',
          alignment: 'left',
          columns: { mobile: 1, tablet: 1, desktop: 2 },
        },
      },
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
        imagePosition: 'left',
        headline: 'Designed for Performance',
        body: 'Every detail crafted to perfection. Experience the pinnacle of engineering and design.',
        ctaText: 'Learn More',
      },
    },
  },
  {
    id: 'testimonial-slider',
    name: 'Testimonials',
    category: 'social-proof',
    icon: <Type size={20} />,
    description: 'Customer testimonial slider',
    thumbnail: '/templates/testimonials.jpg',
    section: {
      name: 'Testimonials',
      type: 'testimonials',
      enabled: true,
      styles: {
        colors: {
          background: '#ffffff',
          foreground: '#000000',
          primary: '#84cc16',
          secondary: '#22c55e',
          accent: '#fbbf24',
          muted: '#6b7280',
          border: 'rgba(0,0,0,0.1)',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { heading: '3xl', subheading: 'lg', body: 'base', small: 'sm' },
          fontWeight: { heading: 'bold', subheading: 'medium', body: 'normal' },
          lineHeight: { heading: '1.3', body: '1.8' },
          letterSpacing: { heading: '0', body: '0' },
        },
        spacing: {
          paddingTop: 'xl',
          paddingBottom: 'xl',
          paddingLeft: 'md',
          paddingRight: 'md',
          marginTop: 'none',
          marginBottom: 'none',
          gap: 'md',
        },
        layout: {
          type: 'contained',
          maxWidth: '5xl',
          alignment: 'center',
          columns: { mobile: 1, tablet: 2, desktop: 3 },
        },
      },
      content: {
        testimonials: [
          { name: 'John Doe', role: 'CEO', quote: 'Absolutely amazing service!', avatar: '' },
          { name: 'Jane Smith', role: 'Designer', quote: 'Best decision we ever made.', avatar: '' },
        ],
      },
    },
  },
  {
    id: 'cta-banner',
    name: 'CTA Banner',
    category: 'cta',
    icon: <Square size={20} />,
    description: 'Call-to-action banner',
    thumbnail: '/templates/cta-banner.jpg',
    section: {
      name: 'CTA Banner',
      type: 'cta',
      enabled: true,
      styles: {
        colors: {
          background: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
          foreground: '#ffffff',
          primary: '#ffffff',
          secondary: '#f0f9ff',
          accent: '#fbbf24',
          muted: 'rgba(255,255,255,0.7)',
          border: 'rgba(255,255,255,0.2)',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { heading: '6xl', subheading: 'xl', body: 'lg', small: 'base' },
          fontWeight: { heading: 'black', subheading: 'semibold', body: 'medium' },
          lineHeight: { heading: '1.1', body: '1.6' },
          letterSpacing: { heading: '-0.02em', body: '0' },
        },
        spacing: {
          paddingTop: '2xl',
          paddingBottom: '2xl',
          paddingLeft: 'xl',
          paddingRight: 'xl',
          marginTop: 'none',
          marginBottom: 'none',
          gap: 'lg',
        },
        layout: {
          type: 'full-width',
          maxWidth: '4xl',
          alignment: 'center',
          columns: { mobile: 1, tablet: 1, desktop: 1 },
        },
      },
      content: {
        headline: 'Ready to Get Started?',
        subheadline: 'Join thousands of satisfied customers today',
        ctaText: 'Start Your Journey',
        ctaLink: '/contact',
      },
    },
  },
];

interface ComponentLibraryProps {
  onAddSection: (section: any) => void;
}

export function ComponentLibrary({ onAddSection }: ComponentLibraryProps) {
  const categories = ['All', 'hero', 'features', 'content', 'social-proof', 'cta'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredTemplates = activeCategory === 'All'
    ? COMPONENT_TEMPLATES
    : COMPONENT_TEMPLATES.filter(t => t.category === activeCategory);

  const handleAddSection = (template: any) => {
    onAddSection({
      ...template.section,
      id: Date.now().toString(),
    });
    toast.success(`Added ${template.name} to page!`);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-lime-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="group relative p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-lime-600 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleAddSection(template)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-lime-100 text-lime-700 rounded-lg group-hover:bg-lime-600 group-hover:text-white transition-colors">
                {template.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900 mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="p-1.5 bg-lime-600 text-white rounded-full"
              >
                <Plus size={14} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No templates in this category</p>
        </div>
      )}
    </div>
  );
}

// Add React import
import React from 'react';

