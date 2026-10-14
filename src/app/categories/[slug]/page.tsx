import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryBySlug, getProducts } from '@/lib/services/products';
import ProductCard from '@/components/products/ProductCard';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Spare Parts`,
    description: `Explore genuine OEM, refurbished, and tested used ${category.name.toLowerCase()} for commercial trucks with European express delivery.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({ category: category.slug, pageSize: 24 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-navy">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/categories" className="hover:text-brand-navy">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner with Authentic Reference Image */}
      <div className="bg-white rounded-xl border border-truckora-border overflow-hidden mb-8 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 sm:p-8 max-w-2xl flex-1 flex flex-col justify-center">
          <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
            Category Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {total} verified parts in stock
            </span>
            <Link
              href={`/products?category=${category.slug}`}
              className="text-brand-orange hover:underline font-bold"
            >
              Open in Advanced Filter View →
            </Link>
          </div>
        </div>

        {category.imageUrl && (
          <div className="relative w-full md:w-80 h-48 md:h-auto min-h-[180px] bg-slate-100 shrink-0">
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              priority
            />
          </div>
        )}
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
          No active products currently published in this category.
        </div>
      )}
    </div>
  );
}
