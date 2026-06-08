type DummyProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  imageUrl: string;
};

export const dummyProducts: DummyProduct[] = [
  {
    id: 1,
    name: 'Classic Leather Backpack',
    slug: 'classic-leather-backpack',
    price: 850000,
    description: 'Durable and stylish leather backpack perfect for daily use and travel.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
  },
  {
    id: 2,
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    price: 2499000,
    description: 'Experience pure sound with up to 30 hours of battery life and active ANC.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 3,
    name: 'Minimalist Ceramic Coffee Mug',
    slug: 'minimalist-ceramic-coffee-mug',
    price: 120000,
    description: 'Handcrafted matte ceramic mug. Dishwasher and microwave safe.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
  },
  {
    id: 4,
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    price: 1150000,
    description: 'RGB backlit mechanical keyboard with tactile brown switches.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
  },
  {
    id: 5,
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    price: 320000,
    description: 'Double-wall vacuum insulated bottle that keeps drinks cold for 24 hours.',
    imageUrl: '', // Left blank to test your fallback gray background div!
  },
];
