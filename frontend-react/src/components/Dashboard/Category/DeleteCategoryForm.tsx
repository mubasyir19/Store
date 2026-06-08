import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useDeleteCategory } from '../../../hooks/category/useCategory';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../../types/error';

interface DeleteCategoryFormProps {
  id: string;
}

function DeleteCategoryForm({ id }: DeleteCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleDelete = () => {
    deleteCategory(id, {
      onSuccess: () => {
        toast.success('Category deleted successfully');
        setIsDialogOpen(false);
      },
      onError: (error) => {
        const message = (error as AxiosError<ErrorResponse>).response?.data?.message || 'Failed to delete category';
        toast.error(message);
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size={'icon-xs'} className='bg-red-500'>
          <Trash className='text-white' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end gap-2'>
          <DialogClose asChild>
            <Button
              size={'sm'}
              variant={'outline'}
              type='button'
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
              className='rounded-md border border-gray-600 px-3 py-2 text-sm text-black'
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            size={'sm'}
            type='button'
            onClick={handleDelete}
            disabled={isPending}
            className='bg-primary hover:bg-primary/80 rounded-md px-3 py-2 text-sm font-semibold text-white'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCategoryForm;
