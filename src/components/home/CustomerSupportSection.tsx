'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Phone, Mail, FileQuestion, ArrowRight } from 'lucide-react';
import CompatibilityEnquiryModal from '@/components/products/CompatibilityEnquiryModal';

export default function CustomerSupportSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-12 bg-white border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <HelpCircle className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Technical Fitment Assistance</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Can't Find the Exact Part or OEM Number?
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Truck components frequently change across series revisions and engine emissions codes. Submit your truck chassis details or VIN, and our commercial vehicle technicians will identify the correct part for you.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileQuestion className="w-4 h-4" />
                <span>Submit Vehicle Fitment Enquiry</span>
              </button>

              <a
                href="tel:+31105554900"
                className="bg-brand-navy-light hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors border border-slate-600/50"
              >
                <Phone className="w-4 h-4 text-brand-orange" />
                <span>Call +31 (0) 10 555 4900</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <CompatibilityEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
