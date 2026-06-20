import DataTable from 'react-data-table-component';
import type { Order } from '../../../types/order';
import { useOrderAll } from '../../../hooks/order/useOrder';
import { getStatusBadge } from '../../../helpers/statusBadge';

const columns = [
  {
    name: 'Order ID',
    selector: (row: Order) => row.midtransOrderId,
  },
  {
    name: 'Date',
    selector: (row: Order) => {
      const dateObj = new Date(row.createdAt);
      return (
        <p>
          {dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      );
    },
  },
  {
    name: 'Customer',
    selector: (row: Order) => row.user.name,
  },
  {
    name: 'Total Price',
    selector: (row: Order) => (
      <p>{Number(row.totalPrice).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
    ),
  },
  {
    name: 'Status',
    selector: (row: Order) => (
      <p className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(row.status)}`}>
        {row.status}
      </p>
    ),
  },
];

function ListOrder() {
  const { data, isLoading } = useOrderAll();
  const orders: Order[] = data?.data ?? [];
  return (
    <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
      <div className='flex items-center justify-between'>
        <p className='text-black font-semibold text-xl'>List Orders</p>
      </div>
      {isLoading ? (
        <p className='text-center text-sm text-black'>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
          highlightOnHover
          pointerOnHover
        />
      )}
    </div>
  );
}

export default ListOrder;
