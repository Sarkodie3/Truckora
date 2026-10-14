import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/data/mock-data';

const categoryIcons: Record<string, React.ReactNode> = {
  Cog: <Cog className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Disc: <Disc className="w-4 h-4" />,
  RotateCw: <RotateCw className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Anchor: <Anchor className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Thermometer: <Thermometer className="w-4 h-4" />,
  Droplets: <Droplets className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
};

export default function BrowseByCategory() {
  return (
    <section className="py-12 bg-truckora-bg border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              Part Assemblies & Components
            </div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Shop by Category
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Authentic commercial assemblies covering driveline, air systems, cab components, and Euro 6 emissions.
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

        {/* 13 Main Categories Grid with Reference Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="bg-white rounded-xl border border-truckora-border overflow-hidden hover:border-brand-navy hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-28 sm:h-36 w-full bg-slate-100 overflow-hidden">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                    <Truck className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                  <span className="p-1.5 rounded-md bg-brand-navy/80 backdrop-blur-xs text-white">
                    {categoryIcons[cat.iconName || 'Cog'] || <Cog className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white">
                    {cat.productCount} parts
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-navy transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-brand-orange group-hover:text-brand-navy transition-colors">
                  <span>View Catalogue</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
