'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  FileQuestion,
  HelpCircle,
  AlertTriangle,
  Minus,
  Plus,
} from 'lucide-react';
import { Product } from '@/types';
import { formatCentsToEur } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CompatibilityEnquiryModal from '@/components/products/CompatibilityEnquiryModal';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.url || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  const handleAddToCart = () => {
    const res = addItem(product, quantity);
    if (res.success) {
      setAdded(true);
      setErrorMsg(null);
      setTimeout(() => setAdded(false), 2500);
    } else {
      setErrorMsg(res.message || 'Could not add to cart');
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const conditionLabels = {
    new: { label: 'Brand New', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    used: { label: 'Tested Used', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
    refurbished: { label: 'Factory Refurbished', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' },
  };

  const cond = conditionLabels[product.condition] || conditionLabels.new;
  const priceIncVatCents = Math.round(product.priceCents * 1.21);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery Section */}
        <div>
          <div className="relative aspect-[4/3] bg-white rounded-xl border border-truckora-border overflow-hidden shadow-xs">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {/* Condition Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${cond.badgeClass} shadow-2xs uppercase tracking-wider`}
              >
                {cond.label}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img.url
                      ? 'border-brand-navy ring-2 ring-brand-orange/40'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.altText || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Fitment Guarantee Callout */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">
                Not sure if this matches your truck?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="text-brand-orange hover:text-brand-orange-hover font-bold flex items-center gap-1 transition-colors"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Verify Fitment by VIN</span>
            </button>
          </div>
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col justify-between">
          <div>
            {/* OEM & SKU Header */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300">
                OEM: {product.oemNumber}
              </span>
              <span className="text-xs font-mono text-slate-500">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="text-3xl font-black text-brand-navy">
                  {formatCentsToEur(product.priceCents)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Excl. VAT • <span className="text-slate-700 font-semibold">{formatCentsToEur(priceIncVatCents)} Inc. 21% VAT</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">
                  ✓ EU Intra-Community Reverse Charge applies for registered B2B companies
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="text-right">
                {product.stockQuantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    In Stock ({product.stockQuantity} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    Lead time ~ 3-5 days
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              {product.refurbishmentStatus && (
                <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">Inspection & Refurbishment Report: </span>
                  {product.refurbishmentStatus}
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-8 pt-6 border-t border-truckora-border">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden h-11 shrink-0">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stockQuantity}
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 h-11 px-6 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.stockQuantity > 0
                    ? 'bg-brand-orange hover:bg-brand-orange-hover text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Shopping Cart ({formatCentsToEur(product.priceCents * quantity)})</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Value Guarantees Strip */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-orange shrink-0" />
                <span>EU Pallet Freight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{product.warrantyMonths}m Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                <span>14-Day Workshop Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Modal */}
      <CompatibilityEnquiryModal
        product={product}
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </>
  );
}
