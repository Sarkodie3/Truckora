'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCentsToEur } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotalCents,
    shippingCents,
    taxCents,
    discountCents,
    totalCents,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-6 border-b border-truckora-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-brand-orange" />
            <span>Shopping Cart ({itemCount} {itemCount === 1 ? 'part' : 'parts'})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review items, apply commercial discount codes, and verify shipping destination before checkout.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-rose-600 transition-colors font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const itemTotalCents = product.priceCents * quantity;
              const primaryImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-truckora-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          OEM: {product.oemNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {product.condition}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-orange transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Unit Price: {formatCentsToEur(product.priceCents)} Excl. VAT
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity modifier */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden h-9">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stockQuantity}
                        aria-label="Increase quantity"
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                      <div className="text-sm font-black text-brand-navy">
                        {formatCentsToEur(itemTotalCents)}
                      </div>
                      <div className="text-[10px] text-slate-400">Excl. VAT</div>
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove item from cart"
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Guarantees Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-orange" />
                <span>Heavy Pallet & Courier Freight across Europe</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified OEM Fitment & 12-24m Warranty</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Parts Subtotal (Excl. VAT):</span>
                  <span className="font-semibold text-slate-800">
                    {formatCentsToEur(subtotalCents)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>European Shipping & Freight:</span>
                  <span className="font-semibold text-slate-800">
                    {shippingCents > 0 ? formatCentsToEur(shippingCents) : 'Calculated at checkout'}
                  </span>
                </div>

                {discountCents > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>-{formatCentsToEur(discountCents)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Standard VAT (21%):</span>
                  <span className="font-semibold text-slate-800">
                    {formatCentsToEur(taxCents)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-brand-navy">Total (EUR):</span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                      Includes calculated VAT
                    </span>
                  </div>
                  <span className="text-2xl font-black text-brand-navy">
                    {formatCentsToEur(totalCents)}
                  </span>
                </div>
              </div>

              {/* EU Reverse Charge Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900 leading-snug">
                <span className="font-bold">EU B2B Reverse Charge: </span>
                Enter your company VAT number at checkout to automatically zero-rate VAT (0%) for intra-community transport.
              </div>

              {/* Checkout Action */}
              <Link
                href="/checkout"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-4 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center">
                <Link
                  href="/products"
                  className="text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors"
                >
                  ← Continue Shopping Parts
                </Link>
              </div>
            </div>

            {/* Coupon Code Card */}
            <div className="bg-white rounded-xl border border-truckora-border p-5 shadow-xs">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-orange" />
                <span>Commercial Discount Code</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TRUCKORA10, FLEET50"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono uppercase focus:outline-none focus:border-brand-navy"
                    />
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponFeedback && (
                    <div
                      className={`text-xs flex items-center gap-1 font-medium ${
                        couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {couponFeedback.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{couponFeedback.message}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400">
                    Tip: Try <span className="font-mono font-bold text-slate-600">TRUCKORA10</span> (10% off over €500) or <span className="font-mono font-bold text-slate-600">FLEET50</span> (€50 off over €1,000).
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-truckora-border p-16 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8 text-brand-orange" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Your cart is currently empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Looking for commercial truck components, engines, or brake calipers? Explore our verified European catalogue.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="bg-brand-navy hover:bg-brand-orange text-white font-bold px-6 py-2.5 rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Explore Parts Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
