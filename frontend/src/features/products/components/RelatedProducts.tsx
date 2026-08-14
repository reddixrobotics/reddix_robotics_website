import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, getRelatedProducts } from '@/data/products';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const related = await getRelatedProducts(category, currentProductId);
        if (isMounted) {
          setProducts(related);
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRelated();

    return () => { isMounted = false; };
  }, [category, currentProductId]);

  if (isLoading) {
    return (
      <div className="mt-24">
        <h3 className="text-heading-lg mb-8">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-24">
      <h3 className="text-heading-lg mb-8">Related Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
