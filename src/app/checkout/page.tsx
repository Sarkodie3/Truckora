'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Building,
  Truck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCentsToEur } from '@/lib/utils';
import { createOrder } from '@/lib/services/orders';
import { Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotalCents,
    shippingCents,
    discountCents,
    appliedCoupon,
    clearCart,
  } = useCart();

  // Contact Information
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Address
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('NL');

  // Billing Address
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingFullName, setBillingFullName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingPostal, setBillingPostal] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCountry, setBillingCountry] = useState('NL');

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'test_card' | 'sepa_invoice'>('test_card');
  const [customerNotes, setCustomerNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic EU Intra-Community Reverse Charge Calculation:
  // If company has VAT number and is shipping outside NL to another EU state -> 0% VAT
  const isReverseCharge = Boolean(vatNumber.trim() && countryCode !== 'NL');
  const applicableVatPercent = isReverseCharge ? 0 : 21.0;
  const taxableAmount = Math.max(0, subtotalCents - discountCents);
  const taxCents = isReverseCharge ? 0 : Math.round((taxableAmount * applicableVatPercent) / 100);
  const calculatedShipping = deliveryMethod === 'express' ? shippingCents + 4500 : shippingCents;
  const grandTotalCents = Math.max(0, taxableAmount + calculatedShipping + taxCents);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy">Your cart is empty</h1>
        <p className="text-xs text-slate-500">
          Please add truck parts to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="bg-brand-navy text-white px-5 py-2.5 rounded-lg text-xs font-bold inline-block"
        >
          Browse Parts Catalogue
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !fullName || !streetAddress || !postalCode || !city || !phone) {
      setErrorMsg('Please fill in all mandatory customer contact and shipping fields.');
      return;
    }

    const shippingAddress: Address = {
      fullName,
      companyName: companyName || undefined,
      vatNumber: vatNumber || undefined,
      phone,
      streetAddress,
      postalCode,
      city,
      countryCode,
      type: 'shipping',
    };

    const billingAddress: Address = sameAsBilling
      ? { ...shippingAddress, type: 'billing' }
      : {
          fullName: billingFullName || fullName,
          streetAddress: billingStreet || streetAddress,
          postalCode: billingPostal || postalCode,
          city: billingCity || city,
          countryCode: billingCountry || countryCode,
          phone,
          type: 'billing',
        };

    setSubmitting(true);
    try {
      const orderPayload = {
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        shippingAddress,
        billingAddress,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.code,
        customerNotes: customerNotes ? customerNotes.trim() : undefined,
        paymentMethod,
      };

      const res = await createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        router.push(`/order-confirmation/${res.order.id}`);
      } else {
        setErrorMsg(res.error || 'Failed to place order. Please review stock availability.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred processing your checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 mb-8 border-b border-truckora-border">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
          <Lock className="w-6 h-6 text-emerald-600" />
          <span>B2B Commercial Checkout</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          European road freight dispatch with automated EU VAT reverse charge verification.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Customer Contact Details */}
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Customer & Fleet Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="purchasing@fleet-logistics.eu"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Order confirmation and PDF invoices will be dispatched here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone / Driver Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 10 555 4900"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    For freight carrier delivery notification.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping & European B2B Company Details */}
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Shipping Address & B2B Tax Verification</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Hans Becker"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Workshop Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Rhine Spedition GmbH"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                </div>
              </div>

              {/* European VAT Number input */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    European Company VAT ID (for 0% Reverse-Charge)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. DE812345678, SE556123456701</span>
                </div>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value.toUpperCase())}
                  placeholder="Enter EU VAT ID (Optional for private customers)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded uppercase font-mono focus:outline-none focus:border-brand-navy bg-white"
                />
                {isReverseCharge ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      EU Intra-Community Reverse Charge Activated: VAT zero-rated (0.00%) on invoice.
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    For European transport businesses outside the Netherlands, valid VAT IDs are verified against the VIES registry for reverse-charge invoicing.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address & Unit / Bay *
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Industriestraße 88, Gate 3"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 50667"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Köln"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Country *
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Destination Country"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy bg-white"
                  >
                    <option value="NL">Netherlands (NL)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="BE">Belgium (BE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="SE">Sweden (SE)</option>
                    <option value="DK">Denmark (DK)</option>
                    <option value="PL">Poland (PL)</option>
                    <option value="AT">Austria (AT)</option>
                    <option value="IT">Italy (IT)</option>
                    <option value="ES">Spain (ES)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workshop / Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Forklift on site / Call 1 hour prior to arrival"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-brand-navy"
                />
              </div>
            </div>

            {/* Step 3: European Commercial Payment */}
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment & Invoicing Method</span>
              </h2>

              <div className="space-y-3">
                {/* Test Mode Card */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'test_card'
                      ? 'border-brand-navy bg-slate-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="test_card"
                    checked={paymentMethod === 'test_card'}
                    onChange={() => setPaymentMethod('test_card')}
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-navy">
                        Instant Commercial Payment (Sandbox Test Mode)
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        Test Mode Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Instant order clearance simulation. Live payment gateway credentials are not configured in demo environment; order will persist and clear immediately into the fulfilment queue.
                    </p>
                  </div>
                </label>

                {/* SEPA Wire / Pro-forma invoice */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'sepa_invoice'
                      ? 'border-brand-navy bg-slate-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="sepa_invoice"
                    checked={paymentMethod === 'sepa_invoice'}
                    onChange={() => setPaymentMethod('sepa_invoice')}
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-navy">
                        B2B Bank Wire Transfer (SEPA Pro-Forma Invoice)
                      </span>
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Receive an official pro-forma PDF with IBAN, swift BIC, and order reference. Goods are dispatched immediately upon payment confirmation.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs sticky top-20 space-y-6">
              <h2 className="text-base font-bold text-brand-navy pb-3 border-b border-slate-100">
                Order Review ({itemCount} {itemCount === 1 ? 'part' : 'parts'})
              </h2>

              {/* Items overview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-800 truncate">{product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        OEM: {product.oemNumber} • Qty: {quantity}
                      </div>
                    </div>
                    <div className="font-bold text-slate-800 shrink-0">
                      {formatCentsToEur(product.priceCents * quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Parts Subtotal:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCentsToEur(subtotalCents)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>European Shipping ({countryCode}):</span>
                  <span className="font-semibold text-slate-800">
                    {formatCentsToEur(calculatedShipping)}
                  </span>
                </div>

                {discountCents > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-{formatCentsToEur(discountCents)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>
                    VAT ({isReverseCharge ? '0% Reverse Charge' : '21.00%'}):
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatCentsToEur(taxCents)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-brand-navy">Final Total:</span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                      All taxes & freight included
                    </span>
                  </div>
                  <span className="text-2xl font-black text-brand-navy">
                    {formatCentsToEur(grandTotalCents)}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                By placing this order you accept TRUCKORA's General Terms of Sale and confirm verified commercial truck parts specifications.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
