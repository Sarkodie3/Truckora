'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, Truck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { TRUCK_MANUFACTURERS, CATEGORIES } from '@/lib/data/mock-data';

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCondition) params.set('condition', selectedCondition);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-brand-navy text-white overflow-hidden py-12 md:py-20 border-b border-brand-navy-dark">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F28C28_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-navy-light/80 border border-slate-600/50 px-3 py-1 rounded-full text-xs font-semibold text-slate-200 mb-4 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span>European Commercial Vehicle Spares Distribution Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Truck Parts. <span className="text-brand-orange">Trusted Supply.</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Precision European commercial truck components for fleet operators, logistics companies, and maintenance workshops. Genuine OEM, certified factory-refurbished, and dynamometer-tested used spares.
          </p>
        </div>

        {/* Advanced Parts Search Card */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border border-truckora-border p-4 sm:p-6 text-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-brand-navy text-sm uppercase tracking-wider">
              <Search className="w-4 h-4 text-brand-orange" />
              <span>Direct Commercial Parts Finder</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                OEM Search
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live Stock
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Fast Pallet Freight
              </span>
            </div>
          </div>

          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Query / OEM Number */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Part Name, OEM or SKU
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Turbocharger, 1853604, Wabco..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            {/* Truck Brand */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Truck Make
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                aria-label="Filter by truck brand"
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy bg-white text-slate-700"
              >
                <option value="">All Truck Makes</option>
                {TRUCK_MANUFACTURERS.map((brand) => (
                  <option key={brand.id} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by part category"
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy bg-white text-slate-700"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm h-[34px]"
              >
                <Search className="w-4 h-4" />
                <span>Search Catalogue</span>
              </button>
            </div>
          </form>

          {/* Quick OEM Brands Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Direct Make Search:</span>
            <div className="flex flex-wrap items-center gap-2">
              {TRUCK_MANUFACTURERS.map((m) => (
                <Link
                  key={m.id}
                  href={`/manufacturers/${m.slug}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold transition-colors"
                >
                  {m.name}
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              className="text-brand-navy hover:text-brand-orange font-bold text-[11px] flex items-center gap-0.5"
            >
              <span>View All 50,000+ Parts</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 4 Core B2B Value Pillars */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy-light flex items-center justify-center text-brand-orange shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Express Freight</div>
              <div className="text-slate-400 text-[11px]">Pallets & parcels across EU</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy-light flex items-center justify-center text-brand-orange shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Verified OEM Fitment</div>
              <div className="text-slate-400 text-[11px]">EPC chassis & VIN matching</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy-light flex items-center justify-center text-brand-orange shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">12-24m Warranty</div>
              <div className="text-slate-400 text-[11px]">Factory reconditioned parts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy-light flex items-center justify-center text-brand-orange shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">EU VAT Zero-Rating</div>
              <div className="text-slate-400 text-[11px]">Intra-community B2B invoicing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
