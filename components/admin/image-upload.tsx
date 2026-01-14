'use client';

import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string; // Storage folder path
  multiple?: boolean;
}

export function ImageUpload({ value, onChange, label = 'Image', folder = 'images', multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          setUploading(false);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          toast.success('Image uploaded successfully!');
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Image URL added!');
  };

  const handleRemove = () => {
    onChange('');
    toast.success('Image removed');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-600">{label}</label>

      {/* Current Image Preview */}
      {value && (
        <div className="relative group">
          <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Options */}
      {!value && (
        <div className="space-y-2">
          {/* File Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-lime-500 hover:bg-lime-50 transition-all flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-lime-600 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Uploading...</p>
                  <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-lime-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{Math.round(uploadProgress)}%</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-lime-600" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Click to upload image</p>
                  <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB</p>
                </div>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* URL Input Toggle */}
          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-semibold text-gray-700"
            >
              <LinkIcon className="w-4 h-4" />
              Or enter image URL
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-lime-600 focus:outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                }}
                className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



