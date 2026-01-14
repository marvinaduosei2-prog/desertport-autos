'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfigStore } from '@/store/site-config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageUpload } from '@/components/admin/image-upload';

interface AboutCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

function SortableCard({ card, onUpdate, onDelete }: { card: AboutCard; onUpdate: (id: string, field: string, value: string) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <button {...listeners} {...attributes} className="text-gray-400 hover:text-gray-600 cursor-grab mt-3">
        <GripVertical size={20} />
      </button>
      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={card.title}
          onChange={(e) => onUpdate(card.id, 'title', e.target.value)}
          placeholder="Card Title"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-lime-600 focus:outline-none"
        />
        <textarea
          value={card.description}
          onChange={(e) => onUpdate(card.id, 'description', e.target.value)}
          placeholder="Card description..."
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm resize-none focus:border-lime-600 focus:outline-none"
          rows={2}
        />
        <input
          type="text"
          value={card.iconName}
          onChange={(e) => onUpdate(card.id, 'iconName', e.target.value)}
          placeholder="Icon name (e.g., Shield, Award)"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-lime-600 focus:outline-none"
        />
      </div>
      <button
        onClick={() => onDelete(card.id)}
        className="mt-3 p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function AboutExperienceEditorPage() {
  const { config, fetchConfig } = useSiteConfigStore();
  const [saving, setSaving] = useState(false);
  const [aboutCards, setAboutCards] = useState<AboutCard[]>([]);
  const [aboutHeading, setAboutHeading] = useState('');
  const [aboutSubheading, setAboutSubheading] = useState('');
  const [experienceBenefits, setExperienceBenefits] = useState<string[]>([]);
  const [experienceImageUrl, setExperienceImageUrl] = useState('');
  const [experienceStats, setExperienceStats] = useState({
    satisfaction: '98%',
    availability: '24/7 Available',
    countries: '15+',
    clients: '5,000+',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      console.log('About/Experience loaded:', { about: config.about, experience: config.experience });
      console.log('About Cards from Firebase:', config.about?.cards);
      console.log('About Cards field names:', config.about?.cards?.[0] ? Object.keys(config.about.cards[0]) : 'No cards');
      
      setAboutHeading(config.about?.heading || 'Where Luxury Meets Performance');
      setAboutSubheading(config.about?.subheading || 'We don\'t just sell vehicles. We curate automotive masterpieces for those who appreciate the pinnacle of engineering, design, and exclusivity.');
      
      // Always load with defaults if Firebase is empty or undefined
      // Normalize the data: convert "icon" to "iconName" if needed
      const aboutCardsFromFirebase = config.about?.cards?.map((card: any) => ({
        id: card.id,
        title: card.title || '',
        description: card.description || '',
        iconName: card.iconName || card.icon || 'Shield', // Handle both field names!
      }));
      
      setAboutCards(aboutCardsFromFirebase?.length ? aboutCardsFromFirebase : [
        { id: '1', title: 'Certified Quality', description: 'Every vehicle undergoes rigorous inspection and certification', iconName: 'Shield' },
        { id: '2', title: 'Premium Selection', description: 'Curated collection of the world\'s finest automobiles', iconName: 'Award' },
        { id: '3', title: 'Investment Grade', description: 'Vehicles that appreciate and hold their value over time', iconName: 'TrendingUp' }
      ]);
      
      setExperienceBenefits(config.experience?.benefits?.length ? config.experience.benefits : [
        'Concierge service for seamless transactions',
        'Comprehensive vehicle history and certification',
        'Flexible financing and trade-in options',
        'White-glove delivery to your doorstep',
        'Lifetime support and vehicle care guidance',
        'Exclusive access to pre-launch inventory',
      ]);
      
      setExperienceImageUrl(config.experience?.imageUrl || '');
      
      setExperienceStats({
        satisfaction: config.experience?.stats?.satisfaction || '98%',
        availability: config.experience?.stats?.availability || '24/7 Available',
        countries: config.experience?.stats?.countries || '15+',
        clients: config.experience?.stats?.clients || '5,000+',
      });
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_config', 'main');
      
      // Normalize data before saving: convert iconName -> icon for Firebase
      const normalizedAboutCards = aboutCards.map(card => ({
        id: card.id,
        title: card.title,
        description: card.description,
        icon: card.iconName.toLowerCase(), // Convert "Shield" -> "shield"
      }));
      
      await updateDoc(docRef, {
        'about.heading': aboutHeading,
        'about.subheading': aboutSubheading,
        'about.cards': normalizedAboutCards,
        'experience.benefits': experienceBenefits,
        'experience.imageUrl': experienceImageUrl,
        'experience.stats': experienceStats,
      });

      await fetchConfig();
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCardUpdate = (id: string, field: string, value: string) => {
    setAboutCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const addAboutCard = () => {
    setAboutCards((prev) => [
      ...prev,
      {
        id: `card-${Date.now()}`,
        title: '',
        description: '',
        iconName: 'Star',
      },
    ]);
  };

  const deleteAboutCard = (id: string) => {
    setAboutCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleAboutDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAboutCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">About & Experience</h1>
            <p className="text-gray-600">Manage your company information and highlights</p>
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

        {/* About Section Heading & Subheading */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">About Section Title</h2>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Main Heading</label>
            <input
              type="text"
              value={aboutHeading}
              onChange={(e) => setAboutHeading(e.target.value)}
              placeholder="Where Luxury Meets Performance"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Subheading</label>
            <textarea
              value={aboutSubheading}
              onChange={(e) => setAboutSubheading(e.target.value)}
              placeholder="We don't just sell vehicles..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* About Section Cards */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">About Section Cards</h2>
            <button
              onClick={addAboutCard}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition"
            >
              <Plus size={18} />
              Add Card
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAboutDragEnd}>
            <SortableContext items={aboutCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {aboutCards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    onUpdate={handleCardUpdate}
                    onDelete={deleteAboutCard}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {aboutCards.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No cards yet. Click "Add Card" to get started.
            </div>
          )}
        </div>

        {/* Experience Benefits */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Experience Benefits</h2>
            <button
              onClick={() => setExperienceBenefits([...experienceBenefits, ''])}
              className="flex items-center gap-2 px-4 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-600 font-semibold rounded-lg transition"
            >
              <Plus size={18} />
              Add Benefit
            </button>
          </div>

          <div className="space-y-3">
            {experienceBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...experienceBenefits];
                    newBenefits[index] = e.target.value;
                    setExperienceBenefits(newBenefits);
                  }}
                  placeholder="Enter benefit text"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-lime-600 focus:outline-none"
                />
                <button
                  onClick={() => setExperienceBenefits(experienceBenefits.filter((_, i) => i !== index))}
                  className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {experienceBenefits.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No benefits yet. Click "Add Benefit" to get started.
            </div>
          )}
        </div>

        {/* Experience Image */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Experience Section Image</h2>
          <ImageUpload
            value={experienceImageUrl}
            onChange={setExperienceImageUrl}
            label="Experience Section Image"
            folder="about/experience"
          />
        </div>

        {/* Experience Stats */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Experience Stats</h2>
            <p className="text-sm text-gray-600">Update the trust indicators shown at the bottom of the Experience section</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Satisfaction Rate</label>
              <input
                type="text"
                value={experienceStats.satisfaction}
                onChange={(e) => setExperienceStats({ ...experienceStats, satisfaction: e.target.value })}
                placeholder="98%"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Availability</label>
              <input
                type="text"
                value={experienceStats.availability}
                onChange={(e) => setExperienceStats({ ...experienceStats, availability: e.target.value })}
                placeholder="24/7 Available"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Countries Served</label>
              <input
                type="text"
                value={experienceStats.countries}
                onChange={(e) => setExperienceStats({ ...experienceStats, countries: e.target.value })}
                placeholder="15+"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Total Clients</label>
              <input
                type="text"
                value={experienceStats.clients}
                onChange={(e) => setExperienceStats({ ...experienceStats, clients: e.target.value })}
                placeholder="5,000+"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-blue-600 mt-0.5">ℹ️</div>
            <p className="text-sm text-blue-800">
              These stats appear at the bottom of the "DesertPort Experience" section on the homepage.
            </p>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

