import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-[var(--border-strong)] rounded-xl bg-[var(--bg-secondary)]">
        <h3 className="text-heading-md mb-2">No products found</h3>
        <p className="text-body-md text-[var(--text-secondary)]">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
