import React from 'react';
import Link from 'next/link';
import { Truck, Phone, ShieldCheck, Clock } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-navy-dark text-slate-300 text-xs py-2 px-4 border-b border-brand-navy">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2 text-white">
            <Truck className="w-3.5 h-3.5 text-brand-orange" />
            <span>European Heavy Commercial Freight & Pallet Dispatch Available</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OEM Verified Specifications</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/contact"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>B2B Support: Mon - Fri 08:00 - 18:00 CET</span>
          </Link>
          <span className="text-slate-600">|</span>
          <a
            href="tel:+31105554900"
            className="flex items-center gap-1.5 font-medium text-brand-orange hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+31 (0) 10 555 4900</span>
          </a>
        </div>
      </div>
    </div>
  );
}
