'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, Shield, AlertTriangle, Truck } from 'lucide-react';
import { Product } from '@/types';
import { formatCentsToEur } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = addItem(product, 1);
    if (res.success) {
      setAdded(true);
      setErrorMsg(null);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setErrorMsg(res.message || 'Could not add to cart');
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  const conditionBadges = {
    new: {
      label: 'Brand New',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    used: {
      label: 'Tested Used',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    refurbished: {
      label: 'Refurbished',
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
    },
  };

  const badge = conditionBadges[product.condition] || conditionBadges.new;
  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-white rounded-lg border border-truckora-border hover:border-slate-300 hover:shadow-md transition-all flex flex-col h-full overflow-hidden group">
      {/* Product Image and Condition Header */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Condition Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded border ${badge.bg} shadow-2xs uppercase tracking-wider`}
          >
            {badge.label}
          </span>
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {product.stockQuantity > 0 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              In Stock ({product.stockQuantity})
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
              Backorder
            </span>
          )}
        </div>
      </Link>

      {/* Product Info & Specifications */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* OEM & SKU Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
              OEM: {product.oemNumber}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-sm text-truckora-text hover:text-brand-orange transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Compatible Vehicles snippet */}
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
              <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                Fits:{' '}
                {product.compatibility
                  .map((c) => `${c.manufacturerName} ${c.modelName}`)
                  .slice(0, 2)
                  .join(', ')}
                {product.compatibility.length > 2 ? ' +' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-lg font-black text-brand-navy">
                {formatCentsToEur(product.priceCents)}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1">
                Excl. VAT (21%)
              </span>
            </div>

            {product.warrantyMonths > 0 && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                {product.warrantyMonths}m Warranty
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stockQuantity > 0
                ? 'bg-brand-navy hover:bg-brand-orange text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Order</span>
              </>
            ) : product.stockQuantity > 0 ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>

          {/* Quick Error notification if stock exceeded */}
          {errorMsg && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
