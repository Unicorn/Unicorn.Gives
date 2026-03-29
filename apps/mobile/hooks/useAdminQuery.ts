import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdminQueryOptions {
  /** Comma-separated column list for Supabase .select() */
  select?: string;
  /** Column to order by */
  orderBy?: string;
  /** Order direction */
  ascending?: boolean;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** eq filters: { column: value } */
  filters?: Record<string, string | number | boolean | null>;
  /** ilike search: { column: searchTerm } */
  search?: Record<string, string>;
  /** Status filter shorthand */
  status?: string;
  /** Whether to run the query on mount */
  enabled?: boolean;
}

export interface AdminQueryResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refresh: () => void;
}

export function useAdminQuery<T = Record<string, unknown>>(
  table: string,
  options: AdminQueryOptions = {},
): AdminQueryResult<T> {
  const {
    select = '*',
    orderBy = 'created_at',
    ascending = false,
    page = 1,
    pageSize = 25,
    filters = {},
    search = {},
    status,
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Serialize deps for effect
  const filterKey = JSON.stringify(filters);
  const searchKey = JSON.stringify(search);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from(table)
        .select(select, { count: 'exact' });

      // Apply filters
      const parsedFilters = JSON.parse(filterKey) as Record<string, unknown>;
      for (const [col, val] of Object.entries(parsedFilters)) {
        if (val !== null && val !== undefined && val !== '') {
          query = query.eq(col, val);
        }
      }

      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }

      // Apply search (ilike)
      const parsedSearch = JSON.parse(searchKey) as Record<string, string>;
      for (const [col, term] of Object.entries(parsedSearch)) {
        if (term) {
          query = query.ilike(col, `%${term}%`);
        }
      }

      // Ordering
      query = query.order(orderBy, { ascending });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: result, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setData((result ?? []) as T[]);
      setTotal(count ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Query failed');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy, ascending, page, pageSize, filterKey, searchKey, status, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    refresh: fetchData,
  };
}
