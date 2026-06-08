// src/components/Dashboard/Product/EditProductForm.tsx
import { Pencil } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  useProductById,
  useUpdateProduct,
  useDeleteProductImages,
  useAddProductImages,
  useReplaceProductImages,
} from '../../../hooks/product/useProduct';
import { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/category/useCategory';
import type { Category } from '../../../types/category';
import { X, Upload, Loader2, Trash2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface EditProductFormProps {
  id: string;
}

interface ImageItem {
  id?: string;
  file?: File;
  url?: string;
  isExisting: boolean;
  isDeleting?: boolean;
}

function EditProductForm({ id }: EditProductFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: productData, isLoading: loadingProduct, refetch } = useProductById(id);
  const { data: dataCategory, isLoading: loadingCategory } = useCategories();
  const updateProduct = useUpdateProduct();
  const deleteImages = useDeleteProductImages();
  const addImages = useAddProductImages();
  const replaceImages = useReplaceProductImages();

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    price: '',
    stock: 0,
    description: '',
  });

  const [existingImages, setExistingImages] = useState<ImageItem[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isDialogOpen && productData) {
      setFormData({
        categoryId: productData.categoryId || '',
        name: productData.name || '',
        slug: productData.slug || '',
        price: productData.price?.toString() || '',
        stock: productData.stock || 0,
        description: productData.description || '',
      });

      // Initialize existing images
      if (productData.images && productData.images.length > 0) {
        setExistingImages(
          productData.images.map((url: string, index: number) => ({
            id: `existing-${index}`,
            url,
            isExisting: true,
          })),
        );
      } else {
        setExistingImages([]);
      }

      setNewImageFiles([]);
      setImagesToDelete([]);
      setIsReplaceMode(false);
    }
  }, [isDialogOpen, productData]);

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: createSlug(value) }),
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.error('Only JPEG, PNG, and WEBP images are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    const validSizeFiles = validFiles.filter((file) => file.size <= maxSize);

    if (validSizeFiles.length !== validFiles.length) {
      toast.error('Each image must be less than 5MB');
    }

    // Check max images limit (10 total)
    const currentCount = isReplaceMode
      ? validSizeFiles.length
      : existingImages.length - imagesToDelete.length + newImageFiles.length;
    const maxImages = 10;

    if (currentCount + validSizeFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      const availableSlots = maxImages - currentCount;
      const filesToAdd = validSizeFiles.slice(0, availableSlots);
      setNewImageFiles((prev) => [...prev, ...filesToAdd]);
    } else {
      setNewImageFiles((prev) => [...prev, ...validSizeFiles]);
    }

    // Clear input
    e.target.value = '';
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img.url !== imageUrl));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepare update payload
      const updatePayload = {
        categoryId: formData.categoryId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseInt(formData.price),
        stock: formData.stock,
      };

      // Handle different update scenarios
      if (isReplaceMode) {
        // Replace all images
        if (newImageFiles.length === 0) {
          toast.error('Please select images to replace');
          return;
        }

        await replaceImages.mutateAsync({
          id,
          images: newImageFiles,
        });

        // Update product data
        await updateProduct.mutateAsync({
          id,
          payload: updatePayload,
          replaceImages: false, // Don't replace images again
        });

        toast.success('Product images replaced successfully');
      } else {
        // Delete selected images
        if (imagesToDelete.length > 0) {
          await deleteImages.mutateAsync({
            id,
            imageUrls: imagesToDelete,
          });
        }

        // Add new images
        if (newImageFiles.length > 0) {
          await addImages.mutateAsync({
            id,
            images: newImageFiles,
          });
        }

        // Update product data
        await updateProduct.mutateAsync({
          id,
          payload: updatePayload,
          replaceImages: false,
        });

        toast.success('Product updated successfully');
      }

      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleReplaceModeToggle = () => {
    if (!isReplaceMode && (existingImages.length > 0 || newImageFiles.length > 0)) {
      const confirmed = window.confirm(
        'Replace mode will remove all current images. Any unsaved changes will be lost. Continue?',
      );
      if (!confirmed) return;
    }

    setIsReplaceMode(!isReplaceMode);
    setNewImageFiles([]);
    setImagesToDelete([]);
  };

  const totalImages = isReplaceMode ? newImageFiles.length : existingImages.length + newImageFiles.length;

  if (loadingProduct) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size='icon' className='bg-blue-500 hover:bg-blue-600'>
            <Pencil className='h-4 w-4 text-white' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className='text-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto' />
            <p className='mt-2'>Loading product data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size='icon' className='bg-blue-500 hover:bg-blue-600'>
          <Pencil className='h-4 w-4 text-white' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Edit product information and manage images</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Info */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='categoryId'>Category</Label>
              <Select onValueChange={handleSelectChange} value={formData.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategory ? (
                    <div className='text-center py-2'>Loading...</div>
                  ) : (
                    <SelectGroup>
                      {dataCategory?.map((item: Category) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name</Label>
                <Input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Product name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug</Label>
                <Input
                  type='text'
                  name='slug'
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder='product-slug'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='Price'
                  required
                  min={0}
                  step={1000}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='stock'>Stock</Label>
                <Input
                  type='number'
                  name='stock'
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder='Stock'
                  required
                  min={0}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Product description'
                rows={4}
              />
            </div>
          </div>

          {/* Image Management */}
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Label>Product Images ({totalImages}/10)</Label>
              <Button
                type='button'
                variant={isReplaceMode ? 'default' : 'outline'}
                size='sm'
                onClick={handleReplaceModeToggle}
              >
                {isReplaceMode ? 'Append Mode' : 'Replace Mode'}
              </Button>
            </div>

            {isReplaceMode ? (
              // Replace Mode UI
              <div className='border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center bg-yellow-50'>
                <input
                  type='file'
                  id='replace-images'
                  multiple
                  accept='image/jpeg,image/png,image/webp,image/jpg'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <label htmlFor='replace-images' className='cursor-pointer block'>
                  <ImagePlus className='mx-auto h-12 w-12 text-yellow-500' />
                  <p className='mt-2 text-sm text-gray-600'>Click to select new images (will replace all)</p>
                  <p className='text-xs text-gray-500'>JPEG, PNG, WEBP up to 5MB each (Max 10 images)</p>
                </label>
              </div>
            ) : (
              // Append Mode UI
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors'>
                <input
                  type='file'
                  id='add-images'
                  multiple
                  accept='image/jpeg,image/png,image/webp,image/jpg'
                  onChange={handleFileChange}
                  className='hidden'
                  disabled={totalImages >= 10}
                />
                <label htmlFor='add-images' className='cursor-pointer block'>
                  <Upload className='mx-auto h-8 w-8 text-gray-400' />
                  <p className='mt-2 text-sm text-gray-600'>Click to upload new images</p>
                  <p className='text-xs text-gray-500'>JPEG, PNG, WEBP up to 5MB each (Max 10 images total)</p>
                </label>
              </div>
            )}

            {/* Image Preview Grid */}
            {(existingImages.length > 0 || newImageFiles.length > 0) && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {/* Existing Images (only in append mode) */}
                {!isReplaceMode &&
                  existingImages.map((image, index) => (
                    <div key={image.id} className='relative group'>
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className='w-full h-32 object-cover rounded-lg border'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveExistingImage(image.url!)}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                      <p className='text-xs text-gray-500 mt-1 truncate'>Existing</p>
                    </div>
                  ))}

                {/* New Images */}
                {newImageFiles.map((file, index) => (
                  <div key={`new-${index}`} className='relative group'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className='w-full h-32 object-cover rounded-lg border'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveNewImage(index)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X className='h-4 w-4' />
                    </button>
                    <p className='text-xs text-gray-500 mt-1 truncate'>{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDialogOpen(false)}
              disabled={
                updateProduct.isPending || deleteImages.isPending || addImages.isPending || replaceImages.isPending
              }
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                updateProduct.isPending || deleteImages.isPending || addImages.isPending || replaceImages.isPending
              }
            >
              {updateProduct.isPending || deleteImages.isPending || addImages.isPending || replaceImages.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProductForm;
