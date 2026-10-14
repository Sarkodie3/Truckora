'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { getProducts, getCategories, getTruckManufacturers } from '@/lib/services/products';
import { Product, Category, TruckManufacturer, SearchFilters, PartCondition } from '@/types';
import { Search, ChevronLeft, ChevronRight, PackageOpen, HelpCircle } from 'lucide-react';
import CompatibilityEnquiryModal from '@/components/products/CompatibilityEnquiryModal';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<TruckManufacturer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  const query = searchParams.get('q') || '';
  const oemNumber = searchParams.get('oem') || '';

  const currentFilters: SearchFilters = {
    query: query || undefined,
    oemNumber: oemNumber || undefined,
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
    async function executeSearch() {
      setLoading(true);
      try {
        const [cats, brands, res] = await Promise.all([
          getCategories(),
          getTruckManufacturers(),
          getProducts(currentFilters),
        ]);
        setCategories(cats);
        setManufacturers(brands);
        setProducts(res.products);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
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

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Result Header */}
      <div className="pb-6 border-b border-truckora-border">
        <h1 className="text-2xl font-black text-brand-navy flex items-center gap-2">
          <Search className="w-6 h-6 text-brand-orange" />
          <span>
            Search Results {oemNumber ? `for OEM "${oemNumber}"` : query ? `for "${query}"` : ''}
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found <span className="font-bold text-slate-700">{total}</span> matching commercial truck parts in stock.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={currentFilters}
            categories={categories}
            manufacturers={manufacturers}
            onFilterChange={updateFilters}
            onClearFilters={() => router.push('/search')}
            totalResults={total}
          />
        </div>

        {/* Search Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

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
                    className="p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-lg">
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
                    className="p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-truckora-border p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageOpen className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No parts found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                OEM parts often carry alternate supersession numbers. You can request direct verification from our technical workshop specialists.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Request Chassis Fitment Check</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CompatibilityEnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Searching TRUCKORA catalogue...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
