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
  RelatedProducts 
} from '@/features/products';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(false);
      try {
        if (!id) throw new Error('No ID provided');
        const data = await publicProductService.getById(id);
        if (isMounted) {
          if (data) setProduct(data);
          else setError(true);
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
      <div className="min-h-screen pt-6 pb-16 bg-[var(--bg-primary)]">
        <div className="container-content max-w-7xl mx-auto">
          <div className="animate-pulse flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="w-full aspect-[4/5] bg-[var(--bg-secondary)] rounded-xl mb-4" />
            </div>
            <div className="lg:w-1/2 space-y-6">
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
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[var(--bg-primary)] pt-6 pb-16">
      <div className="pt-4 pb-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/products" className="inline-flex items-center text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Marketplace
          </Link>
          <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-sm p-6 md:p-10 lg:p-12">
          
          {/* Main Top Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left: Image Gallery */}
            <motion.div 
              className="lg:w-7/12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery images={product.images} productName={product.name} />
            </motion.div>
            
            {/* Right: Product Info */}
            <motion.div 
              className="lg:w-5/12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProductInfo product={product} />
            </motion.div>
          </div>

          {/* Bottom Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mt-20 pt-12 border-t border-[var(--border-subtle)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Description</h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] mt-4">
                    Engineered with premium materials and advanced robotics components, 
                    this product guarantees exceptional performance and durability.
                  </p>
                )}
              </div>
              <div className="lg:col-span-1">
                <h4 className="text-lg font-bold mb-4 text-[var(--text-primary)]">What's Included?</h4>
                <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] mb-8 space-y-1.5">
                  <li>{product.name} Base Unit</li>
                  <li>Instruction Manual</li>
                  <li>Standard Warranty</li>
                </ul>
                
                {product.features && product.features.length > 0 && (
                  <>
                    <h4 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Features</h4>
                    <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1.5">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      <Section className="py-12">
        <div className="max-w-6xl mx-auto">
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </Section>
    </div>
  );
}





