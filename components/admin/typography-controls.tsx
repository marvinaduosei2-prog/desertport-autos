'use client';

import { Type, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface TypographyControlsProps {
  value: {
    fontFamily: string;
    fontSize: { heading: string; subheading: string; body: string; small: string };
    fontWeight: { heading: string; subheading: string; body: string };
    lineHeight: { heading: string; body: string };
    letterSpacing: { heading: string; body: string };
  };
  onChange: (value: any) => void;
}

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
];

const FONT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
const FONT_WEIGHTS = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
const LINE_HEIGHTS = ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '2'];
const LETTER_SPACINGS = ['-0.05em', '-0.03em', '-0.02em', '-0.01em', '0', '0.01em', '0.02em', '0.03em', '0.05em'];

export function TypographyControls({ value, onChange }: TypographyControlsProps) {
  const updateField = (category: string, field: string, newValue: string) => {
    onChange({
      ...value,
      [category]: typeof value[category as keyof typeof value] === 'object'
        ? { ...value[category as keyof typeof value], [field]: newValue }
        : newValue,
    });
  };

  return (
    <div className="space-y-6">
      {/* Font Family */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Type size={16} className="text-lime-600" />
          Font Family
        </label>
        <select
          value={value.fontFamily}
          onChange={(e) => onChange({ ...value, fontFamily: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-gray-900 font-medium"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Heading Typography */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Heading</h4>
        <div className="space-y-3">
          <SelectInput
            label="Font Size"
            value={value.fontSize.heading}
            options={FONT_SIZES}
            onChange={(v) => updateField('fontSize', 'heading', v)}
          />
          <SelectInput
            label="Font Weight"
            value={value.fontWeight.heading}
            options={FONT_WEIGHTS}
            onChange={(v) => updateField('fontWeight', 'heading', v)}
          />
          <SelectInput
            label="Line Height"
            value={value.lineHeight.heading}
            options={LINE_HEIGHTS}
            onChange={(v) => updateField('lineHeight', 'heading', v)}
          />
          <SelectInput
            label="Letter Spacing"
            value={value.letterSpacing.heading}
            options={LETTER_SPACINGS}
            onChange={(v) => updateField('letterSpacing', 'heading', v)}
          />
        </div>
      </div>

      {/* Subheading Typography */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Subheading</h4>
        <div className="space-y-3">
          <SelectInput
            label="Font Size"
            value={value.fontSize.subheading}
            options={FONT_SIZES}
            onChange={(v) => updateField('fontSize', 'subheading', v)}
          />
          <SelectInput
            label="Font Weight"
            value={value.fontWeight.subheading}
            options={FONT_WEIGHTS}
            onChange={(v) => updateField('fontWeight', 'subheading', v)}
          />
        </div>
      </div>

      {/* Body Typography */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Body Text</h4>
        <div className="space-y-3">
          <SelectInput
            label="Font Size"
            value={value.fontSize.body}
            options={FONT_SIZES}
            onChange={(v) => updateField('fontSize', 'body', v)}
          />
          <SelectInput
            label="Font Weight"
            value={value.fontWeight.body}
            options={FONT_WEIGHTS}
            onChange={(v) => updateField('fontWeight', 'body', v)}
          />
          <SelectInput
            label="Line Height"
            value={value.lineHeight.body}
            options={LINE_HEIGHTS}
            onChange={(v) => updateField('lineHeight', 'body', v)}
          />
          <SelectInput
            label="Letter Spacing"
            value={value.letterSpacing.body}
            options={LETTER_SPACINGS}
            onChange={(v) => updateField('letterSpacing', 'body', v)}
          />
        </div>
      </div>

      {/* Small Text Typography */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Small Text</h4>
        <div className="space-y-3">
          <SelectInput
            label="Font Size"
            value={value.fontSize.small}
            options={FONT_SIZES}
            onChange={(v) => updateField('fontSize', 'small', v)}
          />
        </div>
      </div>
    </div>
  );
}

function SelectInput({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
      >
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

