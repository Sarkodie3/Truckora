import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/services/products';
import ProductCard from '@/components/products/ProductCard';
import { Layers, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tested Used & Refurbished Truck Parts',
  description:
    'Tested used and factory-refurbished commercial truck spares. Bench-tested gearboxes, engines, and retarders with verified mileage and warranty.',
};

export default async function UsedPartsPage() {
  const [usedRes, refurbRes] = await Promise.all([
    getProducts({ condition: 'used', pageSize: 12 }),
    getProducts({ condition: 'refurbished', pageSize: 12 }),
  ]);

  const allItems = [...refurbRes.products, ...usedRes.products];
  const total = usedRes.total + refurbRes.total;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-navy">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Tested Used & Refurbished Spares</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Workshop Inspected & Dyno-Tested</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Tested Used & Factory Reconditioned Spares
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          High-value components reclaimed from verified low-mileage European fleet tractors. Every unit undergoes strict electronic diagnostics, oil analysis, and dynamometer load testing prior to warehouse cataloguing.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
            {total} Tested Units Available
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>6 - 24 Months Warranty Coverage</span>
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
