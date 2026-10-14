import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12 bg-white border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Stock</span>
            </div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Featured Truck Spare Parts
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Top moving components, bench-tested turbochargers, and driveline assemblies in stock today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/condition/new"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Brand New
            </Link>
            <Link
              href="/condition/used"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Tested Used
            </Link>
            <Link
              href="/products"
              className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
