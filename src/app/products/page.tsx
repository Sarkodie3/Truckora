'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { getProducts, getCategories, getTruckManufacturers } from '@/lib/services/products';
import { Product, Category, TruckManufacturer, SearchFilters, PartCondition } from '@/types';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<TruckManufacturer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const currentFilters: SearchFilters = {
    query: searchParams.get('q') || undefined,
    oemNumber: searchParams.get('oem') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    condition: (searchParams.get('condition') as PartCondition) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as any) || 'relevance',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 12,
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, brands, prodRes] = await Promise.all([
          getCategories(),
          getTruckManufacturers(),
          getProducts(currentFilters),
        ]);

        setCategories(cats);
        setManufacturers(brands);
        setProducts(prodRes.products);
        setTotal(prodRes.total);
        setTotalPages(prodRes.totalPages);
      } catch (err) {
        console.error('Failed to load catalogue', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const updateFilters = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.oemNumber) params.set('oem', newFilters.oemNumber);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.condition) params.set('condition', newFilters.condition);
    if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.inStockOnly) params.set('inStock', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'relevance') params.set('sort', newFilters.sortBy);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-truckora-border gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Commercial Truck Spare Parts Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {products.length} of {total} verified parts in stock.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-orange" />
            <span>Filters ({total})</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={currentFilters.sortBy || 'relevance'}
              onChange={(e) =>
                updateFilters({ ...currentFilters, sortBy: e.target.value as any, page: 1 })
              }
              aria-label="Sort products by"
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-navy cursor-pointer"
            >
              <option value="relevance">Featured & Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilters
            filters={currentFilters}
            categories={categories}
            manufacturers={manufacturers}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
            totalResults={total}
          />
        </div>

        {/* Mobile Filter Overlay */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex justify-end">
            <div className="bg-white w-full max-w-xs h-full rounded-l-xl p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm">Refine Search</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs font-bold text-brand-orange"
                >
                  Done
                </button>
              </div>
              <ProductFilters
                filters={currentFilters}
                categories={categories}
                manufacturers={manufacturers}
                onFilterChange={(f) => {
                  updateFilters(f);
                }}
                onClearFilters={clearFilters}
                totalResults={total}
              />
            </div>
          </div>
        )}

        {/* Products Grid & Results Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-80 animate-pulse flex flex-col justify-between">
                  <div className="bg-slate-200 h-40 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="bg-slate-200 h-4 rounded w-3/4" />
                    <div className="bg-slate-200 h-3 rounded w-1/2" />
                  </div>
                  <div className="bg-slate-200 h-8 rounded mt-4" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentFilters.page === 1}
                    onClick={() =>
                      updateFilters({
                        ...currentFilters,
                        page: Math.max(1, (currentFilters.page || 1) - 1),
                      })
                    }
                    className="p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-slate-700 px-4 py-2 border border-slate-200 rounded-lg bg-white">
                    Page {currentFilters.page || 1} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentFilters.page === totalPages}
                    onClick={() =>
                      updateFilters({
                        ...currentFilters,
                        page: Math.min(totalPages, (currentFilters.page || 1) + 1),
                      })
                    }
                    className="p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-truckora-border p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching spare parts found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We could not find parts matching your active filter criteria. Try clearing OEM constraints, widening the price range, or submitting a vehicle fitment enquiry.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-brand-navy hover:bg-brand-navy-light text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
