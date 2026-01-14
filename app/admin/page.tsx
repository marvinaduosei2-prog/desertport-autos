'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import { Shield, Lock, User, Mail, Phone } from 'lucide-react';

export default function AdminAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phoneNumber: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { user, error } = await signIn(formData.email, formData.password);

    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    if (user) {
      const token = await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (role === 'admin') {
        toast.success('Welcome, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.error('Access Denied: Admin credentials required');
        await fetch('/api/auth/logout', { method: 'POST' });
        setLoading(false);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { user, error } = await signUp(
      formData.email,
      formData.password,
      formData.displayName,
      formData.phoneNumber
    );

    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    if (user) {
      // After signup, need to manually set admin role
      toast.success('Admin account created! You need to be granted admin access.');
      toast.info('Contact system administrator to activate admin role');
      setMode('login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Admin Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-lime-600 rounded-2xl mb-6 shadow-2xl shadow-lime-600/50 relative">
            <Shield className="w-10 h-10 text-gray-900" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {mode === 'login' ? 'Admin Access' : 'Create Admin Account'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Authorized Personnel Only' : 'Setup Your Admin Account'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
              mode === 'login'
                ? 'bg-lime-600 text-white'
                : 'bg-white/5 text-gray-600 hover:bg-white/10'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
              mode === 'signup'
                ? 'bg-lime-600 text-white'
                : 'bg-white/5 text-gray-600 hover:bg-white/10'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {mode === 'login' ? (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@desertport.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Admin Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-lime-600 text-white font-black rounded-lg hover:bg-lime-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg shadow-lime-600/50"
              >
                {loading ? 'Verifying...' : 'Access Admin Panel'}
              </button>
            </form>
          ) : (
            // SIGNUP FORM
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@desertport.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-lime-600 text-white font-black rounded-lg hover:bg-lime-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg shadow-lime-600/50"
              >
                {loading ? 'Creating Account...' : 'Create Admin Account'}
              </button>
            </form>
          )}

          {/* Security Notice (Login only) */}
          {mode === 'login' && (
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-6">
              <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200">
                This area is restricted to authorized administrators only. All login attempts are monitored and logged.
              </p>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <Link href="/" className="text-gray-600 hover:text-white transition-colors">
                ← Back to Site
              </Link>
              <Link href="/signin" className="text-gray-600 hover:text-white transition-colors">
                User Login
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {mode === 'signup' 
            ? 'After signup, contact administrator to activate admin role'
            : 'Need admin access? Contact your system administrator'}
        </div>
      </div>
    </div>
  );
}
