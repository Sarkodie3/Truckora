'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  FileQuestion,
  ShieldCheck,
  Building,
  Calendar,
  ExternalLink,
  ChevronRight,
  LogOut,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { getOrders } from '@/lib/services/orders';
import { getEnquiries } from '@/lib/services/enquiries';
import { Order, CustomerEnquiry } from '@/types';
import { formatCentsToEur, formatDate } from '@/lib/utils';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'enquiries'>('orders');

  // Customer demo profile
  const [profile, setProfile] = useState({
    fullName: 'Hans Becker',
    email: 'purchasing@trans-rhine.de',
    phone: '+49 221 9898 120',
    companyName: 'Trans-Rhine Spedition GmbH',
    vatNumber: 'DE812345678',
    streetAddress: 'Industriestraße 88',
    postalCode: '50667',
    city: 'Köln',
    countryCode: 'DE',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      const [orderList, enquiryList] = await Promise.all([
        getOrders(),
        getEnquiries(),
      ]);
      setOrders(orderList);
      setEnquiries(enquiryList);
    }
    loadUserData();
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-truckora-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
            B2B Fleet Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Customer Account & Order History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{profile.fullName}</span> ({profile.companyName})
          </p>
        </div>

        <Link
          href="/auth/login"
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-brand-orange" />
              <span>Order History & Invoices</span>
            </div>
            <span className="text-[10px] bg-slate-800/20 px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-brand-orange" />
              <span>Company & VAT Details</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'enquiries'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileQuestion className="w-4 h-4 text-brand-orange" />
              <span>VIN Fitment Enquiries</span>
            </div>
            <span className="text-[10px] bg-slate-800/20 px-2 py-0.5 rounded-full">
              {enquiries.length}
            </span>
          </button>

          {/* Quick Support Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6 text-xs text-slate-600">
            <span className="font-bold text-brand-navy block mb-1">Commercial Support Line</span>
            <p className="text-[11px] text-slate-500 mb-2">
              Need assistance modifying a pending dispatch or adding core exchange deposits?
            </p>
            <a
              href="tel:+31105554900"
              className="text-brand-orange hover:underline font-bold block"
            >
              +31 (0) 10 555 4900 →
            </a>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-brand-navy">Order History ({orders.length})</h2>

              {orders.length > 0 ? (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-truckora-border p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-brand-navy">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {formatDate(ord.createdAt)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Delivery to: {ord.shippingAddress.city}, {ord.shippingAddress.countryCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status.replace('_', ' ')}
                        </span>
                        <Link
                          href={`/order-confirmation/${ord.id}`}
                          className="text-xs text-brand-orange hover:underline font-bold"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <div className="truncate pr-4">
                            <span className="font-bold text-slate-800">{item.productName}</span>
                            <span className="text-slate-400 font-mono ml-2 text-[11px]">
                              Qty: {item.quantity} • {item.condition}
                            </span>
                          </div>
                          <span className="font-bold text-slate-800 shrink-0">
                            {formatCentsToEur(item.subtotalCents)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        {ord.taxCents === 0 ? 'Intra-EU Reverse Charge (0% VAT)' : 'Includes VAT'}
                      </span>
                      <div className="text-right">
                        <span className="text-slate-500 mr-2">Total Paid:</span>
                        <span className="text-sm font-black text-brand-navy">
                          {formatCentsToEur(ord.totalCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-truckora-border p-12 text-center text-xs text-slate-500">
                  No orders placed yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & VAT DETAILS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs">
              <h2 className="text-base font-bold text-brand-navy mb-4 pb-2 border-b border-slate-100">
                Company & European Tax Profile
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Representative
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Company Name
                    </label>
                    <input
                      type="text"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      European VAT Identification Number
                    </label>
                    <input
                      type="text"
                      value={profile.vatNumber}
                      onChange={(e) => setProfile({ ...profile, vatNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono uppercase focus:border-brand-navy focus:outline-none"
                    />
                    <p className="text-[10px] text-emerald-700 mt-1">
                      ✓ Status: Valid for EU Intra-Community Reverse Charge (0.00% VAT)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Billing Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Workshop Address
                  </label>
                  <input
                    type="text"
                    value={profile.streetAddress}
                    onChange={(e) => setProfile({ ...profile, streetAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={profile.postalCode}
                      onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profile.countryCode}
                      disabled
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-slate-50 text-slate-500 font-bold"
                    />
                  </div>
                </div>

                {savedSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Company details updated successfully.</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-brand-navy hover:bg-brand-navy-light text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: VIN & COMPATIBILITY ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-brand-navy">
                Fitment & VIN Enquiries ({enquiries.length})
              </h2>

              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-xl border border-truckora-border p-5 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-brand-navy">
                      {enq.truckMake} {enq.truckModel} {enq.truckYear ? `(${enq.truckYear})` : ''}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                      {enq.status}
                    </span>
                  </div>

                  {enq.vin && (
                    <div className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded">
                      Chassis VIN: {enq.vin}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">{enq.message}</p>

                  {enq.adminResponse ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-xs text-emerald-900 leading-relaxed">
                      <span className="font-bold block text-emerald-800 mb-0.5">
                        Technical Response from TRUCKORA Workshop:
                      </span>
                      {enq.adminResponse}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Under review by parts engineer against OEM EPC database.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
