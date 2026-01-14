'use client';

import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  folder?: string;
  maxImages?: number;
}

function SortableImage({ image, index, onRemove }: { image: string; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group h-32 bg-gray-100 rounded-xl overflow-hidden"
    >
      <img
        src={image}
        alt={`Image ${index + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Image Number */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
        #{index + 1}
      </div>
    </div>
  );
}

export function MultipleImageUpload({ 
  images, 
  onChange, 
  label = 'Images', 
  folder = 'images',
  maxImages = 10 
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max images limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }
    }

    try {
      setUploading(true);
      const uploadPromises: Promise<string>[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${timestamp}_${i}_${sanitizedName}`;
        const storageRef = ref(storage, `${folder}/${filename}`);

        const uploadPromise = new Promise<string>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });

        uploadPromises.push(uploadPromise);
      }

      const urls = await Promise.all(uploadPromises);
      onChange([...images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully!`);
      setUploading(false);
      setUploadProgress(0);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Image URL added!');
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success('Image removed');
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-600">
          {label} <span className="text-gray-400">({images.length}/{maxImages})</span>
        </label>
        {images.length > 0 && (
          <p className="text-xs text-gray-500">Drag images to reorder</p>
        )}
      </div>

      {/* Current Images */}
      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image}
                  image={image}
                  index={index}
                  onRemove={() => handleRemove(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload Options */}
      {images.length < maxImages && (
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
                  <p className="text-sm font-semibold text-gray-900">Click to upload images</p>
                  <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB (max {maxImages} images)</p>
                </div>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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



