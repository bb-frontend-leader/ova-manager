import { useCallback, useMemo, useState } from 'react';

export type SortOrder = 'asc' | 'desc' | 'none';

export const useFilter = <T extends { title?: string; tags?: string[] }>(
  rawData: T[],
  initialSearch = '',
  initialFilters: string[] = [],
  initialSort: SortOrder = 'none'
): {
  data: T[];
  searchTerm: string;
  activeFilters: string[];
  sortOrder: SortOrder;
  handleSearch: (searchTerm: string) => void;
  handleFilter: (filters: string[]) => void;
  handleSort: (order: SortOrder) => void;
  resetFilters: () => void;
} => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);

  // Derive search, tag filters, and sort whenever any of them change
  const data = useMemo(() => {
    let filteredData = [...rawData];

    // Apply search filter if exists
    if (searchTerm) {
      const normalize = (str: string) => str.toLowerCase().replace(/[-\s]/g, '');
      const normalizedSearch = normalize(searchTerm);
      filteredData = filteredData.filter((item) => normalize(item.title || '').includes(normalizedSearch));
    }

    // Apply tag filters if any exist
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        activeFilters.some((filter) => item.tags?.map((tag) => tag.toLowerCase()).includes(filter.toLowerCase()))
      );

      // Sort by relevance (match count) only when no explicit sort is active
      if (sortOrder === 'none') {
        filteredData.sort((a, b) => {
          const aMatch = activeFilters.filter((f) =>
            a.tags?.map((t) => t.toLowerCase()).includes(f.toLowerCase())
          ).length;
          const bMatch = activeFilters.filter((f) =>
            b.tags?.map((t) => t.toLowerCase()).includes(f.toLowerCase())
          ).length;
          return bMatch - aMatch;
        });
      }
    }

    // Explicit alphabetical sort overrides relevance sort
    if (sortOrder !== 'none') {
      filteredData.sort((a, b) => {
        const aTitle = a.title || '';
        const bTitle = b.title || '';
        return sortOrder === 'asc'
          ? aTitle.localeCompare(bTitle, undefined, { numeric: true, sensitivity: 'base' })
          : bTitle.localeCompare(aTitle, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return filteredData;
  }, [searchTerm, activeFilters, sortOrder, rawData]);

  // Stable identities so consumers can safely list them as effect dependencies
  const handleSearch = useCallback((term: string) => setSearchTerm(term), []);
  const handleFilter = useCallback((filters: string[]) => setActiveFilters(filters), []);
  const handleSort = useCallback((order: SortOrder) => setSortOrder(order), []);
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setActiveFilters([]);
    setSortOrder('none');
  }, []);

  return {
    data,
    searchTerm,
    activeFilters,
    sortOrder,
    handleSearch,
    handleFilter,
    handleSort,
    resetFilters
  };
};
