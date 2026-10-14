'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Order,
  Product,
  CustomerEnquiry,
  OrderStatus,
} from '@/types';
import { formatCentsToEur, formatDate } from '@/lib/utils';
import { updateOrderStatus, addShipmentToOrder } from '@/lib/services/orders';
import { updateProduct } from '@/lib/services/products';
import { updateEnquiryStatus } from '@/lib/services/enquiries';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  Plus,
} from 'lucide-react';

interface Props {
  initialOrders: Order[];
  lowStockProducts: Product[];
  openEnquiries: CustomerEnquiry[];
}

export default function AdminDashboardClient({
  initialOrders,
  lowStockProducts: initialLowStock,
  openEnquiries: initialEnquiries,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [lowStock, setLowStock] = useState<Product[]>(initialLowStock);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(initialEnquiries);

  // Shipment tracking modal state
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('DHL Freight');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Stock adjustment state
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);
  const [newStockQty, setNewStockQty] = useState<number>(10);

  // Enquiry response state
  const [answeringEnquiryId, setAnsweringEnquiryId] = useState<string | null>(null);
  const [enquiryResponse, setEnquiryResponse] = useState('');

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrderId || !trackingNumber.trim()) return;

    const res = await addShipmentToOrder(shippingOrderId, {
      carrier,
      trackingNumber: trackingNumber.trim(),
      trackingUrl: `https://www.dhl.com/track?tracking-id=${encodeURIComponent(trackingNumber.trim())}`,
    });

    if (res) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === shippingOrderId ? { ...o, status: 'shipped', shipments: [res] } : o
        )
      );
      setShippingOrderId(null);
      setTrackingNumber('');
    }
  };

  const handleStockUpdate = async (productId: string) => {
    const updated = await updateProduct(productId, { stockQuantity: newStockQty });
    if (updated) {
      setLowStock((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newStockQty } : p))
      );
      setAdjustingProductId(null);
    }
  };

  const handleReplyEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringEnquiryId || !enquiryResponse.trim()) return;

    const updated = await updateEnquiryStatus(answeringEnquiryId, 'resolved', enquiryResponse.trim());
    if (updated) {
      setEnquiries((prev) => prev.filter((enq) => enq.id !== answeringEnquiryId));
      setAnsweringEnquiryId(null);
      setEnquiryResponse('');
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Recent Orders Management Table */}
      <div className="bg-white rounded-xl border border-truckora-border shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-brand-navy">
              Live Orders & Fulfilment Workflow
            </h2>
            <p className="text-xs text-slate-500">
              Manage status transitions, assign European freight tracking numbers, and view customer snapshots.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
          >
            <span>View Complete Orders Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer & VAT</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                    <Link
                      href={`/order-confirmation/${ord.id}`}
                      className="hover:underline text-brand-orange"
                    >
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {formatDate(ord.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {ord.shippingAddress.companyName || ord.shippingAddress.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {ord.shippingAddress.countryCode} {ord.shippingAddress.vatNumber ? `• ${ord.shippingAddress.vatNumber}` : ''}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="truncate font-medium text-slate-800">
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ord.items.length} parts in consignment
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCentsToEur(ord.totalCents)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-navy cursor-pointer"
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="paid">Paid & Verified</option>
                        <option value="processing">Warehouse Processing</option>
                        <option value="ready_for_dispatch">Ready for Dispatch</option>
                        <option value="shipped">Dispatched / Shipped</option>
                        <option value="delivered">Delivered to Workshop</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {ord.status !== 'shipped' && ord.status !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => setShippingOrderId(ord.id)}
                          className="bg-brand-navy hover:bg-brand-navy-light text-white p-1 rounded transition-colors text-[11px] font-bold px-2 flex items-center gap-1"
                          title="Assign tracking code"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Modal */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-xl border border-truckora-border max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-orange" />
              <span>Record European Shipment Details</span>
            </h3>

            <form onSubmit={handleAddShipment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Freight Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-brand-navy"
                >
                  <option value="DHL Freight Euroconnect">DHL Freight Euroconnect (Pallets)</option>
                  <option value="Kuehne+Nagel Road Logistics">Kuehne+Nagel Road Logistics</option>
                  <option value="DPD Express Logistics">DPD Express Logistics (Parcels)</option>
                  <option value="UPS Supply Chain Solutions">UPS Supply Chain Solutions</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Airwaybill / Waybill Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DHL-EU-892304910"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono uppercase focus:border-brand-navy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShippingOrderId(null)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-1.5 rounded font-bold"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-Column Split: Low Stock Alarms & Customer VIN Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Management */}
        <div className="bg-white rounded-xl border border-truckora-border p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-brand-navy flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Inventory Warnings (≤ 3 Units)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Quick-adjust warehouse stock levels or place supplier reorders.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-xs text-brand-orange font-bold hover:underline"
            >
              All Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 truncate">{prod.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    OEM: {prod.oemNumber} • Current Stock: {prod.stockQuantity}
                  </div>
                </div>

                {adjustingProductId === prod.id ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      value={newStockQty}
                      onChange={(e) => setNewStockQty(Number(e.target.value))}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded font-mono text-center"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleStockUpdate(prod.id)}
                      className="bg-emerald-600 text-white px-2 py-1 rounded font-bold text-[11px]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustingProductId(prod.id);
                      setNewStockQty(prod.stockQuantity + 5);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-semibold text-[11px] shrink-0"
                  >
                    Adjust Stock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customer VIN Fitment Tickets */}
        <div className="bg-white rounded-xl border border-truckora-border p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-brand-navy">
                Open VIN & Fitment Inquiries ({enquiries.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                EPC chassis lookup requests submitted by workshops.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="text-xs text-brand-orange font-bold hover:underline"
            >
              All Inquiries →
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.length > 0 ? (
              enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-lg border border-slate-200 text-xs space-y-2 bg-slate-50/50"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-navy">
                      {enq.fullName} ({enq.truckMake} {enq.truckModel})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatDate(enq.createdAt)}
                    </span>
                  </div>

                  {enq.vin && (
                    <div className="font-mono text-[11px] bg-slate-200/70 px-2 py-0.5 rounded text-slate-800">
                      VIN: {enq.vin}
                    </div>
                  )}

                  <p className="text-slate-600 leading-snug">{enq.message}</p>

                  {answeringEnquiryId === enq.id ? (
                    <form onSubmit={handleReplyEnquiry} className="space-y-2 pt-2">
                      <textarea
                        required
                        rows={2}
                        value={enquiryResponse}
                        onChange={(e) => setEnquiryResponse(e.target.value)}
                        placeholder="Provide EPC verification or recommended part number..."
                        className="w-full p-2 border border-slate-300 rounded text-xs focus:border-brand-navy focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAnsweringEnquiryId(null)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-700 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-brand-navy text-white px-3 py-1 rounded font-bold flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Response</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setAnsweringEnquiryId(enq.id);
                          setEnquiryResponse(
                            `Verified with manufacturer EPC. The part fits chassis ${enq.vin || ''} without modification.`
                          );
                        }}
                        className="bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-1 rounded font-bold text-[11px] transition-colors"
                      >
                        Answer Inquiry
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                No open VIN inquiries pending review.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
