import { Pencil, Plus, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import AddProductForm from './AddProductForm';
import DataTable from 'react-data-table-component';
import { Button } from '../../ui/button';
import type { ProductTable } from '../../../types/product';
import { useProducts } from '../../../hooks/product/useProduct';
import { useState } from 'react';
import EditProductForm from './EditProductForm';

const columns = [
  { name: 'Name', selector: (row: ProductTable) => row.name, sortable: true },
  { name: 'Stock', selector: (row: ProductTable) => row.stock, sortable: true },
  {
    name: 'Price',
    selector: (row: ProductTable) => {
      // row.category.name, sortable: true
      return (
        <p className='text-black text-sm'>
          {Number(row.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </p>
      );
    },
  },
  { name: 'Category', selector: (row: ProductTable) => row.category.name, sortable: true },
  {
    name: 'Actions',
    selector: (row: ProductTable) => (
      <div className='flex items-stretch gap-3'>
        {/* <Button size={'icon-xs'} className='bg-blue-500'>
          <Pencil className='text-white' />
        </Button> */}
        <EditProductForm id={row.id} />
        <Button size={'icon-xs'} className='bg-red-500'>
          <Trash className='text-white' />
        </Button>
      </div>
    ),
  },
];

function ListProduct() {
  const { data: dataProduct, isLoading } = useProducts();
  console.log('Products =', dataProduct);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
      <div className='flex items-center justify-between'>
        <p className='text-black font-semibold text-xl'>List Products</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className='px-4 py-2 rounded-lg cursor-pointer bg-primary text-white flex items-center justify-center gap-2'>
              <Plus className='size-4 text-white' />
              <p className='text-white text-xs'>Add New Product</p>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className=''>
              <AddProductForm onSuccess={handleSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p className='text-center text-sm text-black'>Loading...</p>
      ) : (
        <DataTable columns={columns} data={dataProduct.data || []} />
      )}
    </div>
  );
}

export default ListProduct;
