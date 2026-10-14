'use client';

import React from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { SearchFilters, Category, TruckManufacturer, PartCondition } from '@/types';

interface ProductFiltersProps {
  filters: SearchFilters;
  categories: Category[];
  manufacturers: TruckManufacturer[];
  onFilterChange: (newFilters: SearchFilters) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export default function ProductFilters({
  filters,
  categories,
  manufacturers,
  onFilterChange,
  onClearFilters,
  totalResults,
}: ProductFiltersProps) {
  const handleManufacturerToggle = (brandSlug: string) => {
    if (filters.brand === brandSlug) {
      onFilterChange({ ...filters, brand: undefined, page: 1 });
    } else {
      onFilterChange({ ...filters, brand: brandSlug, page: 1 });
    }
  };

  const handleCategoryToggle = (categorySlug: string) => {
    if (filters.category === categorySlug) {
      onFilterChange({ ...filters, category: undefined, page: 1 });
    } else {
      onFilterChange({ ...filters, category: categorySlug, page: 1 });
    }
  };

  const handleConditionToggle = (cond: PartCondition) => {
    if (filters.condition === cond) {
      onFilterChange({ ...filters, condition: undefined, page: 1 });
    } else {
      onFilterChange({ ...filters, condition: cond, page: 1 });
    }
  };

  const hasActiveFilters = Boolean(
    filters.query ||
      filters.oemNumber ||
      filters.category ||
      filters.brand ||
      filters.condition ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.inStockOnly
  );

  return (
    <aside className="bg-white rounded-lg border border-truckora-border p-4 space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
          <Filter className="w-4 h-4 text-brand-orange" />
          <span>Filters</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
            {totalResults} parts
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] text-slate-500 hover:text-brand-orange flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* OEM Number Exact Search Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          OEM / Part Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.oemNumber || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                oemNumber: e.target.value ? e.target.value : undefined,
                page: 1,
              })
            }
            placeholder="e.g. 1853604, 21543897..."
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-brand-navy font-mono"
          />
          {filters.oemNumber && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, oemNumber: undefined, page: 1 })}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Truck Brand / Manufacturer Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Truck Manufacturer
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {manufacturers.map((m) => {
            const isSelected = filters.brand === m.slug;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleManufacturerToggle(m.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isSelected
                    ? 'bg-brand-navy text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{m.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-orange" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Part Category
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {categories.map((c) => {
            const isSelected = filters.category === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategoryToggle(c.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isSelected
                    ? 'bg-brand-navy text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate text-left">{c.name}</span>
                <span
                  className={`text-[10px] ml-1 shrink-0 ${
                    isSelected ? 'text-slate-200' : 'text-slate-400'
                  }`}
                >
                  {c.productCount || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition (New / Used / Refurbished) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Part Condition
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['new', 'used', 'refurbished'] as PartCondition[]).map((cond) => {
            const isSelected = filters.condition === cond;
            const labels = {
              new: 'New',
              used: 'Used',
              refurbished: 'Refurb',
            };

            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleConditionToggle(cond)}
                className={`py-1.5 px-2 rounded text-xs font-semibold border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {labels[cond]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                inStockOnly: e.target.checked ? true : undefined,
                page: 1,
              })
            }
            className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
          />
          <span>In Stock & Ready for Dispatch</span>
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range (€)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min €"
            value={filters.minPrice !== undefined ? filters.minPrice : ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max €"
            value={filters.maxPrice !== undefined ? filters.maxPrice : ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
          />
        </div>
      </div>
    </aside>
  );
}
