'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/admin/admin-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { updateInquiryStatus, addInquiryNote } from '@/lib/actions';
import { fetchCollection, COLLECTIONS, serializeTimestamp } from '@/lib/firebase/db';
import { formatDate, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { InquiryData } from '@/types/client';
import { 
  Mail, 
  Phone, 
  User,
  Calendar,
  DollarSign,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type InquiryStatusType = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'closed_won' | 'closed_lost';

const statusColors: Record<InquiryStatusType, string> = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  qualified: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  negotiating: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  closed_won: 'bg-green-500/20 text-green-300 border-green-500/30',
  closed_lost: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function AdminInquiriesPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuthStore();
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    if (user && role === 'admin') {
      loadInquiries();
    }
  }, [user, role]);

  const loadInquiries = async () => {
    setLoading(true);
    const data = await fetchCollection(COLLECTIONS.INQUIRIES);
    const serialized: InquiryData[] = data.map((inquiry: any) => ({
      ...inquiry,
      createdAt: serializeTimestamp(inquiry.createdAt),
      updatedAt: serializeTimestamp(inquiry.updatedAt),
      lastContactedAt: inquiry.lastContactedAt ? serializeTimestamp(inquiry.lastContactedAt) : undefined,
      notes: inquiry.notes.map((note: any) => ({
        ...note,
        createdAt: serializeTimestamp(note.createdAt),
      })),
    }));
    setInquiries(serialized.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setLoading(false);
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    const result = await updateInquiryStatus(inquiryId, newStatus);
    if (result.success) {
      toast.success('Status updated');
      loadInquiries();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const handleAddNote = async (inquiryId: string) => {
    const content = noteInput[inquiryId];
    if (!content?.trim()) return;

    const result = await addInquiryNote(inquiryId, content);
    if (result.success) {
      toast.success('Note added');
      setNoteInput({ ...noteInput, [inquiryId]: '' });
      loadInquiries();
    } else {
      toast.error(result.error || 'Failed to add note');
    }
  };

  if (authLoading || loading || role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Group inquiries by status
  const groupedInquiries = inquiries.reduce((acc, inquiry) => {
    if (!acc[inquiry.status]) acc[inquiry.status] = [];
    acc[inquiry.status].push(inquiry);
    return acc;
  }, {} as Record<string, InquiryData[]>);

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Inquiries</h1>
          <div className="text-white/70">
            Total: <span className="font-bold text-gray-900">{inquiries.length}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {(['new', 'contacted', 'qualified', 'negotiating', 'closed_won', 'closed_lost'] as InquiryStatusType[]).map(status => (
            <GlassCard key={status} className="p-4 text-center">
              <p className="text-sm text-white/70 mb-1">{status.replace('_', ' ')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {groupedInquiries[status]?.length || 0}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <GlassCard key={inquiry.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <img
                      src={inquiry.vehicleSnapshot.thumbnailUrl}
                      alt={`${inquiry.vehicleSnapshot.make} ${inquiry.vehicleSnapshot.model}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {inquiry.vehicleSnapshot.year} {inquiry.vehicleSnapshot.make}{' '}
                        {inquiry.vehicleSnapshot.model}
                      </h3>
                      <p className="text-primary-400 font-bold">
                        {formatPrice(inquiry.vehicleSnapshot.price)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-white/80">
                      <User size={16} className="mr-2" />
                      {inquiry.name}
                      {inquiry.source === 'guest' && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500/20 text-gray-300 rounded">
                          Guest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-white/80">
                      <Mail size={16} className="mr-2" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center text-white/80">
                      <Phone size={16} className="mr-2" />
                      {inquiry.phone}
                    </div>
                    <div className="flex items-center text-white/80">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>

                  {inquiry.message && (
                    <p className="text-white/70 mb-4 p-3 bg-white/5 rounded-lg">
                      {inquiry.message}
                    </p>
                  )}
                </div>

                <div className="ml-4">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${
                      statusColors[inquiry.status as InquiryStatusType]
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              {/* Notes Section */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                  className="flex items-center text-white/80 hover:text-white transition-colors mb-3"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Notes ({inquiry.notes.length})
                  {expandedInquiry === inquiry.id ? (
                    <ChevronUp size={16} className="ml-2" />
                  ) : (
                    <ChevronDown size={16} className="ml-2" />
                  )}
                </button>

                {expandedInquiry === inquiry.id && (
                  <div className="space-y-3">
                    {inquiry.notes.map((note) => (
                      <div key={note.id} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {note.createdByName}
                          </span>
                          <span className="text-xs text-white/50">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{note.content}</p>
                      </div>
                    ))}

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a note..."
                        value={noteInput[inquiry.id] || ''}
                        onChange={(e) => setNoteInput({ ...noteInput, [inquiry.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNote(inquiry.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddNote(inquiry.id)}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

