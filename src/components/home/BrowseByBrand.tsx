import React from 'react';
import Link from 'next/link';
import { ChevronRight, Truck } from 'lucide-react';
import { TRUCK_MANUFACTURERS } from '@/lib/data/mock-data';

export default function BrowseByBrand() {
  return (
    <section className="py-12 bg-white border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              Vehicle Manufacturers
            </div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Browse Parts by Truck Make
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Select your vehicle make to explore tailored parts, engine assemblies, and cabin bodywork.
            </p>
          </div>

          <Link
            href="/manufacturers"
            className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1 transition-colors group"
          >
            <span>All Manufacturers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 7 Core European Truck Makes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {TRUCK_MANUFACTURERS.map((brand) => (
            <Link
              key={brand.id}
              href={`/manufacturers/${brand.slug}`}
              className="bg-slate-50 hover:bg-white rounded-lg border border-slate-200 hover:border-brand-navy hover:shadow-md p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-navy/5 group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors text-brand-navy">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-brand-navy transition-colors block">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {brand.country}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
