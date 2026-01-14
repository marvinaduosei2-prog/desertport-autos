'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, File, X, Check, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

interface AssetManagerProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string; // e.g., 'image/*', 'video/*', 'image/*,video/*'
  label?: string;
  maxSizeMB?: number;
}

export function AssetManager({
  value,
  onChange,
  accept = 'image/*,video/*',
  label = 'Upload Asset',
  maxSizeMB = 50,
}: AssetManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `site-assets/${filename}`);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(prog));
        },
        (uploadError) => {
          console.error('Upload error:', uploadError);
          setError('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          // Upload complete - get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPreview(downloadURL);
          onChange(downloadURL);
          setUploading(false);
          setProgress(100);
        }
      );
    } catch (err: any) {
      console.error('Asset upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (url: string): 'image' | 'video' | 'unknown' => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension || '')) return 'video';
    return 'unknown';
  };

  const fileType = getFileType(preview);

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Upload size={16} className="text-lime-600" />
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div className="relative">
        {!preview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-lime-600 transition-all bg-white hover:bg-lime-50 flex flex-col items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={40} className="text-lime-600 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Uploading...</p>
                  <p className="text-xs text-gray-600 mt-1">{progress}%</p>
                </div>
                {/* Progress Bar */}
                <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-lime-600"
                  />
                </div>
              </>
            ) : (
              <>
                <Upload size={40} className="text-gray-400 group-hover:text-lime-600 transition-colors" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Click to upload</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {accept.includes('image') && accept.includes('video') ? 'Images or Videos' : accept.includes('image') ? 'Images' : 'Videos'}
                    {' '}up to {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </button>
        ) : (
          <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            {/* Preview */}
            {fileType === 'image' && (
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            )}
            {fileType === 'video' && (
              <video src={preview} className="w-full h-full object-contain" controls />
            )}
            {fileType === 'unknown' && (
              <div className="w-full h-full flex items-center justify-center">
                <File size={40} className="text-gray-400" />
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-lime-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <Upload size={16} />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>

            {/* Success Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check size={16} className="text-white" />
            </motion.div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL Input (Alternative) */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Or paste URL directly</label>
        <input
          type="url"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white text-sm text-gray-900"
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-semibold"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


