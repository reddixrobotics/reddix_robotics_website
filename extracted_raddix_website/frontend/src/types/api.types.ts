// ============================================================
// Generic API wrapper types — mirrors NestJS response shapes
// ============================================================

/** Standard success envelope returned by the NestJS backend. */
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

/** Paginated list envelope. */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Standard error shape from NestJS exception filters. */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

/** Query params for paginated endpoints. */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
