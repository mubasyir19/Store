import { Pencil } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { useMemo, useState } from 'react';
import type { CategoryPayload } from '../../../types/category';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { createSlug } from '../../../helpers/slug';
import { useCategoryById, useUpdateCategory } from '../../../hooks/category/useCategory';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../../types/error';
import { toast } from 'sonner';

interface EditCategoryFormProps {
  id: string;
}

function EditCategoryForm({ id }: EditCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: categoryData } = useCategoryById(id);
  //   console.log('ctg by id = ', categoryData);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const initialFormData = useMemo(() => {
    if (categoryData) {
      return {
        name: categoryData.name || '',
        slug: categoryData.slug || '',
      };
    }
    return {
      name: '',
      slug: '',
    };
  }, [categoryData]);

  const [formData, setFormData] = useState<CategoryPayload>(initialFormData);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrors({ name: 'Nama category tidak boleh kosong' });
      return;
    }

    updateCategory(
      { id, payload: formData },
      {
        onSuccess: () => {
          // Reset form
          setFormData({ name: '', slug: '' });
          setErrors({});
          // Tutup dialog
          setIsDialogOpen(false);
          // Panggil callback jika ada
          //   onSuccess?.();
        },
        onError: (error) => {
          const message = (error as AxiosError<ErrorResponse>).response?.data?.message || 'Failed to edit category';
          toast.error(message);
        },
      },
    );
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (open && categoryData) {
      setFormData({
        name: categoryData.name || '',
        slug: categoryData.slug || '',
      });
      setErrors({});
    }

    if (!open) {
      setErrors({});
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size={'icon-xs'} className='bg-blue-500'>
          <Pencil className='text-white' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
              disabled
            />
          </div>
          <div className=''>
            <Button type='submit' className='w-full cursor-pointer'>
              {isPending ? 'Loading...' : 'Submit'}
              {/* Submit */}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategoryForm;
