import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Drumstick } from 'lucide-react';
import { useLocation } from 'wouter';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cleanString } from '@utils/clean-string';

import { type SortOrder, useFilter } from '@/hooks/useFilter';
import type { FilterType, Ova } from '@/types/ova';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

import { Filter } from './filter';
import { OvaCard } from './ova-card';
import { SearchBar } from './search-bar';

const GRID_GAP = 14; // matches the previous gap-3.5 (0.875rem)
const LIST_GAP = 8; // matches the previous gap-2 (0.5rem)
const GRID_ROW_ESTIMATE = 340;
const LIST_ROW_ESTIMATE = 96;

interface Props {
  data: Ova[];
  groups: string[];
}

export const OvaView: React.FC<Props> = ({ data, groups }) => {
  const [location, setLocation] = useLocation();

  // Parse initial values from URL on mount
  const searchIdx = location.indexOf('?');
  const locationQs = searchIdx >= 0 ? location.slice(searchIdx + 1) : '';
  const urlParams = new URLSearchParams(locationQs);
  const initialSearch = urlParams.get('search') ?? '';
  const initialFilters = urlParams.get('filters') ? urlParams.get('filters')!.split(',') : [];
  const initialSort = (urlParams.get('sort') as SortOrder) ?? 'none';
  const initialView = (urlParams.get('view') as 'grid' | 'list') ?? 'grid';

  const {
    data: filteredData,
    searchTerm,
    activeFilters,
    sortOrder,
    handleSearch,
    handleFilter,
    handleSort
  } = useFilter<Ova>(data, initialSearch, initialFilters, initialSort);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView);

  // Measure available width to compute how many grid columns fit (mirrors the
  // previous CSS `grid-cols-[repeat(auto-fit,minmax(min(100%,30ch),1fr))]` rule)
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (viewMode === 'list') {
      setColumns(1);
      return;
    }
    const container = gridRef.current;
    const probe = probeRef.current;
    if (!container || !probe) return;

    const recompute = () => {
      const minColumnWidth = probe.getBoundingClientRect().width;
      const availableWidth = container.getBoundingClientRect().width;
      const next = Math.max(1, Math.floor((availableWidth + GRID_GAP) / (minColumnWidth + GRID_GAP)));
      setColumns(next);
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    return () => observer.disconnect();
  }, [viewMode]);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (viewMode === 'grid' ? GRID_ROW_ESTIMATE : LIST_ROW_ESTIMATE),
    overscan: 6,
    lanes: columns,
    laneAssignmentMode: 'estimate',
    gap: viewMode === 'grid' ? GRID_GAP : LIST_GAP
  });

  // Sync filter state back to URL on every change (skip on first render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (activeFilters.length > 0) params.set('filters', activeFilters.join(','));
    if (sortOrder !== 'none') params.set('sort', sortOrder);
    if (viewMode !== 'grid') params.set('view', viewMode);
    const qs = params.toString();
    setLocation(qs ? `/?${qs}` : '/');
  }, [searchTerm, activeFilters, sortOrder, viewMode, setLocation]);

  const filters: FilterType[] = [
    {
      name: 'By group',
      options: groups.map((group) => cleanString(group))
    },
    {
      name: 'By media',
      options: ['audio', 'audio description', 'video', 'subtitles', 'video sign language']
    }
  ];

  return (
    <>
      <Filter
        onFilter={handleFilter}
        filters={filters}
        defaultFilters={initialFilters}
        sortOrder={sortOrder}
        onSort={handleSort}
        viewMode={viewMode}
        onViewMode={setViewMode}>
        <SearchBar onSearch={handleSearch} defaultValue={initialSearch} />
        <p className="text-sm text-muted-foreground ml-auto">
          Showing <span className="font-semibold">{filteredData.length}</span> of{' '}
          <span className="font-semibold">{data.length}</span> OVAs
        </p>
      </Filter>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="h-full min-h-0">
          <div
            ref={scrollRef}
            className="container-border scrollbar-subtle h-full min-h-0 overflow-y-auto px-10 py-8 not-prose z-15 relative bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light dark:shadow-dark bg-size-[16px_16px]">
            {filteredData.length > 0 ? (
              <div ref={gridRef} style={{ position: 'relative', width: '100%', height: rowVirtualizer.getTotalSize() }}>
                <span
                  ref={probeRef}
                  aria-hidden="true"
                  style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', width: '30ch', height: 0, overflow: 'hidden' }}
                />
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const ova = filteredData[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: `${(virtualItem.lane / columns) * 100}%`,
                        width: `${100 / columns}%`,
                        transform: `translateY(${virtualItem.start}px)`,
                        boxSizing: 'border-box',
                        paddingRight: viewMode === 'grid' ? GRID_GAP : 0,
                        paddingBottom: viewMode === 'grid' ? GRID_GAP : LIST_GAP
                      }}>
                      <OvaCard ova={ova} viewMode={viewMode} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <Drumstick />
                <AlertTitle>No results found</AlertTitle>
                <AlertDescription>No results were found for the applied search or filter.</AlertDescription>
              </Alert>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
