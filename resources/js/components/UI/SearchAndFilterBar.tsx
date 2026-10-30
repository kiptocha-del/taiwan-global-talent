import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface SearchAndFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: FilterOption[];
    searchPlaceholder?: string;
    filterPlaceholder?: string;
}

export default function SearchAndFilterBar({
    search,
    onSearchChange,
    filterValue,
    onFilterChange,
    filterOptions = [],
    searchPlaceholder = 'Search...',
    filterPlaceholder = 'All Status',
}: SearchAndFilterBarProps) {
    return (
        <div className="mb-6 flex w-full flex-col items-center gap-3 sm:flex-row">
            {/* Search Input */}
            <div className="relative w-full flex-1">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-control border border-border bg-surface py-2.5 pr-10 pl-10 text-sm text-ink transition-all placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        aria-label="Clear search"
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Filter */}
            {onFilterChange && filterOptions.length > 0 && (
                <div className="relative w-full sm:w-48">
                    <Filter className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterValue || ''}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-control border border-border bg-surface py-2.5 pr-8 pl-10 text-sm text-ink transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                    >
                        <option value="">{filterPlaceholder}</option>
                        {filterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
