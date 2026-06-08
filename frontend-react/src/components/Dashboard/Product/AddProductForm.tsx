// src/components/Dashboard/Product/AddProductForm.tsx
import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { AddProductPayload } from '../../../types/product';
import { createSlug } from '../../../helpers/slug';
import { useAddProduct } from '../../../hooks/product/useProduct';
import { useCategories } from '../../../hooks/category/useCategory';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { Category } from '../../../types/category';
import { Textarea } from '../../ui/textarea';
import { ImageUpload } from './ImageUpload';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

interface AddProductFormProps {
  onSuccess: () => void;
}

function AddProductForm({ onSuccess }: AddProductFormProps) {
  const { mutate: addProduct, isPending } = useAddProduct();
  const { data: dataCategory, isLoading: loadingCategory } = useCategories();

  const [formData, setFormData] = useState<AddProductPayload>({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === 'name') {
        updatedData.slug = createSlug(value);
      }

      return updatedData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
    if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: '' }));
    }
  };

  const handleImagesChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, images: files }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addProduct(formData, {
      onSuccess: () => {
        toast.success('Product created successfully');
        setFormData({
          categoryId: '',
          name: '',
          slug: '',
          description: '',
          price: 0,
          stock: 0,
          images: [],
        });
        onSuccess?.();
      },
      onError: (error: any) => {
        console.error('Failed to create product:', error);
        toast.error(error.response?.data?.message || 'Failed to create product');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='categoryId'>Category Product</Label>
        <Select onValueChange={handleSelectChange} value={formData.categoryId}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Choose category' />
          </SelectTrigger>
          <SelectContent>
            {loadingCategory ? (
              <p className='text-sm text-black text-center'>Loading...</p>
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
        {errors.categoryId && <p className='text-sm text-red-500'>{errors.categoryId}</p>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Product Name</Label>
          <Input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Input product name'
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='slug'>Slug</Label>
          <Input
            type='text'
            name='slug'
            value={formData.slug}
            onChange={handleChange}
            placeholder='Slug will be automatically filled'
            readOnly
            className='bg-gray-50'
          />
          {errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='price'>Price</Label>
          <Input
            type='number'
            name='price'
            value={formData.price || ''}
            onChange={handleChange}
            placeholder='Product price'
            min={0}
            step={1000}
          />
          {errors.price && <p className='text-sm text-red-500'>{errors.price}</p>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='stock'>Stock</Label>
          <Input
            type='number'
            name='stock'
            value={formData.stock}
            onChange={handleChange}
            placeholder='Product stock'
            min={0}
          />
          {errors.stock && <p className='text-sm text-red-500'>{errors.stock}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description Product</Label>
        <Textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Product description'
          rows={4}
        />
      </div>

      <div className='space-y-2'>
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          onImageRemove={handleImageRemove}
          maxImages={10}
        />
        {errors.images && <p className='text-sm text-red-500'>{errors.images}</p>}
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

export default AddProductForm;
