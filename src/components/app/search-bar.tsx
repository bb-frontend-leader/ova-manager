import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';

import { Input } from '../ui/input';

interface Props {
  onSearch: (searchTerm: string) => void;
  defaultValue?: string;
}

export const SearchBar: React.FC<Props> = ({ onSearch, defaultValue }) => {
  const [search, setSearch] = useState<string>(defaultValue ?? '');
  const debouncedSearch = useDebounce(search, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClear = () => {
    setSearch('');
  };

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="relative md:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

      <Input
        type="text"
        placeholder="Search ova..."
        className="w-full pl-10 pr-8"
        value={search}
        onChange={handleChange}
      />

      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
