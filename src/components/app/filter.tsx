import { useState } from 'react';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, ChevronsUpDown, Funnel, LayoutGrid, List, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { type SortOrder } from '@/hooks/useFilter';
import type { FilterType } from '@/types/ova';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const filterPanelVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    height: 0,
    transition: { when: 'afterChildren' }
  },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      bounce: 0.3,
      duration: 0.4
    }
  }
};

const filterCategoryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

interface Props {
  children?: React.ReactNode;
  filters: FilterType[];
  onFilter: (filters: string[]) => void;
  defaultFilters?: string[];
  sortOrder: SortOrder;
  onSort: (order: SortOrder) => void;
  viewMode: 'grid' | 'list';
  onViewMode: (mode: 'grid' | 'list') => void;
}

export const Filter: React.FC<Props> = ({
  children,
  filters,
  onFilter,
  defaultFilters,
  sortOrder,
  onSort,
  viewMode,
  onViewMode
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(defaultFilters ?? []);
  const [appliedFilters, setAppliedFilters] = useState<string[]>(defaultFilters ?? []);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
    onFilter([]);
  };

  const applyFilters = () => {
    setAppliedFilters(selectedFilters);
    onFilter(selectedFilters);
  };

  const removeChip = (filter: string) => {
    const next = appliedFilters.filter((f) => f !== filter);
    setAppliedFilters(next);
    setSelectedFilters(next);
    onFilter(next);
  };

  return (
    <div className="flex min-h-0 flex-col gap-2.5">
      <div className="flex items-center flex-wrap justify-start gap-6 w-full">
        <Button
          variant="neutral"
          className="relative w-fit"
          aria-pressed={showFilter}
          aria-label="Toggle filter panel"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <Funnel className="h-4 w-4" />
          <span className="hidden md:inline-block">Filter</span>
          {appliedFilters.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-main text-[10px] font-bold text-mtext border border-border">
              {appliedFilters.length}
            </span>
          )}
          <motion.span animate={{ rotate: showFilter ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown />
          </motion.span>
        </Button>

        {children}

        <Button
          variant="neutral"
          size="icon"
          onClick={() => onViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          aria-label="Toggle view mode"
        >
          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </Button>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {appliedFilters.map((filter) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="default" className="flex items-center gap-1 uppercase">
                  {filter}
                  <button
                    onClick={() => removeChip(filter)}
                    className="ml-0.5 hover:opacity-70"
                    aria-label={`Remove filter ${filter}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showFilter && (
          <motion.div
            variants={filterPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
            className="container-border flex min-h-0 flex-col overflow-hidden"
          >
            <div className="flex shrink-0 items-center justify-between px-10 pt-6 pb-2">
              <h2 className="text-xl font-bold">Filter OVAs</h2>
              {selectedFilters.length > 0 && (
                <Button size="sm" className="flex items-center gap-1" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="scrollbar-subtle min-h-0 flex-1 space-y-4 overflow-y-auto px-10 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filters.map((category, index) => (
                  <motion.div
                    key={category.name}
                    variants={filterCategoryVariants}
                    custom={index}
                    className="space-y-3"
                  >
                    <h3 className="font-bold">{category.name}</h3>
                    <ul className="space-y-2.5 list-none pl-2.5">
                      {category.options.map((option, optionIndex) => (
                        <motion.li
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * optionIndex + 0.2 }}
                        >
                          <label className="space-y-1 text-sm flex items-center gap-2">
                            <Checkbox
                              id={option}
                              checked={selectedFilters.includes(option)}
                              onCheckedChange={() => toggleFilter(option)}
                            />
                            <span className="capitalize">{option}</span>
                          </label>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pb-2">
                <h3 className="font-bold">Sort</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={sortOrder === 'none' ? 'default' : 'neutral'}
                    onClick={() => onSort('none')}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                    Default
                  </Button>
                  <Button size="sm" variant={sortOrder === 'asc' ? 'default' : 'neutral'} onClick={() => onSort('asc')}>
                    <ArrowUpAZ className="h-4 w-4" />
                    A→Z
                  </Button>
                  <Button
                    size="sm"
                    variant={sortOrder === 'desc' ? 'default' : 'neutral'}
                    onClick={() => onSort('desc')}
                  >
                    <ArrowDownAZ className="h-4 w-4" />
                    Z→A
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-4 border-t-2 border-border px-10 py-4">
              <Button variant="neutral" onClick={() => setShowFilter(false)}>
                Close
              </Button>
              <Button onClick={applyFilters} disabled={selectedFilters.length === 0}>
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
