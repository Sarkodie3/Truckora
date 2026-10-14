import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  FileText,
  Building,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { getOrderById } from '@/lib/services/orders';
import { formatCentsToEur, formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Confirmation — ${orderId}`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const statusColors = {
    pending_payment: 'bg-amber-100 text-amber-800 border-amber-300',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    processing: 'bg-blue-100 text-blue-800 border-blue-300',
    ready_for_dispatch: 'bg-purple-100 text-purple-800 border-purple-300',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
    refunded: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Hero */}
      <div className="bg-white rounded-2xl border border-truckora-border p-6 sm:p-10 shadow-sm text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
          European Logistics Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Commercial Order Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for choosing TRUCKORA. Your parts order has been entered into the Rotterdam warehouse fulfilment system.
        </p>

        {/* Key Metrics Banner */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Order Reference</div>
            <div className="text-sm font-black font-mono text-brand-navy mt-0.5">
              {order.orderNumber}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Order Date</div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">
              {formatDate(order.createdAt)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Payment Status</div>
            <div className="mt-0.5">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {order.paymentStatus}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Fulfilment Status</div>
            <div className="mt-0.5">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  statusColors[order.status] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Items Snapshot */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Purchased Truck Spare Parts
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-brand-navy truncate">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku} {item.oemNumber ? `• OEM: ${item.oemNumber}` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Qty: {item.quantity} × {formatCentsToEur(item.unitPriceCents)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-brand-navy">
                      {formatCentsToEur(item.subtotalCents)}
                    </div>
                    <div className="text-[10px] text-slate-400">Excl. VAT</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">
                  {formatCentsToEur(order.subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Freight Shipping:</span>
                <span className="font-semibold text-slate-800">
                  {formatCentsToEur(order.shippingCents)}
                </span>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>-{formatCentsToEur(order.discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Calculated VAT:</span>
                <span className="font-semibold text-slate-800">
                  {formatCentsToEur(order.taxCents)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-brand-navy">Total Paid (EUR):</span>
                <span className="font-black text-xl text-brand-navy">
                  {formatCentsToEur(order.totalCents)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipment & Live Tracking Record */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-orange" />
                <span>Freight Tracking Information</span>
              </h2>

              {order.shipments.map((ship) => (
                <div key={ship.id} className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Carrier: {ship.carrier}</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-mono font-bold">
                      Tracking: {ship.trackingNumber}
                    </span>
                  </div>
                  {ship.notes && (
                    <p className="text-slate-500 text-[11px]">{ship.notes}</p>
                  )}
                  {ship.trackingUrl && (
                    <a
                      href={ship.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-orange hover:underline font-bold inline-block mt-1"
                    >
                      Track Package on Carrier Portal →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer & Destination Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              Delivery Destination
            </h2>

            <div className="space-y-1 text-xs text-slate-700">
              <div className="font-bold text-brand-navy">{order.shippingAddress.fullName}</div>
              {order.shippingAddress.companyName && (
                <div className="font-semibold text-slate-800">
                  {order.shippingAddress.companyName}
                </div>
              )}
              {order.shippingAddress.vatNumber && (
                <div className="text-[11px] font-mono text-emerald-700">
                  VAT: {order.shippingAddress.vatNumber} (Reverse Charge)
                </div>
              )}
              <div>{order.shippingAddress.streetAddress}</div>
              <div>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </div>
              <div className="font-semibold text-slate-800">{order.shippingAddress.countryCode}</div>
              <div className="pt-2 text-slate-500 font-mono text-[11px]">
                Phone: {order.customerPhone || order.shippingAddress.phone}
              </div>
            </div>

            {order.customerNotes && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Delivery Remarks:
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  {order.customerNotes}
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
            <Link
              href="/products"
              className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Back to Spare Parts Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/account"
              className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center transition-colors border border-slate-300"
            >
              View Order in Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
