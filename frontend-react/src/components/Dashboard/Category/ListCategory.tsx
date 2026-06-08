import { Plus } from 'lucide-react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useCategories } from '../../../hooks/category/useCategory';
import type { CategoryTable } from '../../../types/category';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import AddCategoryForm from './AddCategoryForm';
import DeleteCategoryForm from './DeleteCategoryForm';
import EditCategoryForm from './EditCategoryForm';

const columns = [
  { name: 'Name', selector: (row: CategoryTable) => row.name, sortable: true },
  { name: 'Total Products', selector: (row: CategoryTable) => row._count.products },
  {
    name: 'Actions',
    selector: (row: CategoryTable) => (
      <div className='flex items-stretch gap-3'>
        <EditCategoryForm id={row.id} />
        <DeleteCategoryForm id={row.id} />
      </div>
    ),
  },
];

function ListCategory() {
  const { data: dataCategories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false); // Tutup dialog saat sukses
  };

  return (
    <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
      <div className='flex items-center justify-between'>
        <p className='text-black font-semibold text-xl'>Categories Product</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className='px-4 py-2 rounded-lg cursor-pointer bg-primary text-white flex items-center justify-center gap-2'>
              <Plus className='size-4 text-white' />
              <p className='text-white text-xs'>Add New Category</p>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className=''>
              <AddCategoryForm onSuccess={handleSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* DataTable */}
      <DataTable columns={columns} data={dataCategories || []} />
    </div>
  );
}

export default ListCategory;
