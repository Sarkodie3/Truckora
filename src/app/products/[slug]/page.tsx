import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Building,
  Calendar,
  AlertCircle,
  ChevronRight,
  Package,
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/products';
import { formatCentsToEur } from '@/lib/utils';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/products/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Part Not Found' };
  }

  return {
    title: `${product.name} (OEM: ${product.oemNumber})`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | TRUCKORA`,
      description: product.description.slice(0, 160),
      images: [{ url: product.images[0]?.url || '' }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);

  // Structured Data (JSON-LD Product)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.sku,
    mpn: product.oemNumber,
    brand: {
      '@type': 'Brand',
      name: product.compatibility[0]?.manufacturerName || 'Truck Parts OEM',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition:
        product.condition === 'new'
          ? 'https://schema.org/NewCondition'
          : product.condition === 'refurbished'
          ? 'https://schema.org/RefurbishedCondition'
          : 'https://schema.org/UsedCondition',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-navy">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-brand-navy">
          Parts Catalogue
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {product.categoryName && (
          <>
            <Link
              href={`/categories/${product.categoryId}`}
              className="hover:text-brand-navy"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout with Client Interactions */}
      <ProductDetailClient product={product} />

      {/* Verified Vehicle Fitment Compatibility Table */}
      <div className="mt-12 bg-white rounded-xl border border-truckora-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-orange" />
              <span>Verified Vehicle Compatibility</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact chassis models verified with original manufacturer parts catalogue.
            </p>
          </div>

          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Guaranteed Fitment Support</span>
          </span>
        </div>

        {product.compatibility && product.compatibility.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Make</th>
                  <th className="py-2.5 px-3">Model / Series</th>
                  <th className="py-2.5 px-3">Engine Code</th>
                  <th className="py-2.5 px-3">Production Years</th>
                  <th className="py-2.5 px-3">Fitment Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {product.compatibility.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-brand-navy">{c.manufacturerName}</td>
                    <td className="py-3 px-3 font-semibold">{c.modelName}</td>
                    <td className="py-3 px-3 font-mono">{c.engineCode || 'All Engine Codes'}</td>
                    <td className="py-3 px-3">
                      {c.yearFrom ? `${c.yearFrom} - ${c.yearTo || 'Present'}` : 'All Production Years'}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{c.notes || 'Direct plug & play installation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Universal commercial component or specific fitment requires chassis VIN verification.
          </p>
        )}
      </div>

      {/* Technical Specifications Table */}
      <div className="mt-8 bg-white rounded-xl border border-truckora-border p-6 shadow-xs">
        <h3 className="text-lg font-bold text-brand-navy mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">SKU Reference:</span>
            <span className="font-mono font-bold text-slate-800">{product.sku}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Original OEM Number:</span>
            <span className="font-mono font-bold text-slate-800">{product.oemNumber}</span>
          </div>
          {product.alternativeOemNumbers && product.alternativeOemNumbers.length > 0 && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Alternative Part Numbers:</span>
              <span className="font-mono text-slate-700">
                {product.alternativeOemNumbers.join(', ')}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Condition & Grade:</span>
            <span className="font-bold capitalize text-slate-800">
              {product.condition} {product.refurbishmentStatus ? `(${product.refurbishmentStatus})` : ''}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Net Weight:</span>
            <span className="text-slate-800">{product.weightKg ? `${product.weightKg} kg` : 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Freight Shipping Class:</span>
            <span className="text-slate-800 capitalize">
              {product.shippingClass.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Warranty Duration:</span>
            <span className="text-slate-800 font-bold">{product.warrantyMonths} Months</span>
          </div>
          {Object.entries(product.technicalSpecifications || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{key}:</span>
              <span className="font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier & Origin Information */}
      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <div className="font-bold text-slate-800">
              Supplied by: {product.supplierName || 'TRUCKORA European Certified Distribution Hub'}
            </div>
            <div className="text-slate-500">
              Warehouse location: Rotterdam, Netherlands • ISO 9001 Tested Facilities
            </div>
          </div>
        </div>

        <Link
          href="/shipping"
          className="text-brand-orange hover:underline font-bold text-xs shrink-0"
        >
          View European Freight Timeline →
        </Link>
      </div>

      {/* Related Products from Database */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-brand-navy">
              Related Spare Parts in this Category
            </h3>
            <Link
              href={`/categories/${product.categoryId}`}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              View More in Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
