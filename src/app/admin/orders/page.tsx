'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ArrowLeft,
  Truck,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getOrders, updateOrderStatus, addShipmentToOrder } from '@/lib/services/orders';
import { Order, OrderStatus } from '@/types';
import { formatCentsToEur, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('DHL Freight Euroconnect');
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadOrders = async () => {
    const list = await getOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrderId || !trackingNumber.trim()) return;

    await addShipmentToOrder(shippingOrderId, {
      carrier,
      trackingNumber: trackingNumber.trim(),
      trackingUrl: `https://www.dhl.com/track?tracking-id=${encodeURIComponent(trackingNumber.trim())}`,
    });

    setShippingOrderId(null);
    setTrackingNumber('');
    loadOrders();
  };

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 mb-8 border-b border-truckora-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-brand-orange flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Operations</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Orders Fulfilment & Logistics Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track consignments, manage order statuses, and record freight waybills.
          </p>
        </div>

        {/* Filter selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="paid">Paid & Verified</option>
            <option value="processing">Warehouse Processing</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="shipped">Dispatched / Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-truckora-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items Consignment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Waybill Tracking</th>
                <th className="py-3 px-4 text-right">Fulfilment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                    <Link
                      href={`/order-confirmation/${ord.id}`}
                      className="text-brand-orange hover:underline"
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
                    <div className="text-[10px] text-slate-400">
                      {ord.shippingAddress.city}, {ord.shippingAddress.countryCode}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium">
                    {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {formatCentsToEur(ord.totalCents)}
                  </td>
                  <td className="py-3.5 px-4">
                    {ord.shipments && ord.shipments.length > 0 ? (
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {ord.shipments[0].trackingNumber}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShippingOrderId(ord.id)}
                        className="text-brand-orange hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Assign Carrier</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="ready_for_dispatch">Ready for Dispatch</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
    </div>
  );
}
