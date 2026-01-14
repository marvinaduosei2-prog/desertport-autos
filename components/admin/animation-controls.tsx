'use client';

import { Zap, Play, Layers, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimationControlsProps {
  value: {
    entrance: {
      type: string;
      duration: number;
      delay: number;
      easing: string;
    };
    hover: {
      scale: number;
      rotate: number;
      translateY: number;
      brightness: number;
    };
    scroll: {
      parallax: boolean;
      parallaxSpeed: number;
      fadeOnScroll: boolean;
    };
  };
  onChange: (value: any) => void;
}

const ENTRANCE_TYPES = [
  { label: 'None', value: 'none' },
  { label: 'Fade In', value: 'fadeIn' },
  { label: 'Slide Up', value: 'slideUp' },
  { label: 'Slide Down', value: 'slideDown' },
  { label: 'Slide Left', value: 'slideLeft' },
  { label: 'Slide Right', value: 'slideRight' },
  { label: 'Scale Up', value: 'scaleUp' },
  { label: 'Scale Down', value: 'scaleDown' },
  { label: 'Zoom In', value: 'zoomIn' },
  { label: 'Flip X', value: 'flipX' },
  { label: 'Flip Y', value: 'flipY' },
  { label: 'Bounce', value: 'bounce' },
];

const EASING_OPTIONS = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease', value: 'ease' },
  { label: 'Ease In', value: 'easeIn' },
  { label: 'Ease Out', value: 'easeOut' },
  { label: 'Ease In Out', value: 'easeInOut' },
  { label: 'Spring', value: 'spring' },
  { label: 'Bounce', value: 'bounce' },
];

export function AnimationControls({ value, onChange }: AnimationControlsProps) {
  const [previewKey, setPreviewKey] = useState(0);

  const updateField = (category: string, field: string, newValue: any) => {
    onChange({
      ...value,
      [category]: { ...value[category as keyof typeof value], [field]: newValue },
    });
  };

  const triggerPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  // Get animation variants based on entrance type
  const getEntranceVariant = () => {
    const { type, duration, delay, easing } = value.entrance;
    const variants: any = {
      hidden: {},
      visible: { transition: { duration, delay, ease: easing } },
    };

    switch (type) {
      case 'fadeIn':
        variants.hidden = { opacity: 0 };
        variants.visible = { ...variants.visible, opacity: 1 };
        break;
      case 'slideUp':
        variants.hidden = { opacity: 0, y: 50 };
        variants.visible = { ...variants.visible, opacity: 1, y: 0 };
        break;
      case 'slideDown':
        variants.hidden = { opacity: 0, y: -50 };
        variants.visible = { ...variants.visible, opacity: 1, y: 0 };
        break;
      case 'slideLeft':
        variants.hidden = { opacity: 0, x: 50 };
        variants.visible = { ...variants.visible, opacity: 1, x: 0 };
        break;
      case 'slideRight':
        variants.hidden = { opacity: 0, x: -50 };
        variants.visible = { ...variants.visible, opacity: 1, x: 0 };
        break;
      case 'scaleUp':
        variants.hidden = { opacity: 0, scale: 0.8 };
        variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
        break;
      case 'scaleDown':
        variants.hidden = { opacity: 0, scale: 1.2 };
        variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
        break;
      case 'zoomIn':
        variants.hidden = { opacity: 0, scale: 0.5 };
        variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
        break;
      case 'flipX':
        variants.hidden = { opacity: 0, rotateX: 90 };
        variants.visible = { ...variants.visible, opacity: 1, rotateX: 0 };
        break;
      case 'flipY':
        variants.hidden = { opacity: 0, rotateY: 90 };
        variants.visible = { ...variants.visible, opacity: 1, rotateY: 0 };
        break;
      case 'bounce':
        variants.hidden = { opacity: 0, y: -100 };
        variants.visible = { ...variants.visible, opacity: 1, y: 0, transition: { ...variants.visible.transition, type: 'spring', bounce: 0.5 } };
        break;
      default:
        variants.hidden = {};
        variants.visible = {};
    }

    return variants;
  };

  const hoverVariant = {
    scale: value.hover.scale,
    rotate: value.hover.rotate,
    y: value.hover.translateY,
    filter: `brightness(${value.hover.brightness})`,
    transition: { duration: 0.3 },
  };

  return (
    <div className="space-y-6">
      {/* Entrance Animation */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Play size={16} className="text-lime-600" />
          Entrance Animation
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Animation Type</label>
            <select
              value={value.entrance.type}
              onChange={(e) => updateField('entrance', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
            >
              {ENTRANCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (s)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={value.entrance.duration}
                onChange={(e) => updateField('entrance', 'duration', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Delay (s)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={value.entrance.delay}
                onChange={(e) => updateField('entrance', 'delay', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Easing</label>
            <select
              value={value.entrance.easing}
              onChange={(e) => updateField('entrance', 'easing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
            >
              {EASING_OPTIONS.map((easing) => (
                <option key={easing.value} value={easing.value}>
                  {easing.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-600">Preview</span>
              <button
                onClick={triggerPreview}
                className="px-3 py-1.5 bg-lime-600 text-white text-xs font-bold rounded-lg hover:bg-lime-700 transition-colors flex items-center gap-2"
              >
                <Play size={14} />
                Replay
              </button>
            </div>
            <motion.div
              key={previewKey}
              initial="hidden"
              animate="visible"
              variants={getEntranceVariant()}
              className="w-full h-20 bg-gradient-to-r from-lime-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold"
            >
              Animated Element
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-lime-600" />
          Hover Effects
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Scale: {value.hover.scale}x
            </label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={value.hover.scale}
              onChange={(e) => updateField('hover', 'scale', parseFloat(e.target.value))}
              className="w-full accent-lime-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Rotate: {value.hover.rotate}°
            </label>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={value.hover.rotate}
              onChange={(e) => updateField('hover', 'rotate', parseFloat(e.target.value))}
              className="w-full accent-lime-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Translate Y: {value.hover.translateY}px
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={value.hover.translateY}
              onChange={(e) => updateField('hover', 'translateY', parseFloat(e.target.value))}
              className="w-full accent-lime-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Brightness: {value.hover.brightness}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={value.hover.brightness}
              onChange={(e) => updateField('hover', 'brightness', parseFloat(e.target.value))}
              className="w-full accent-lime-600"
            />
          </div>

          {/* Hover Preview */}
          <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <span className="block text-xs font-semibold text-gray-600 mb-3">Hover Preview</span>
            <motion.div
              whileHover={hoverVariant}
              className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer"
            >
              Hover Over Me
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Effects */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
          <Eye size={16} className="text-lime-600" />
          Scroll Effects
        </h4>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value.scroll.parallax}
              onChange={(e) => updateField('scroll', 'parallax', e.target.checked)}
              className="w-5 h-5 accent-lime-600 cursor-pointer"
            />
            <span className="text-sm font-semibold text-gray-900">Enable Parallax</span>
          </label>

          {value.scroll.parallax && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Parallax Speed: {value.scroll.parallaxSpeed}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={value.scroll.parallaxSpeed}
                onChange={(e) => updateField('scroll', 'parallaxSpeed', parseFloat(e.target.value))}
                className="w-full accent-lime-600"
              />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value.scroll.fadeOnScroll}
              onChange={(e) => updateField('scroll', 'fadeOnScroll', e.target.checked)}
              className="w-5 h-5 accent-lime-600 cursor-pointer"
            />
            <span className="text-sm font-semibold text-gray-900">Fade on Scroll</span>
          </label>
        </div>
      </div>
    </div>
  );
}


