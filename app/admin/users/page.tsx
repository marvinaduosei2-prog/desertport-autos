'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/admin/admin-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { getAllUsers, setUserRole } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: any;
  updatedAt: any;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    if (user && role === 'admin') {
      loadUsers();
    }
  }, [user, role]);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error(result.error || 'Failed to load users');
    }
    setLoading(false);
  };

  const handleRoleChange = async (uid: string, newRole: 'user' | 'admin') => {
    const result = await setUserRole(uid, newRole);
    if (result.success) {
      toast.success('User role updated');
      loadUsers();
    } else {
      toast.error(result.error || 'Failed to update role');
    }
  };

  if (authLoading || loading || role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    verified: users.filter(u => u.emailVerified).length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Users</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User size={48} className="text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Verified</p>
                <p className="text-3xl font-bold text-gray-900">{stats.verified}</p>
              </div>
              <CheckCircle size={48} className="text-green-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Admins</p>
                <p className="text-3xl font-bold text-gray-900">{stats.admins}</p>
              </div>
              <Shield size={48} className="text-purple-400" />
            </div>
          </GlassCard>
        </div>

        {/* Search */}
        <GlassCard className="p-4 mb-6">
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </GlassCard>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <GlassCard key={userData.uid} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
                      <User size={24} className="text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {userData.displayName || 'No Name'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          userData.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {userData.role}
                        </span>
                        {userData.emailVerified ? (
                          <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-300 border border-green-500/30 flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center">
                            <XCircle size={12} className="mr-1" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-white/80">
                      <Mail size={16} className="mr-2" />
                      {userData.email}
                    </div>
                    {userData.phoneNumber && (
                      <div className="flex items-center text-white/80">
                        <Phone size={16} className="mr-2" />
                        {userData.phoneNumber}
                      </div>
                    )}
                    <div className="flex items-center text-white/80">
                      <Calendar size={16} className="mr-2" />
                      Joined {formatDate(userData.createdAt?.toDate?.() || new Date())}
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div className="ml-4">
                  <select
                    value={userData.role}
                    onChange={(e) => handleRoleChange(userData.uid, e.target.value as 'user' | 'admin')}
                    className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${
                      userData.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}
                    disabled={userData.uid === user?.uid}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {userData.uid === user?.uid && (
                    <p className="text-xs text-white/50 mt-1">You cannot change your own role</p>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          {filteredUsers.length === 0 && (
            <GlassCard className="p-12 text-center">
              <User size={48} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/70">No users found</p>
            </GlassCard>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

