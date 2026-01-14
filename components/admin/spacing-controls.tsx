'use client';

import { Maximize2, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SpacingControlsProps {
  value: {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    gap: string;
  };
  onChange: (value: any) => void;
}

const SPACING_SIZES = [
  { label: 'None', value: 'none' },
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
];

export function SpacingControls({ value, onChange }: SpacingControlsProps) {
  const updateField = (field: string, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6">
      {/* Padding */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Maximize2 size={16} className="text-lime-600" />
          Padding (Inner Spacing)
        </h4>
        
        {/* Visual Padding Control */}
        <div className="relative bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 mb-4">
          {/* Top */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <SpacingButton
              icon={<ArrowUp size={14} />}
              value={value.paddingTop}
              onChange={(v) => updateField('paddingTop', v)}
            />
          </div>
          
          {/* Right */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <SpacingButton
              icon={<ArrowRight size={14} />}
              value={value.paddingRight}
              onChange={(v) => updateField('paddingRight', v)}
            />
          </div>
          
          {/* Bottom */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <SpacingButton
              icon={<ArrowDown size={14} />}
              value={value.paddingBottom}
              onChange={(v) => updateField('paddingBottom', v)}
            />
          </div>
          
          {/* Left */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <SpacingButton
              icon={<ArrowLeft size={14} />}
              value={value.paddingLeft}
              onChange={(v) => updateField('paddingLeft', v)}
            />
          </div>
          
          {/* Center Label */}
          <div className="text-center text-xs text-gray-500 font-semibold">
            Content Area
          </div>
        </div>

        {/* Detailed Controls */}
        <div className="grid grid-cols-2 gap-3">
          <SpacingInput label="Top" value={value.paddingTop} onChange={(v) => updateField('paddingTop', v)} />
          <SpacingInput label="Right" value={value.paddingRight} onChange={(v) => updateField('paddingRight', v)} />
          <SpacingInput label="Bottom" value={value.paddingBottom} onChange={(v) => updateField('paddingBottom', v)} />
          <SpacingInput label="Left" value={value.paddingLeft} onChange={(v) => updateField('paddingLeft', v)} />
        </div>
      </div>

      {/* Margin */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Move size={16} className="text-lime-600" />
          Margin (Outer Spacing)
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <SpacingInput label="Top" value={value.marginTop} onChange={(v) => updateField('marginTop', v)} />
          <SpacingInput label="Bottom" value={value.marginBottom} onChange={(v) => updateField('marginBottom', v)} />
        </div>
      </div>

      {/* Gap */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
          Gap (Space Between Items)
        </h4>
        <SpacingInput label="Gap Size" value={value.gap} onChange={(v) => updateField('gap', v)} fullWidth />
      </div>
    </div>
  );
}

function SpacingButton({ icon, value, onChange }: any) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:border-lime-600 hover:text-lime-600 transition-colors flex items-center gap-1"
      >
        {icon}
        {value}
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 min-w-[120px]">
            {SPACING_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  onChange(size.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-lime-50 transition-colors ${
                  value === size.value ? 'bg-lime-50 text-lime-700 font-bold' : 'text-gray-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SpacingInput({ label, value, onChange, fullWidth = false }: any) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
      >
        {SPACING_SIZES.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Add React import for useState
import React from 'react';

