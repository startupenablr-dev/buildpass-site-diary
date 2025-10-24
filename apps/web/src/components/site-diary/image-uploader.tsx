'use client';

import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onFilesSelected?: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  onFilesSelected,
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [deletingImages, setDeletingImages] = React.useState<Set<number>>(
    new Set(),
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert(`${file.name} is larger than 4MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (selectedFiles.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    // Generate local previews using FileReader
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFilesSelected?.(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onFilesSelected?.(newFiles);
  };

  const handleRemoveImage = async (index: number) => {
    const urlToDelete = images[index];

    // Delete from UploadThing CDN if it's hosted there
    if (urlToDelete.includes('utfs.io') || urlToDelete.includes('ufs.sh')) {
      try {
        setDeletingImages((prev) => new Set(prev).add(index));

        const response = await fetch('/api/uploadthing/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToDelete }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to delete from UploadThing');
        }

        onChange(images.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Failed to delete image from server. Please try again.');
      } finally {
        setDeletingImages((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
    } else {
      onChange(images.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="border-border hover:border-primary/50 rounded-lg border-2 border-dashed p-8 text-center transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            aria-label="Upload photos"
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <Upload className="text-muted-foreground h-10 w-10" />
            <span className="text-primary hover:text-primary/80 font-medium">
              Upload Photos
            </span>
            <p className="text-muted-foreground text-sm">
              Click to browse or drag & drop
            </p>
          </label>
        </div>
        <p className="text-muted-foreground text-sm">
          Select images to upload. Max 4MB per image, up to 5 images at a time.
          Images will be uploaded when you submit the form.
        </p>
      </div>

      {/* Selected files preview (not yet uploaded) */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected Files ({selectedFiles.length})
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="group border-primary/50 relative aspect-square overflow-hidden rounded-lg border"
              >
                {previews[index] && (
                  <Image
                    src={previews[index]}
                    alt={file.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute right-0 bottom-0 left-0 bg-black/70 p-2">
                  <p className="truncate text-xs text-white">{file.name}</p>
                  <p className="text-xs text-white/70">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded images (from previous uploads or existing data) */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Uploaded Images ({images.length})
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg border"
              >
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
                {deletingImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-sm text-white">Deleting...</p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index)}
                  disabled={deletingImages.has(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
