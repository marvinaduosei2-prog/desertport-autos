'use client';

import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Mail, Phone, Calendar, CheckCircle, Clock, Archive, MessageSquare } from 'lucide-react';
import { getContactSubmissions, updateContactStatus } from '@/lib/actions';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: string;
  status: string;
  createdAt: any;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const result = await getContactSubmissions();
    if (result.success) {
      setSubmissions(result.data as ContactSubmission[]);
    } else {
      toast.error(result.error || 'Failed to load submissions');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateContactStatus(id, status);
    if (result.success) {
      toast.success('Status updated');
      loadSubmissions();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    inProgress: submissions.filter(s => s.status === 'in_progress').length,
    completed: submissions.filter(s => s.status === 'completed').length,
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-2">Manage messages from your contact form</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-lime-50 rounded-xl p-6 border-2 border-lime-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-lime-700 font-semibold">New</p>
                <p className="text-3xl font-bold text-lime-900 mt-1">{stats.new}</p>
              </div>
              <Mail className="w-10 h-10 text-lime-600" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">Completed</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'new'
                ? 'bg-lime-600 text-white'
                : 'bg-lime-50 text-lime-700 hover:bg-lime-100'
            }`}
          >
            New ({stats.new})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-lime-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          submission.status === 'new'
                            ? 'bg-lime-100 text-lime-700'
                            : submission.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {submission.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-3">{submission.subject}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${submission.email}`} className="hover:text-lime-600">
                          {submission.email}
                        </a>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${submission.phone}`} className="hover:text-lime-600">
                            {submission.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(submission.createdAt)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {submission.status !== 'new' && (
                    <button
                      onClick={() => handleStatusChange(submission.id, 'new')}
                      className="px-4 py-2 bg-lime-100 text-lime-700 rounded-lg font-semibold hover:bg-lime-200 transition"
                    >
                      Mark as New
                    </button>
                  )}
                  {submission.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(submission.id, 'in_progress')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {submission.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(submission.id, 'completed')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
