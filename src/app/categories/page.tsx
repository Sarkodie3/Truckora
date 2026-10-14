import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCategories } from '@/lib/services/products';
import {
  Cog,
  Activity,
  Disc,
  RotateCw,
  Truck,
  Anchor,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Circle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Spare Part Categories',
  description:
    'Browse all 13 core European commercial truck spare part categories: engines, gearboxes, brakes, clutch, chassis, electrical, cooling, and exhaust systems.',
};

const categoryIcons: Record<string, React.ReactNode> = {
  Cog: <Cog className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
  RotateCw: <RotateCw className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Anchor: <Anchor className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Thermometer: <Thermometer className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Gauge: <Gauge className="w-6 h-6" />,
  Circle: <Circle className="w-6 h-6" />,
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mb-10">
        <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
          Complete Inventory Taxonomy
        </div>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight">
          Commercial Truck Parts Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          TRUCKORA supplies all mechanical, pneumatic, and electronic sub-assemblies for heavy European commercial transport vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="bg-white rounded-xl border border-truckora-border p-6 hover:border-brand-navy hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors mb-4">
                {categoryIcons[cat.iconName || 'Cog'] || <Cog className="w-6 h-6" />}
              </div>

              <h2 className="font-bold text-base text-slate-800 group-hover:text-brand-navy transition-colors mb-2">
                {cat.name}
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">
                {cat.productCount} parts available
              </span>
              <span className="font-bold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
