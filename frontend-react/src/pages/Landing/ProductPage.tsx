import { useMemo, useState } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import { useProducts } from '../../hooks/product/useProduct';
// import { dummyProducts } from '../../services/data';
import type { Product } from '../../types/product';
import { Button } from '../../components/ui/button';

function ProductPage() {
  const { data, isLoading } = useProducts();
  console.log('data = ', data);
  const listProducts = data?.data ?? [];
  console.log('list products = ', listProducts);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Logic Pagination
  const totalPage = Math.ceil((listProducts?.length || 0) / pageSize);
  const displayedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return listProducts.slice(startIndex, endIndex);
  }, [listProducts, currentPage, pageSize]);

  return (
    <div>
      <section className='container mx-auto px-6 py-8'>
        <h1 className='text-primary text-2xl lg:text-3xl xl:text-4xl font-bold'>Our Products</h1>
      </section>
      <section className='container mx-auto px-6 py-8'>
        {isLoading ? (
          <p className='text-black text-center text-lg font-medium'>Loading ....</p>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {displayedData.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  images={product.images}
                  name={product.name}
                  slug={product.slug}
                  description={product.description}
                  price={product.price}
                />
              ))}
            </div>
            <div className='mt-6 flex justify-center items-center gap-2'>
              <Button
                size={'sm'}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <p className='text-sm'>
                Page {currentPage} from {totalPage}
              </p>
              <Button
                size={'sm'}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                disabled={currentPage === totalPage}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ProductPage;
