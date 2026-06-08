import ProductCard from '../../components/Product/ProductCard';
import { dummyProducts } from '../../services/data';

function ProductPage() {
  return (
    <div>
      <section className='container mx-auto px-6 py-8'>
        <h1 className='text-primary text-2xl lg:text-3xl xl:text-4xl font-bold'>Our Products</h1>
      </section>
      <section className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {dummyProducts.map((product, i) => (
            <ProductCard
              key={i}
              // imageUrl={product.imageUrl}
              name={product.name}
              slug={product.slug}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
