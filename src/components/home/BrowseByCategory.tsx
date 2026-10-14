import React from 'react';
import Link from 'next/link';
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
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/data/mock-data';

const categoryIcons: Record<string, React.ReactNode> = {
  Cog: <Cog className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Disc: <Disc className="w-5 h-5" />,
  RotateCw: <RotateCw className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Anchor: <Anchor className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Thermometer: <Thermometer className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Gauge: <Gauge className="w-5 h-5" />,
  Circle: <Circle className="w-5 h-5" />,
};

export default function BrowseByCategory() {
  return (
    <section className="py-12 bg-truckora-bg border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              Part Assemblies
            </div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Shop by Category
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Comprehensive inventory covering driveline, air systems, cab components, and Euro 6 emissions.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1 transition-colors group"
          >
            <span>Explore All 13 Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 13 Main Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="bg-white rounded-lg border border-truckora-border p-4 hover:border-brand-navy hover:shadow-md transition-all group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-navy/5 text-brand-navy group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                {categoryIcons[cat.iconName || 'Cog'] || <Cog className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-brand-navy transition-colors block truncate">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {cat.productCount} parts available
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
