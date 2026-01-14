'use client';

import { Layout, AlignLeft, AlignCenter, AlignRight, Columns, Monitor, Tablet, Smartphone } from 'lucide-react';

interface LayoutControlsProps {
  value: {
    type: 'full-width' | 'contained' | 'narrow';
    maxWidth: string;
    alignment: 'left' | 'center' | 'right';
    columns: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  onChange: (value: any) => void;
}

const LAYOUT_TYPES = [
  { value: 'full-width', label: 'Full Width', description: 'Spans entire viewport' },
  { value: 'contained', label: 'Contained', description: 'Max width container' },
  { value: 'narrow', label: 'Narrow', description: 'Centered narrow layout' },
];

const MAX_WIDTHS = [
  { value: 'sm', label: 'Small (640px)' },
  { value: 'md', label: 'Medium (768px)' },
  { value: 'lg', label: 'Large (1024px)' },
  { value: 'xl', label: 'Extra Large (1280px)' },
  { value: '2xl', label: '2XL (1536px)' },
  { value: '4xl', label: '4XL (1920px)' },
  { value: '6xl', label: '6XL (2560px)' },
  { value: '7xl', label: '7XL (3840px)' },
];

export function LayoutControls({ value, onChange }: LayoutControlsProps) {
  const updateField = (field: string, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const updateColumns = (device: string, columns: number) => {
    onChange({
      ...value,
      columns: { ...value.columns, [device]: columns },
    });
  };

  return (
    <div className="space-y-6">
      {/* Layout Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Layout size={16} className="text-lime-600" />
          Layout Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {LAYOUT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => updateField('type', type.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                value.type === type.value
                  ? 'border-lime-600 bg-lime-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-bold text-sm ${value.type === type.value ? 'text-lime-900' : 'text-gray-900'}`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Max Width (only for contained/narrow) */}
      {(value.type === 'contained' || value.type === 'narrow') && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Max Width</label>
          <select
            value={value.maxWidth}
            onChange={(e) => updateField('maxWidth', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-gray-900 font-medium"
          >
            {MAX_WIDTHS.map((width) => (
              <option key={width.value} value={width.value}>
                {width.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Alignment */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Content Alignment</label>
        <div className="flex gap-2">
          <AlignmentButton
            icon={<AlignLeft size={18} />}
            label="Left"
            active={value.alignment === 'left'}
            onClick={() => updateField('alignment', 'left')}
          />
          <AlignmentButton
            icon={<AlignCenter size={18} />}
            label="Center"
            active={value.alignment === 'center'}
            onClick={() => updateField('alignment', 'center')}
          />
          <AlignmentButton
            icon={<AlignRight size={18} />}
            label="Right"
            active={value.alignment === 'right'}
            onClick={() => updateField('alignment', 'right')}
          />
        </div>
      </div>

      {/* Responsive Columns */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Columns size={16} className="text-lime-600" />
          Responsive Columns
        </h4>
        
        <div className="space-y-4">
          {/* Desktop */}
          <ColumnControl
            icon={<Monitor size={18} className="text-gray-600" />}
            label="Desktop"
            value={value.columns.desktop}
            onChange={(v) => updateColumns('desktop', v)}
          />
          
          {/* Tablet */}
          <ColumnControl
            icon={<Tablet size={18} className="text-gray-600" />}
            label="Tablet"
            value={value.columns.tablet}
            onChange={(v) => updateColumns('tablet', v)}
          />
          
          {/* Mobile */}
          <ColumnControl
            icon={<Smartphone size={18} className="text-gray-600" />}
            label="Mobile"
            value={value.columns.mobile}
            onChange={(v) => updateColumns('mobile', v)}
          />
        </div>
      </div>
    </div>
  );
}

function AlignmentButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
        active
          ? 'border-lime-600 bg-lime-50 text-lime-900'
          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
      }`}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function ColumnControl({ icon, label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 6].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-8 h-8 rounded-lg border-2 text-xs font-bold transition-all ${
              value === num
                ? 'border-lime-600 bg-lime-600 text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

