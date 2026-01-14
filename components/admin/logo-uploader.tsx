'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Check, Info } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
  type: 'logo' | 'favicon';
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function LogoUploader({ currentLogoUrl, onUploadComplete, onRemove, type }: LogoUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [uploading, setUploading] = useState(false);

  const isLogo = type === 'logo';
  const aspect = isLogo ? 16 / 9 : 1; // Logo is wider, favicon is square
  const title = isLogo ? 'Logo' : 'Favicon';
  const recommendedSize = isLogo ? '400x225px (16:9 ratio)' : '512x512px (square)';
  const maxFileSize = 2; // MB

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/png');
    });
  };

  const handleUpload = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    setUploading(true);
    try {
      console.log('🔄 Starting upload process...');
      
      // Get cropped image
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
      console.log('✅ Image cropped successfully');

      // Upload to Firebase
      const fileName = `${type}_${Date.now()}.png`;
      const storageRef = ref(storage, `branding/${fileName}`);
      
      console.log('📤 Uploading to Firebase Storage:', `branding/${fileName}`);
      await uploadBytes(storageRef, croppedBlob);
      
      console.log('✅ Upload complete, getting download URL...');
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('✅ Download URL obtained:', downloadUrl);

      // Delete old logo if exists
      if (currentLogoUrl) {
        try {
          console.log('🗑️ Deleting old logo...');
          const oldRef = ref(storage, currentLogoUrl);
          await deleteObject(oldRef);
          console.log('✅ Old logo deleted');
        } catch (error) {
          console.log('⚠️ Old logo already deleted or does not exist');
        }
      }

      onUploadComplete(downloadUrl);
      setSelectedImage(null);
      toast.success(`${title} uploaded successfully!`);
    } catch (error: any) {
      console.error('❌ Error uploading:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // More helpful error messages
      if (error.code === 'storage/unauthorized') {
        toast.error('Permission denied. Please check Firebase Storage rules.');
      } else if (error.code === 'storage/unauthenticated') {
        toast.error('Please sign in to upload images.');
      } else {
        toast.error(`Failed to upload ${title.toLowerCase()}: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentLogoUrl) return;

    try {
      const storageRef = ref(storage, currentLogoUrl);
      await deleteObject(storageRef);
      onRemove();
      toast.success(`${title} removed successfully!`);
    } catch (error) {
      console.error('Error removing:', error);
      toast.error(`Failed to remove ${title.toLowerCase()}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Recommended: {recommendedSize}</p>
        </div>
        {currentLogoUrl && !selectedImage && (
          <button
            onClick={handleRemove}
            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 font-semibold rounded-lg transition text-sm flex items-center gap-2"
          >
            <X size={16} />
            Remove
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Guidelines:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Format: PNG, JPG, or WEBP</li>
              <li>• Max size: {maxFileSize}MB</li>
              <li>• Recommended: {recommendedSize}</li>
              <li>• {isLogo ? 'Transparent background works best' : 'Square format required'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Logo Preview */}
      {currentLogoUrl && !selectedImage && (
        <div className="p-6 bg-gray-50 border-2 border-gray-300 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-3">Current {title}:</p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
            <img
              src={currentLogoUrl}
              alt={`Current ${title}`}
              className={`${isLogo ? 'h-16' : 'h-12 w-12'} object-contain`}
            />
          </div>
        </div>
      )}

      {/* Cropper */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="relative w-full h-[400px] bg-gray-900 rounded-xl overflow-hidden">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Save {title}
                </>
              )}
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              disabled={uploading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!selectedImage && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`${type}-upload`}
          />
          <label
            htmlFor={`${type}-upload`}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-lime-600 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition cursor-pointer"
          >
            <Upload size={20} />
            {currentLogoUrl ? `Change ${title}` : `Upload ${title}`}
          </label>
        </div>
      )}
    </div>
  );
}

