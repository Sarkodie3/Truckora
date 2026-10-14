import React from 'react';
import Link from 'next/link';
import { PackageOpen, ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-truckora-border p-8 shadow-xs text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <PackageOpen className="w-8 h-8 text-brand-orange" />
        </div>

        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Error 404 • Resource Not Located
        </span>

        <h1 className="text-2xl font-black text-brand-navy">
          Part or Page Not Found
        </h1>

        <p className="text-xs text-slate-500 leading-relaxed">
          The requested truck part or catalogue section does not exist or has been superseded by a newer OEM reference number.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/products"
            className="bg-brand-navy hover:bg-brand-orange text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors inline-block"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
