import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';

export default function ProductsSection() {
  const navigate = useNavigate();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Section className="bg-[var(--bg-primary)] border-t border-[var(--border-strong)]">
      <SectionHeading 
        eyebrow="Hardware" 
        title="Featured Products" 
        description="Enterprise-grade robotics hardware engineered for reliability, precision, and seamless software integration."
      />
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {featuredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden p-0 border-0 shadow-sm bg-[var(--bg-secondary)] card-interactive" onClick={() => navigate(`/products/${product.id}`)}>
              {/* Image */}
              <div className="h-48 bg-black flex items-center justify-center relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[var(--bg-primary)] text-caption font-semibold rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-heading-md mb-2">{product.name}</h3>
                <p className="text-body-sm text-[var(--text-secondary)] mb-4 flex-grow line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <p className="font-semibold">{formatPrice(product.price)}</p>
                  <Button variant="ghost" className="text-[var(--color-brand)] p-0">
                    View Product <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline" onClick={() => navigate('/products')}>View All Products</Button>
      </div>
    </Section>
  );
}
