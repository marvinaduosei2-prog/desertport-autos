'use client';

import { useState } from 'react';
import { AdminDashboardLayout } from '@/components/admin/admin-dashboard-layout';
import { Upload, X, Copy, Check, Image as ImageIcon, Video, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

interface UploadedFile {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (const file of Array.from(files)) {
      try {
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        const storageRef = ref(storage, `media/${fileType}s/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              toast.error(`Failed to upload ${file.name}`);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const newFile: UploadedFile = {
                name: file.name,
                url: downloadURL,
                type: fileType,
                size: file.size,
                uploadedAt: new Date().toISOString(),
              };
              setUploadedFiles((prev) => [newFile, ...prev]);
              toast.success(`${file.name} uploaded successfully!`);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    e.target.value = '';
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Media Library</h1>
          <p className="text-gray-600">Upload and manage images and videos</p>
        </div>

        {/* Upload Area */}
        <div className="p-8 bg-white/50 backdrop-blur-xl border-2 border-dashed border-gray-200 rounded-2xl hover:border-lime-600/50 transition">
          <label className="flex flex-col items-center cursor-pointer">
            <div className="w-16 h-16 bg-lime-600/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-lime-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Files</h3>
            <p className="text-gray-600 text-sm mb-4">
              Click to browse or drag and drop your images and videos
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading && (
              <div className="w-full max-w-md mt-4">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Uploaded Files Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Your Media ({uploadedFiles.length})
          </h2>
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-white/50 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition"
                >
                  <div className="h-48 bg-gray-800 relative">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-full flex items-center gap-1">
                        {file.type === 'image' ? (
                          <ImageIcon size={12} />
                        ) : (
                          <Video size={12} />
                        )}
                        {file.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{' '}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="flex-1 px-3 py-2 bg-lime-600/10 hover:bg-lime-600/20 text-lime-500 font-semibold rounded-lg transition text-xs flex items-center justify-center gap-1"
                      >
                        {copiedUrl === file.url ? (
                          <>
                            <Check size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy URL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No files uploaded yet. Start by uploading some media above.
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="p-6 bg-blue-600/10 border border-blue-600/30 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-400 mb-2">How to Use</h3>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>Upload your images and videos using the upload area above</li>
            <li>Click "Copy URL" on any file to copy its URL to your clipboard</li>
            <li>Paste the URL in any of the content editors (Hero, Categories, Inventory, etc.)</li>
            <li>The images/videos will appear on your live website</li>
          </ol>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

