import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { useProductBySlug } from '../../hooks/product/useProduct';

function DetailProductPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProductBySlug(slug as string);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset selected image when product changes
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
      setCurrentImageIndex(0);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='text-center py-20'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <p className='mt-4 text-lg text-black text-center font-semibold'>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='text-center py-20'>
          <p className='text-lg text-red-500 text-center font-semibold'>Product not found</p>
        </div>
      </div>
    );
  }

  const images = product?.images || [];
  const mainImage = selectedImage || (images.length > 0 ? images[0] : '/images/placeholder.png');
  const hasMultipleImages = images.length > 1;

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const numericPrice = typeof product?.price === 'string' ? parseInt(product.price) : product?.price || 0;

  const formattedPrice = `Rp ${numericPrice.toLocaleString('id-ID')}`;

  return (
    <div className='h-screen'>
      <section className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Image Gallery Section */}
          <div className='space-y-4'>
            {/* Main Image Display with Zoom */}
            <div
              className={`relative bg-gray-100 rounded-lg overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <div className='relative overflow-hidden h-100 md:h-125'>
                <img
                  src={mainImage}
                  alt={product?.name}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>

              {/* Zoom Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className='absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-all'
              >
                <ZoomIn className='size-5 text-gray-700' />
              </button>

              {/* Navigation Buttons */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all'
                  >
                    <ChevronLeft className='size-5' />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all'
                  >
                    <ChevronRight className='size-5' />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className='absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full'>
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {hasMultipleImages && (
              <div className='grid grid-cols-4 md:grid-cols-5 gap-3'>
                {images.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className={`
                      cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 transform
                      ${
                        selectedImage === imageUrl
                          ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                          : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                    onClick={() => handleThumbnailClick(imageUrl, index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product?.name} - ${index + 1}`}
                      className='w-full h-20 md:h-24 object-cover'
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No Images Placeholder */}
            {images.length === 0 && (
              <div className='bg-gray-100 rounded-lg h-100 md:h-125 flex items-center justify-center'>
                <p className='text-gray-500'>No image available</p>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className='space-y-6'>
            <div>
              <h3 className='text-2xl md:text-3xl font-bold text-primary mb-2'>{product?.name}</h3>
              <p className='text-sm text-gray-500'>Category: {product?.category?.name}</p>
            </div>

            <div className='border-t border-b py-4 space-y-2'>
              <div className='flex items-baseline gap-2'>
                <h2 className='font-extrabold text-primary text-3xl md:text-4xl'>{formattedPrice}</h2>
                <span className='text-sm text-gray-500'>inc. tax</span>
              </div>
              <p className='text-sm text-green-600 font-medium'>Stock: {product?.stock} items available</p>
            </div>

            <div className='space-y-3'>
              <h4 className='font-semibold text-black text-lg'>Description:</h4>
              <p className='text-neutral text-base leading-relaxed'>{product?.description}</p>
            </div>

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4'>
              <button className='bg-primary flex items-center justify-center gap-3 cursor-pointer text-white font-medium text-sm py-3 px-8 rounded-lg hover:bg-primary/90 transition-all hover:scale-105 transform'>
                <ShoppingCart className='size-5 text-white' />
                Add to Cart
              </button>
              <button className='border-2 border-primary bg-transparent cursor-pointer text-primary font-medium text-sm py-3 px-8 rounded-lg hover:bg-primary/10 transition-all'>
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className='bg-gray-50 rounded-lg p-4 space-y-2 mt-6'>
              <p className='text-sm text-gray-700'>
                <span className='font-semibold'>Product ID:</span> {product?.id?.slice(0, 8).toUpperCase()}
              </p>
              <p className='text-sm text-gray-700'>
                <span className='font-semibold'>Last Updated:</span>{' '}
                {new Date(product?.updatedAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetailProductPage;
