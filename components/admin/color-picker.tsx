'use client';

import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Pipette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b',
  '#eab308', '#ffffff', '#e5e7eb', '#9ca3af', '#6b7280',
  '#4b5563', '#374151', '#1f2937', '#111827', '#000000'
];

export function ColorPicker({ label, value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);

  useEffect(() => {
    setTempColor(value);
  }, [value]);

  const handleApply = () => {
    onChange(tempColor);
    setIsOpen(false);
  };

  const handlePresetClick = (color: string) => {
    setTempColor(color);
    onChange(color);
  };

  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {/* Color Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-lime-600 transition-all flex items-center gap-3 px-3 bg-white group"
      >
        <div
          className="w-8 h-8 rounded-md border-2 border-gray-200 flex-shrink-0 shadow-sm"
          style={{ backgroundColor: tempColor }}
        />
        <span className="flex-1 text-left font-mono text-sm text-gray-900">{tempColor.toUpperCase()}</span>
        <Palette size={18} className="text-gray-400 group-hover:text-lime-600 transition-colors" />
      </button>

      {/* Color Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Popover */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full min-w-[280px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Pipette size={16} className="text-lime-600" />
                  <span className="font-semibold text-gray-900">Pick a Color</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Color Picker */}
              <div className="mb-4">
                <HexColorPicker color={tempColor} onChange={setTempColor} style={{ width: '100%' }} />
              </div>

              {/* HEX Input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">HEX Code</label>
                <input
                  type="text"
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                />
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Preset Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {presets.map((preset, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-full aspect-square rounded-lg border-2 relative group"
                      style={{
                        backgroundColor: preset,
                        borderColor: tempColor === preset ? '#84cc16' : 'transparent',
                      }}
                    >
                      {tempColor === preset && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check
                            size={16}
                            className="text-white drop-shadow-lg"
                            style={{
                              color: preset === '#ffffff' || preset === '#e5e7eb' ? '#000000' : '#ffffff',
                            }}
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="w-full mt-4 px-4 py-2.5 bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700 transition-colors"
              >
                Apply Color
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
