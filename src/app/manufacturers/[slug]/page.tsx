import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getManufacturerBySlug, getTruckModels, getProducts } from '@/lib/services/products';
import ProductCard from '@/components/products/ProductCard';
import { ChevronRight, Truck, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getManufacturerBySlug(slug);
  if (!brand) return { title: 'Manufacturer Not Found' };

  return {
    title: `${brand.name} Truck Spare Parts`,
    description: `Shop replacement parts for ${brand.name} commercial tractors and trucks. Genuine OEM, remanufactured, and tested used spares.`,
  };
}

export default async function ManufacturerDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getManufacturerBySlug(slug);

  if (!brand) {
    notFound();
  }

  const [models, { products, total }] = await Promise.all([
    getTruckModels(brand.id),
    getProducts({ brand: brand.slug, pageSize: 24 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-navy">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/manufacturers" className="hover:text-brand-navy">
          Truck Makes
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{brand.name}</span>
      </nav>

      {/* Brand Hero Banner */}
      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              Commercial Vehicle Parts
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              {brand.name} Truck Spares
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Precision tested components for {brand.name} heavy commercial vehicles. Manufactured in {brand.country}.
            </p>

            {/* Model Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Supported Series:</span>
              {models.map((m) => (
                <span
                  key={m.id}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded text-xs font-semibold border border-slate-200 transition-colors"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{total} Verified Parts In Stock</span>
            </span>
            <Link
              href={`/products?brand=${brand.slug}`}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Open Full Filter Tool →
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-truckora-border p-12 text-center text-xs text-slate-500">
          No published parts found for {brand.name} at this moment.
        </div>
      )}
    </div>
  );
}
