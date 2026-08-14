import { useState, useMemo, ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchableKey?: keyof T;
  itemsPerPage?: number;
}

export function AdminDataTable<T>({ columns, data, searchableKey, itemsPerPage = 5 }: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchableKey) return data;
    return data.filter((item) => {
      const val = item[searchableKey];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  }, [data, searchTerm, searchableKey]);

  // Paginate Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      
      {/* Toolbar */}
      {searchableKey && (
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#111]">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              className="w-full bg-[#0a0a0a] border border-zinc-800 text-zinc-300 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
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
