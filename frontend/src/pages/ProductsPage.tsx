import { ProductsHeroSection, ProductsMarketplace } from '@/features/products';

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <ProductsHeroSection />
      <ProductsMarketplace />
    </div>
  );
}
