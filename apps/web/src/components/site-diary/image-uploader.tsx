'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
}) => {
  const [currentUrl, setCurrentUrl] = React.useState('');

  const handleAddImage = () => {
    if (currentUrl.trim() && isValidUrl(currentUrl)) {
      onChange([...images, currentUrl.trim()]);
      setCurrentUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-url">Image URLs</Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!currentUrl.trim() || !isValidUrl(currentUrl)}
          >
            Add Image
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Enter image URLs one at a time. Press Enter or click "Add Image" to add.
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Added Images ({images.length})</Label>
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
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index)}
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
