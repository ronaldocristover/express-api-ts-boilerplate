export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    message: string;
    details?: any[];
    stack?: string;
  };
  path?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  q?: string; // Search query parameter for filtering all columns
}
