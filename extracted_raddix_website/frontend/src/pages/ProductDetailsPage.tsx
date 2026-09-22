import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { publicProductService } from '@/services/publicProductService';
import { Product } from '@/data/products';
import { Section, Button } from '@/components/ui';
import { 
  ProductImageGallery, 
  ProductInfo, 
  ProductDetailsTabs, 
  RelatedProducts 
} from '@/features/products';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(false);
      try {
        if (!id) throw new Error('No ID provided');
        
        const data = await publicProductService.getById(id);
        
        if (isMounted) {
          if (data) {
            setProduct(data);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProduct();

    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[var(--bg-primary)]">
        <div className="container-content max-w-7xl mx-auto">
          <div className="animate-pulse flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-xl mb-4" />
              <div className="flex gap-4">
                {[1,2,3].map(i => <div key={i} className="w-24 h-24 bg-[var(--bg-secondary)] rounded-lg" />)}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="h-4 w-24 bg-[var(--bg-secondary)] rounded" />
              <div className="h-12 w-3/4 bg-[var(--bg-secondary)] rounded" />
              <div className="h-8 w-32 bg-[var(--bg-secondary)] rounded" />
              <div className="h-32 w-full bg-[var(--bg-secondary)] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-[var(--bg-primary)] pt-20">
        <h2 className="text-display-md mb-4">Product Not Found</h2>
        <p className="text-body-lg text-[var(--text-secondary)] mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/products">
          <Button size="lg">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <Section className="py-8 border-b border-[var(--border-primary)] hidden md:block">
        <Link to="/products" className="inline-flex items-center text-body-sm text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
      </Section>

      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Top Section */}
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
            
            {/* Left: Image Gallery */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery images={product.images} productName={product.name} />
            </motion.div>
            
            {/* Right: Product Info */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductInfo product={product} />
            </motion.div>

          </div>

          {/* Bottom Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <ProductDetailsTabs product={product} />
          </motion.div>

          {/* Related Products */}
          <RelatedProducts category={product.category} currentProductId={product.id} />

        </div>
      </Section>
    </div>
  );
}
