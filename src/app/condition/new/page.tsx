import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/services/products';
import ProductCard from '@/components/products/ProductCard';
import { Sparkles, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brand New Commercial Truck Parts',
  description:
    'Purchase brand new OEM commercial truck parts with factory warranty. Direct dispatch across Europe.',
};

export default async function NewPartsPage() {
  const { products, total } = await getProducts({ condition: 'new', pageSize: 24 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-navy">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Brand New Parts</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Factory Fresh Condition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Brand New Truck Spare Parts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Unused OEM and tier-1 replacement parts in original packaging. Supplied with full manufacturer warranty coverage (12 to 24 months) and electronic invoice for intra-community reverse charge VAT.
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
            {total} New Parts Available
          </span>
          <Link
            href="/products?condition=new"
            className="text-brand-orange hover:underline font-bold"
          >
            Refine in Advanced Filter Tool →
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
