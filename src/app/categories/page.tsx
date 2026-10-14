import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            className="bg-white rounded-xl border border-truckora-border overflow-hidden hover:border-brand-navy hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                    <Truck className="w-10 h-10 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy/80 backdrop-blur-xs text-white flex items-center justify-center">
                    {categoryIcons[cat.iconName || 'Cog'] || <Cog className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white">
                    {cat.productCount} parts available
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="font-bold text-lg text-slate-800 group-hover:text-brand-navy transition-colors mb-2">
                  {cat.name}
                </h2>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">
                Explore assembly
              </span>
              <span className="font-bold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
