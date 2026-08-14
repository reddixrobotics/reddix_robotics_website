import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ShoppingCart } from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductFilters, { FilterState } from './ProductFilters';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import { Section, Button } from '@/components/ui';
import { useCart } from '@/context/CartContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const ITEMS_PER_PAGE = 6;

export default function ProductsMarketplace() {
  const { items } = useCart();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    availability: 'All',
    priceRange: [0, 100000]
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Availability
    if (filters.availability !== 'All') {
      result = result.filter(p => p.availability === filters.availability);
    }

    // Price
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'featured': 
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return result;
  }, [filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useMemo(() => setCurrentPage(1), [filters, sortBy]);

  return (
    <Section className="bg-[var(--bg-primary)] py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
        
        {/* Filters */}
        <ProductFilters 
          filters={filters} 
          setFilters={setFilters} 
          categories={categories}
          isMobileOpen={isMobileFiltersOpen}
          setIsMobileOpen={setIsMobileFiltersOpen}
        />

        {/* Main Content */}
        <div className="flex-grow">
          {/* Top Bar (Mobile filter toggle & Sorting) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="lg:hidden w-full sm:w-auto justify-center"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <Filter size={16} className="mr-2" /> Filters
              </Button>
              <p className="text-body-sm text-[var(--text-secondary)] hidden sm:block">
                Showing {filteredProducts.length} results
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="sort" className="text-body-sm text-[var(--text-secondary)] whitespace-nowrap">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full sm:w-auto bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-md py-2 px-3 text-body-sm focus:outline-none focus:border-[var(--color-brand)] text-[var(--text-primary)] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <Link
                to="/cart"
                className="btn btn-ghost btn-icon btn-md focus-ring relative border border-[var(--border-strong)] bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--bg-tertiary)] transition-colors ml-1 flex items-center justify-center min-w-[40px] min-h-[40px]"
                aria-label="View Cart"
              >
                <ShoppingCart size={20} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Mobile result count */}
            <p className="text-body-sm text-[var(--text-secondary)] sm:hidden">
              Showing {filteredProducts.length} results
            </p>
          </div>

          {/* Grid & Pagination */}
          <ProductGrid products={paginatedProducts} />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </Section>
  );
}
