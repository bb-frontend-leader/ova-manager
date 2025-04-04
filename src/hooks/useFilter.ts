import { useState, useEffect } from "react";

export const useFilter = <T extends { title?: string; tags?: string[] }>(
  rawData: T[]
): {
  data: T[];
  handleSearch: (searchTerm: string) => void;
  handleFilter: (filters: string[]) => void;
  resetFilters: () => void;
} => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [data, setData] = useState<T[]>(rawData);

  // Apply both search and filters whenever either changes
  useEffect(() => {
    let filteredData = [...rawData];

    // Apply search filter if exists
    if (searchTerm) {
      filteredData = filteredData.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filters if any exist
    if (activeFilters.length > 0) {
      // First, filter items that match at least one filter
      filteredData = filteredData.filter((item) =>
        activeFilters.some((filter) =>
          item.tags
            ?.map((tag) => tag.toLowerCase())
            .includes(filter.toLowerCase())
        )
      );

      // Then sort by number of matching filters (highest first)
      filteredData.sort((a, b) => {
        const aMatchCount = activeFilters.filter(filter => 
          a.tags?.map(tag => tag.toLowerCase()).includes(filter.toLowerCase())
        ).length;
        
        const bMatchCount = activeFilters.filter(filter => 
          b.tags?.map(tag => tag.toLowerCase()).includes(filter.toLowerCase())
        ).length;
        
        return bMatchCount - aMatchCount; // Descending order (highest first)
      });
    }

    setData(filteredData);
  }, [searchTerm, activeFilters, rawData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilters([]);
  };

  return {
    data,
    handleSearch,
    handleFilter,
    resetFilters
  };
};