'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Car, Mail, Phone, Calendar, CheckCircle, Clock, FileText, Tag, Package } from 'lucide-react';
import { getInquiries, updateInquiryStatus, addInquiryNote } from '@/lib/actions';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  images?: string[];
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicleId: string;
  status: string;
  createdAt: any;
  vehicle?: VehicleData | null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [noteContent, setNoteContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    console.log('🔄 Starting to load inquiries...');
    setLoading(true);
    try {
      const result = await getInquiries();
      console.log('📥 Inquiry result:', result);
      if (result.success) {
        console.log('✅ Inquiries loaded successfully:', result.data.length, 'items');
        setInquiries(result.data as Inquiry[]);
      } else {
        console.error('❌ Failed to load inquiries:', result.error);
        toast.error(result.error || 'Failed to load inquiries');
      }
    } catch (error) {
      console.error('💥 Exception loading inquiries:', error);
      toast.error('Failed to load inquiries');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateInquiryStatus(id, status);
    if (result.success) {
      toast.success('Status updated');
      loadInquiries();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const handleAddNote = async (id: string) => {
    if (!noteContent[id]?.trim()) {
      toast.error('Please enter a note');
      return;
    }
    const result = await addInquiryNote(id, noteContent[id]);
    if (result.success) {
      toast.success('Note added');
      setNoteContent({ ...noteContent, [id]: '' });
      loadInquiries();
    } else {
      toast.error(result.error || 'Failed to add note');
    }
  };

  // Get unique categories from inquiries with vehicles
  const categories = ['all', ...Array.from(
    new Set(
      inquiries
        .filter(inq => inq.vehicle?.category)
        .map(inq => inq.vehicle!.category)
    )
  )];

  // Filter inquiries by category
  const filteredInquiries = activeCategory === 'all'
    ? inquiries
    : inquiries.filter(inq => inq.vehicle?.category === activeCategory);

  // Calculate stats per category
  const getStatsForCategory = (category: string) => {
    const catInquiries = category === 'all' 
      ? inquiries 
      : inquiries.filter(inq => inq.vehicle?.category === category);
    
    return {
      total: catInquiries.length,
      new: catInquiries.filter(i => i.status === 'new').length,
      inProgress: catInquiries.filter(i => i.status === 'in_progress').length,
      completed: catInquiries.filter(i => i.status === 'completed').length,
    };
  };

  const stats = getStatsForCategory(activeCategory);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-500/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Vehicle Inquiries</h1>
              <p className="text-gray-600 mt-1 font-medium">Track customer interest by vehicle category</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => {
              const categoryStats = getStatsForCategory(category);
              const isActive = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/30'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {category === 'all' ? (
                      <Package className="w-4 h-4" />
                    ) : (
                      <Tag className="w-4 h-4" />
                    )}
                    <span>{category === 'all' ? 'All Categories' : category}</span>
                    {categoryStats.total > 0 && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        isActive
                          ? 'bg-white text-lime-600'
                          : 'bg-lime-100 text-lime-700'
                      }`}>
                        {categoryStats.total}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Total</p>
                <p className="text-4xl font-black text-gray-900">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-lime-50 to-lime-100/50 rounded-2xl p-6 border-2 border-lime-200 shadow-lg shadow-lime-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lime-700 font-bold uppercase tracking-wider mb-1">New</p>
                <p className="text-4xl font-black text-lime-900">{stats.new}</p>
              </div>
              <div className="w-14 h-14 bg-lime-200/60 rounded-2xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-lime-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-bold uppercase tracking-wider mb-1">In Progress</p>
                <p className="text-4xl font-black text-blue-900">{stats.inProgress}</p>
              </div>
              <div className="w-14 h-14 bg-blue-200/60 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border-2 border-green-200 shadow-lg shadow-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-bold uppercase tracking-wider mb-1">Completed</p>
                <p className="text-4xl font-black text-green-900">{stats.completed}</p>
              </div>
              <div className="w-14 h-14 bg-green-200/60 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-6 text-lg font-semibold">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300">
            <Car className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-600 text-xl font-semibold">No inquiries found</p>
            <p className="text-gray-500 mt-2">Inquiries will appear here when customers request information</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 hover:border-lime-500 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  {/* Vehicle Info Header */}
                  {inquiry.vehicle && (
                    <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-gray-100">
                      {inquiry.vehicle.images && inquiry.vehicle.images[0] && (
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                          <Image
                            src={inquiry.vehicle.images[0]}
                            alt={`${inquiry.vehicle.make} ${inquiry.vehicle.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-4 py-1.5 bg-lime-100 text-lime-700 rounded-full text-xs font-black uppercase tracking-wider">
                            {inquiry.vehicle.category}
                          </span>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                              inquiry.status === 'new'
                                ? 'bg-lime-100 text-lime-700'
                                : inquiry.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {inquiry.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">
                          {inquiry.vehicle.year} {inquiry.vehicle.make} {inquiry.vehicle.model}
                        </h3>
                        <p className="text-xl font-bold text-lime-600">
                          ${inquiry.vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                          <a href={`mailto:${inquiry.email}`} className="text-sm font-bold text-gray-900 hover:text-lime-600">
                            {inquiry.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                          <a href={`tel:${inquiry.phone}`} className="text-sm font-bold text-gray-900 hover:text-lime-600">
                            {inquiry.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Received</p>
                          <p className="text-sm font-bold text-gray-900">
                            {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Name</p>
                          <p className="text-sm font-bold text-gray-900">{inquiry.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Message</h4>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {inquiry.status !== 'new' && (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'new')}
                        className="px-6 py-3 bg-lime-100 text-lime-700 rounded-xl font-bold hover:bg-lime-200 transition-all duration-300 hover:scale-105"
                      >
                        Mark as New
                      </button>
                    )}
                    {inquiry.status !== 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'in_progress')}
                        className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all duration-300 hover:scale-105"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {inquiry.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'completed')}
                        className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-all duration-300 hover:scale-105"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
