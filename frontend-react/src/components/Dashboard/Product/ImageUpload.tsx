// src/components/Dashboard/Product/ImageUpload.tsx
import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange, onImageRemove, maxImages = 10 }) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const validFiles = files.filter((file) => allowedTypes.includes(file.type));

      if (validFiles.length !== files.length) {
        alert('Only JPEG, PNG, and WEBP images are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      const validSizeFiles = validFiles.filter((file) => file.size <= maxSize);

      if (validSizeFiles.length !== validFiles.length) {
        alert('Each image must be less than 5MB');
      }

      // Check max images limit
      const remainingSlots = maxImages - images.length;
      const filesToAdd = validSizeFiles.slice(0, remainingSlots);

      if (filesToAdd.length !== validSizeFiles.length) {
        alert(`Maximum ${maxImages} images allowed`);
      }

      onImagesChange([...images, ...filesToAdd]);
      e.target.value = '';
    },
    [images, maxImages, onImagesChange],
  );

  return (
    <div className='space-y-2'>
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors'>
        <input
          type='file'
          id='image-upload'
          multiple
          accept='image/jpeg,image/png,image/webp,image/jpg'
          onChange={handleFileChange}
          className='hidden'
          disabled={images.length >= maxImages}
        />
        <label htmlFor='image-upload' className='cursor-pointer block'>
          <Upload className='mx-auto h-8 w-8 text-gray-400' />
          <p className='mt-2 text-sm text-gray-600'>Click to upload product images</p>
          <p className='text-xs text-gray-500'>JPEG, PNG, WEBP up to 5MB each (Max {maxImages} images)</p>
        </label>
      </div>

      {images.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {images.map((image, index) => (
            <div key={index} className='relative group'>
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className='w-full h-32 object-cover rounded-lg border'
              />
              <button
                type='button'
                onClick={() => onImageRemove(index)}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
              >
                <X className='h-4 w-4' />
              </button>
              <p className='text-xs text-gray-500 mt-1 truncate'>{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
