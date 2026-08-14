import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui';

export interface FilterState {
  search: string;
  category: string;
  availability: string;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  categories: string[];
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export default function ProductFilters({ filters, setFilters, categories, isMobileOpen, setIsMobileOpen }: ProductFiltersProps) {
  
  const handleCategoryChange = (cat: string) => {
    setFilters({ ...filters, category: cat });
  };

  const handleAvailabilityChange = (status: string) => {
    setFilters({ ...filters, availability: status });
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters({ ...filters, priceRange: [min, max] });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      availability: 'All',
      priceRange: [0, 100000]
    });
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h4 className="text-heading-sm mb-3">Search</h4>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-md py-2 pl-10 pr-4 text-body-sm focus:outline-none focus:border-[var(--color-brand)] text-[var(--text-primary)]"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-heading-sm mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                checked={filters.category === cat}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 accent-[var(--color-brand)] bg-[var(--bg-primary)] border-[var(--border-strong)] cursor-pointer"
              />
              <span className={`text-body-sm transition-colors ${filters.category === cat ? 'text-[var(--color-brand)] font-medium' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-heading-sm mb-3">Availability</h4>
        <div className="space-y-2">
          {['All', 'In Stock', 'Low Stock', 'Backorder'].map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="availability"
                checked={filters.availability === status}
                onChange={() => handleAvailabilityChange(status)}
                className="w-4 h-4 accent-[var(--color-brand)] bg-[var(--bg-primary)] border-[var(--border-strong)] cursor-pointer"
              />
              <span className={`text-body-sm transition-colors ${filters.availability === status ? 'text-[var(--color-brand)] font-medium' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-heading-sm mb-3">Price</h4>
        <div className="space-y-2">
          {[
            { label: 'All Prices', min: 0, max: 100000 },
            { label: 'Under $1,000', min: 0, max: 1000 },
            { label: '$1,000 - $5,000', min: 1000, max: 5000 },
            { label: '$5,000 - $20,000', min: 5000, max: 20000 },
            { label: 'Over $20,000', min: 20000, max: 100000 }
          ].map((range, i) => {
            const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="w-4 h-4 accent-[var(--color-brand)] bg-[var(--bg-primary)] border-[var(--border-strong)] cursor-pointer"
                />
                <span className={`text-body-sm transition-colors ${isSelected ? 'text-[var(--color-brand)] font-medium' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Button variant="outline" className="w-full justify-center mt-4" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 pr-8 border-r border-[var(--border-primary)] sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
        <FilterContent />
      </div>

      {/* Mobile Overlay & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-80 max-w-[80%] h-full bg-[var(--bg-secondary)] border-r border-[var(--border-strong)] shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--border-primary)] pb-4">
              <h3 className="text-heading-md flex items-center gap-2"><Filter size={20} /> Filters</h3>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-brand)]">
                <X size={24} />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
