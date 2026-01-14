'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassCard } from './ui/glass-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { createInquiry } from '@/lib/actions';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import type { VehicleData } from '@/types/client';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleData;
}

export function InquiryModal({ isOpen, onClose, vehicle }: InquiryModalProps) {
  const { user, userData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.displayName || '',
    email: userData?.email || '',
    phone: userData?.phoneNumber || '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const inquiryData = {
      vehicleId: vehicle.id,
      vehicleSnapshot: {
        make: vehicle.specs.make,
        model: vehicle.specs.model,
        year: vehicle.specs.year,
        price: vehicle.price,
        thumbnailUrl: vehicle.thumbnailUrl,
      },
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      userId: user?.uid,
      source: user ? 'registered' : 'guest',
    };

    const result = await createInquiry(inquiryData);

    if (result.success) {
      toast.success('Inquiry sent successfully! We\'ll be in touch soon.');
      onClose();
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      toast.error(result.error || 'Failed to send inquiry');
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Inquire About This Vehicle
                    </h2>
                    <p className="text-white/70">
                      {vehicle.specs.year} {vehicle.specs.make} {vehicle.specs.model}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      placeholder="Any questions or additional information..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {!user && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-sm text-blue-100">
                        💡 <strong>Tip:</strong> Create an account to track your inquiries and unlock
                        additional features like "My Garage"!
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="glass"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Sending...' : 'Send Inquiry'}
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

