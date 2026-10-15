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
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-8 pl-10 text-sm text-gray-700 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
