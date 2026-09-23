import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Drumstick } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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
const GRID_ROW_ESTIMATE = 385; // measured height of a grid OvaCard
const LIST_ROW_ESTIMATE = 92; // measured height of a list OvaCard
const LIST_ROW_ESTIMATE_COMPACT = 140; // list OvaCard stacks its buttons below `md` (768px)

interface Props {
  data: Ova[];
  groups: string[];
}

export const OvaView: React.FC<Props> = ({ data, groups }) => {
  // Parse initial values from the URL. With hash routing wouter keeps the query
  // string in the real `location.search`, not inside the hash.
  const urlParams = new URLSearchParams(window.location.search);
  const sortParam = urlParams.get('sort');
  const initialSearch = urlParams.get('search') ?? '';
  const initialFilters = urlParams.get('filters') ? urlParams.get('filters')!.split(',') : [];
  const initialSort: SortOrder = sortParam === 'asc' || sortParam === 'desc' ? sortParam : 'none';
  const initialView: 'grid' | 'list' = urlParams.get('view') === 'list' ? 'list' : 'grid';

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

  // The scroll/grid/probe elements are remounted by AnimatePresence whenever the
  // view mode changes (or the list empties), so they're tracked as state via
  // callback refs; effects then re-attach to whichever element is currently mounted.
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [gridEl, setGridEl] = useState<HTMLDivElement | null>(null);
  const [probeEl, setProbeEl] = useState<HTMLSpanElement | null>(null);
  const [measuredColumns, setMeasuredColumns] = useState(1);
  const columns = viewMode === 'grid' ? measuredColumns : 1;

  // Measure available width to compute how many grid columns fit (mirrors the
  // previous CSS `grid-cols-[repeat(auto-fit,minmax(min(100%,30ch),1fr))]` rule)
  useLayoutEffect(() => {
    if (!gridEl || !probeEl) return;

    const recompute = () => {
      const minColumnWidth = probeEl.getBoundingClientRect().width;
      const availableWidth = gridEl.getBoundingClientRect().width;
      if (!minColumnWidth || !availableWidth) return;
      setMeasuredColumns(Math.max(1, Math.floor((availableWidth + GRID_GAP) / (minColumnWidth + GRID_GAP))));
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(gridEl);
    return () => observer.disconnect();
  }, [gridEl, probeEl]);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => {
      if (viewMode === 'grid') return GRID_ROW_ESTIMATE;
      return window.matchMedia('(min-width: 48rem)').matches ? LIST_ROW_ESTIMATE : LIST_ROW_ESTIMATE_COMPACT;
    },
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
    // wouter's hash `navigate` reuses the current `location.search` when the new
    // path has no query, so it can never clear params; write the URL directly.
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, [searchTerm, activeFilters, sortOrder, viewMode]);

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
        onViewMode={setViewMode}
      >
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
          className="h-full min-h-0"
        >
          <div
            ref={setScrollEl}
            className="container-border scrollbar-subtle h-full min-h-0 overflow-y-auto px-10 py-8 not-prose z-15 relative bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light dark:shadow-dark bg-size-[16px_16px]"
          >
            {filteredData.length > 0 ? (
              <div
                ref={setGridEl}
                style={{ position: 'relative', width: '100%', height: rowVirtualizer.getTotalSize() }}
              >
                <span
                  ref={setProbeEl}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    visibility: 'hidden',
                    width: '30ch',
                    height: 0,
                    overflow: 'hidden'
                  }}
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
                        paddingRight: viewMode === 'grid' ? GRID_GAP : 0
                      }}
                    >
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
