import { useState, useMemo, ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => ReactNode;
}

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef<T> {
  key: keyof T;
  label: string;
  options: FilterOption[];
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchableKey?: keyof T;
  searchKey?: keyof T; // Alias for backward compatibility
  searchPlaceholder?: string;
  isLoading?: boolean;
  itemsPerPage?: number;
  filters?: FilterDef<T>[];
}

export function AdminDataTable<T>({ columns, data, searchableKey, searchKey, searchPlaceholder, isLoading, itemsPerPage = 5, filters }: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const actualSearchKey = searchableKey || searchKey;

  // Filter Data
  const filteredData = useMemo(() => {
    let result = data;
    
    // Apply text search
    if (searchTerm && actualSearchKey) {
      result = result.filter((item) => {
        const val = item[actualSearchKey];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    }

    // Apply dropdown filters
    if (filters && Object.keys(filterValues).length > 0) {
      result = result.filter((item) => {
        for (const [key, value] of Object.entries(filterValues)) {
          if (value && String(item[key as keyof T]) !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return result;
  }, [data, searchTerm, actualSearchKey, filters, filterValues]);

  // Paginate Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      
      {/* Toolbar */}
      {(actualSearchKey || filters) && (
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111]">
          {actualSearchKey ? (
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder || "Search..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to page 1 on search
                }}
                className="w-full bg-[#0a0a0a] border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          ) : <div />}

          {filters && filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {filters.map((f, idx) => (
                <select
                  key={idx}
                  value={filterValues[f.key as string] || ''}
                  onChange={(e) => {
                    setFilterValues(prev => ({ ...prev, [f.key as string]: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="bg-[#0a0a0a] border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 transition-colors min-w-[120px]"
                >
                  <option value="">All {f.label}</option>
                  {f.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-zinc-500 text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                      {col.cell ? col.cell(item) : (item[col.accessor] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-[#111]">
          <span className="text-xs text-zinc-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
