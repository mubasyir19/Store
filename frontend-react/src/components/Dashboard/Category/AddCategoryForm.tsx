import React, { useState } from 'react';
import { createSlug } from '../../../helpers/slug';
import { useAddCategory } from '../../../hooks/category/useCategory';
import type { CategoryPayload } from '../../../types/category';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface AddCategoryFormProps {
  onSuccess: () => void;
}

function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const { mutate, isPending } = useAddCategory();
  const [formData, setFormData] = useState<CategoryPayload>({
    name: '',
    slug: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('send form = ', formData);

    mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', slug: '' });
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name of Category</Label>
        <Input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Input name category'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='slug'>Slug</Label>
        <Input
          type='text'
          name='slug'
          value={createSlug(formData.name)}
          onChange={handleChange}
          placeholder='Slug will be automatically be filled when entering the name'
        />
      </div>
      <div className=''>
        <Button type='submit' className='w-full cursor-pointer'>
          {isPending ? 'Loading...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}

export default AddCategoryForm;
