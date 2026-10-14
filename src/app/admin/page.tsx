import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Settings,
  Tag,
  FileQuestion,
} from 'lucide-react';
import { getOrders, getOrderMetrics, updateOrderStatus } from '@/lib/services/orders';
import { getProducts } from '@/lib/services/products';
import { getEnquiries } from '@/lib/services/enquiries';
import { formatCentsToEur, formatDate } from '@/lib/utils';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Control Center — TRUCKORA',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [metrics, orders, { products }, enquiries] = await Promise.all([
    getOrderMetrics(),
    getOrders(),
    getProducts({ pageSize: 50 }),
    getEnquiries('open'),
  ]);

  const lowStockProducts = products.filter((p) => p.stockQuantity <= 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="pb-6 mb-8 border-b border-truckora-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            TRUCKORA European Dispatch Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live inventory tracking, order fulfilment, and chassis fitment management.
          </p>
        </div>

        {/* Quick Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products"
            className="bg-brand-navy hover:bg-brand-navy-light text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-brand-orange hover:bg-brand-orange-hover text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            Fulfil Orders
          </Link>
          <Link
            href="/admin/enquiries"
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            VIN Tickets ({enquiries.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-truckora-border shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Recorded B2B Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-brand-navy">
            {formatCentsToEur(metrics.totalSalesCents)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {metrics.totalOrders} processed customer orders
          </div>
        </div>

        {/* Orders in Fulfilment */}
        <div className="bg-white p-5 rounded-xl border border-truckora-border shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Pending Fulfilment</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-brand-navy">
            {metrics.pendingOrders}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Orders awaiting pallet packing or courier pickup
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-truckora-border shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Low Stock Alarms</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-brand-navy">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            Parts with ≤ 3 units remaining in Rotterdam hub
          </div>
        </div>

        {/* Open VIN & Fitment Tickets */}
        <div className="bg-white p-5 rounded-xl border border-truckora-border shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-2">
            <span>Open VIN Tickets</span>
            <FileQuestion className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl font-black text-brand-navy">
            {enquiries.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Customer chassis compatibility queries awaiting review
          </div>
        </div>
      </div>

      {/* Interactive Orders & Stock Management Hub */}
      <AdminDashboardClient
        initialOrders={orders}
        lowStockProducts={lowStockProducts}
        openEnquiries={enquiries}
      />
    </div>
  );
}
