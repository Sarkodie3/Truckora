import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Truck, Cog, CheckCircle2, Building, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TRUCKORA — Commercial Vehicle Spares Distribution',
  description:
    'Learn about TRUCKORA, European distributor of verified OEM, factory-reconditioned, and tested used truck spare parts based in Rotterdam, Netherlands.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          European B2B Parts Infrastructure
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
          Truck Parts. Trusted Supply.
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          TRUCKORA was engineered to solve the most pressing challenge facing modern road logistics: fleet downtime. We supply verified OEM, tested used, and factory reconditioned parts directly to commercial fleet operators, workshops, and parts dealers across Europe.
        </p>
      </div>

      {/* 3 Core Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-brand-orange">
            <Cog className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-navy text-base">Technical Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every part in our database is catalogued with manufacturer OEM numbers and verified against commercial vehicle electronic parts catalogues (EPC) to ensure direct fitment.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-brand-orange">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-navy text-base">Pallet & Express Freight</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            From heavy gearboxes and engines on Euro-pallets to urgent pneumatic calipers and sensors, our Rotterdam distribution center dispatches daily across the continent.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-brand-orange">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-navy text-base">Warranty & Core Exchange</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full European commercial warranty coverage of 6 to 24 months, backed by an organized reman core exchange process that keeps maintenance budgets transparent.
          </p>
        </div>
      </div>

      {/* Operations Statement */}
      <div className="bg-white rounded-2xl border border-truckora-border p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-brand-navy">Warehouse & Logistics Base</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Centrally situated in the port logistics cluster of Rotterdam, Netherlands, TRUCKORA operates with direct highway and intermodal access to key European transport corridors, ensuring that workshop orders reach destinations across Germany, Belgium, France, Scandinavia, and Southern Europe without delay.
        </p>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Registered European Commercial Vendor • EU VAT ID Verification Supported
          </div>
          <Link
            href="/contact"
            className="bg-brand-navy hover:bg-brand-orange text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <span>Contact Commercial Sales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
